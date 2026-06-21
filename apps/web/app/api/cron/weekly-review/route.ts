import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';
import { sendWebPush } from '@/services/notifications/DeliveryService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Validate Vercel Cron Secret if configured
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('[WeeklyReview Cron] Starting weekly audit...');

    // 1. Get users who have Web Push Subscriptions
    const users = await prisma.user.findMany({
      where: {
        pushSubscriptions: { some: {} }
      },
      include: {
        pushSubscriptions: true
      }
    });

    // 2. Filter users who have weekly review enabled (enabled by default)
    const optInUsers = users.filter(user => {
      const prefs = user.notificationPreferences as any;
      return prefs?.weeklyReview !== false;
    });

    console.log(`[WeeklyReview Cron] Found ${optInUsers.length} users with weekly review enabled.`);

    const results = [];
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    for (const user of optInUsers) {
      try {
        console.log(`[WeeklyReview Cron] Auditing user ${user.email} (${user.id})`);

        // A. Fetch user consistency data for the last 7 days
        // - Daily Tasks
        const dailyTasks = await prisma.dailyTask.findMany({
          where: {
            userId: user.id,
            date: { gte: lastWeek, lte: now }
          }
        });
        const totalDaily = dailyTasks.length;
        const completedDaily = dailyTasks.filter(t => t.isCompleted).length;

        // - Active Goals and actions due or completed this week
        const goals = await prisma.goal.findMany({
          where: {
            userId: user.id,
            status: 'active'
          },
          include: {
            actions: {
              where: {
                OR: [
                  { targetDate: { gte: lastWeek, lte: now } },
                  { isCompleted: true, updatedAt: { gte: lastWeek } }
                ]
              }
            }
          }
        });

        let completedActions = 0;
        let pendingActions = 0;
        const actionsSummaryList: string[] = [];

        for (const goal of goals) {
          const completed = goal.actions.filter(a => a.isCompleted).length;
          const pending = goal.actions.filter(a => !a.isCompleted).length;
          completedActions += completed;
          pendingActions += pending;
          actionsSummaryList.push(`Meta "${goal.title}": ${completed} completadas, ${pending} pendientes`);
        }

        // - Base commitments (habits) active
        const commitments = await prisma.baseCommitment.findMany({
          where: {
            userId: user.id,
            isActive: true
          }
        });

        const commitmentsSummaryList = commitments.map(c => {
          const completedThisWeek = c.lastCompletedAt && new Date(c.lastCompletedAt) >= lastWeek;
          const statusStr = completedThisWeek
            ? `completado esta semana (racha actual: ${c.streakCount} días)`
            : `sin registrar esta semana (último registro: ${c.lastCompletedAt ? new Date(c.lastCompletedAt).toLocaleDateString('es-ES') : 'nunca'})`;
          return `- Ritmo (${c.type === 'work' ? 'Trabajo' : c.type === 'study' ? 'Estudio' : 'Rutina'}): "${c.title}" - ${statusStr}`;
        });

        // B. Generate consistency summary block
        const summaryText = `
Resumen de consistencia del usuario (${lastWeek.toLocaleDateString('es-ES')} al ${now.toLocaleDateString('es-ES')}):
- Tareas diarias completadas: ${completedDaily}/${totalDaily}
- Acciones de metas del árbol de vida: ${completedActions} completadas, ${pendingActions} pendientes
Detalles por meta:
${actionsSummaryList.length > 0 ? actionsSummaryList.map(a => `- ${a}`).join('\n') : 'Sin actividades de metas registradas esta semana.'}

Ritmos y Hábitos semanales:
${commitmentsSummaryList.length > 0 ? commitmentsSummaryList.join('\n') : 'Sin ritmos o hábitos activos registrados.'}
        `.trim();

        console.log(`[WeeklyReview Cron] Summary for ${user.email}:\n`, summaryText);

        // C. Generate warm OpenAI greeting welcome message
        const prompt = `
Eres el Guía BEAN, el Coach de Vida Inteligente. Vas a redactar el mensaje de bienvenida inicial para la **Revisión Semanal Proactiva** de ${user.name || 'Viajero'}.

Aquí están los datos reales de su desempeño de la última semana:
${summaryText}

Instrucciones para redactar el mensaje:
1. Sé cálido, empático, motivador e inteligente.
2. Primero celebra los logros y victorias (por pequeñas que sean). Si completó muchas tareas o fue constante en sus hábitos, felicítalo con entusiasmo. Si tuvo dificultades, sé comprensivo y enfócate en el aprendizaje y la flexibilidad del plan.
3. Menciona brevemente sus estadísticas clave (ej. completó X de Y tareas diarias, o mantuvo la racha en Z hábito) de forma natural y conversacional, NO como una lista de viñetas fría.
4. Finaliza el mensaje haciendo una pregunta abierta y empática sobre cómo se sintió con su ritmo esta semana y si hay alguna meta o hábito en el que sintió más resistencia y le gustaría que ajustemos juntos.
5. El mensaje debe estar en español, tener máximo 3-4 párrafos pequeños, ser muy amigable y humano.
        `.trim();

        const chatCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Eres el Guía BEAN, un coach de vida inteligente, empático y reflexivo.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        });

        const welcomeMessage = chatCompletion.choices[0].message?.content || 
          `¡Hola ${user.name || 'Viajero'}! Es momento de nuestra revisión semanal. ¿Cómo te fue esta semana con tus metas y ritmos diarios?`;

        // D. Create a new weekly review chat session
        const chatSession = await prisma.chatSession.create({
          data: {
            userId: user.id,
            context: 'weekly_review'
          }
        });

        // E. Seed system prompt & welcome assistant message in session
        const systemPrompt = `
Eres el Guía BEAN, el Coach de Vida Inteligente. Estás en medio de la **Revisión Semanal Proactiva** con el usuario.

Tu objetivo en esta conversación es:
1. **Auditar el progreso** de la semana pasada con un enfoque constructivo y motivador. Celebra los logros y mantén una actitud empática.
2. **Identificar fricciones**: Si el usuario no completó sus ritmos/hábitos o tareas, pregúntale con empatía qué ocurrió (falta de tiempo, energía, imprevistos, desmotivación).
3. **Proponer ajustes realistas**: Si hubo problemas de consistencia, ofrece soluciones concretas y viables:
   - Reducir las horas semanales dedicadas a una meta.
   - Ajustar el horario, frecuencia o días de un hábito o compromiso base.
   - Mover la fecha límite (deadline) de una meta hacia adelante de forma empática.
   - Simplificar tareas complejas dividiéndolas en subtareas de máximo 1.5 horas.
4. **Acordar cambios**: No impongas cambios. Debate con el usuario y obtén su consentimiento.

DATOS DE DESEMPEÑO SEMANA ANTERIOR:
${summaryText}

NOMBRE DEL USUARIO: ${user.name ?? 'Viajero'}

REGLAS DE FORMATO:
- Comunícate en español de manera muy natural, cálida y empática.
- No uses listas de viñetas aburridas ni hables de forma robótica.
- Usa **negritas** para conceptos clave.
- Respuestas cortas, conversacionales y enfocadas en un solo punto para mantener el diálogo fluido.
        `.trim();

        await prisma.chatMessage.createMany({
          data: [
            {
              sessionId: chatSession.id,
              role: 'system',
              content: systemPrompt
            },
            {
              sessionId: chatSession.id,
              role: 'assistant',
              content: welcomeMessage
            }
          ]
        });

        // F. Deliver Web Push Notification to all active user subscriptions
        let userSentCount = 0;
        const pushPayload = {
          title: 'Revisión Semanal BEAN 🔄',
          body: `¡Hola ${user.name || 'Viajero'}! Es momento de revisar tu progreso y ajustar tu plan de vida.`,
          url: '/home?context=weekly_review'
        };

        for (const sub of user.pushSubscriptions) {
          try {
            await sendWebPush(sub, pushPayload);
            userSentCount++;
          } catch (pushErr) {
            console.error(`[WeeklyReview Cron] Failed to send push to sub ${sub.id} for user ${user.id}:`, pushErr);
          }
        }

        // Log the notification event
        if (userSentCount > 0) {
          await prisma.notificationLog.create({
            data: {
              userId: user.id,
              type: 'weekly_review',
              channel: 'web_push',
              title: pushPayload.title,
              body: pushPayload.body
            }
          });
        }

        results.push({
          userId: user.id,
          email: user.email,
          success: true,
          notificationsSent: userSentCount,
          sessionId: chatSession.id
        });

      } catch (userErr: any) {
        console.error(`[WeeklyReview Cron] Failed processing user ${user.id}:`, userErr);
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: userErr?.message || String(userErr)
        });
      }
    }

    console.log(`[WeeklyReview Cron] Completed. Processed ${optInUsers.length} users.`);
    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error('[WeeklyReview Cron] Global Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
