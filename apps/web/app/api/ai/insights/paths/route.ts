// =======================================================
// BEAN — API Route: GET /api/ai/insights/paths
// Generates and persists life path suggestions based on user DNA
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { deepseek } from '@/lib/openai';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const regenerate = searchParams.get('regenerate') === 'true';

    // 1. Check for existing paths if not regenerating
    if (!regenerate) {
      const existingPaths = await prisma.suggestedPath.findMany({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      if (existingPaths.length > 0) {
        console.log(`[InsightsPaths] Returning ${existingPaths.length} cached paths for user ${userId}`);
        return NextResponse.json({ success: true, paths: existingPaths, cached: true });
      }
    }

    // 2. Fetch User Context for AI
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        attributes: { include: { dimension: true } },
        goals: { where: { status: 'active' }, select: { title: true } }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (user.attributes.length === 0) {
      return NextResponse.json({
        success: true,
        paths: [],
        message: 'No hay suficiente información en tu ADN para generar sugerencias.'
      });
    }

    const dnaSummary = user.attributes
      .map(a => `- ${a.dimension.label} (${a.category}): ${a.name}`)
      .join('\n');

    const goalsSummary = user.goals.length > 0
      ? user.goals.map(g => `- ${g.title}`).join('\n')
      : 'Sin metas activas.';

    // 3. Call AI
    const prompt = `
      Eres BEAN Insights, un experto en desarrollo personal y planificación de vida. 
      Basándote en el ADN del usuario y sus metas actuales, genera exactamente 3 posibles "Caminos de Vida" recomendados, cada uno respondiendo a una categoría específica:
      
      1. Sinergia Cruzada ("synergy"): Combina al menos dos dimensiones o atributos del ADN del usuario (por ejemplo, cruzar una carrera/estudio con un interés o habilidad, como estudiar bioingeniería y trabajar en desarrollo de software para crear una app de signos vitales). Explica esta sinergia de forma inspiradora.
      2. Siguiente Paso ("next_step"): Sugiere un siguiente paso lógico, especialización o certificación basada en sus metas activas o su profesión/habilidad principal (por ejemplo, si trabaja en desarrollo cloud, sugerir certificar en AWS/Azure; si trabaja en backend, sugerir una tecnología moderna relacionada).
      3. Enfoque de ADN ("dominant_dna"): Sugiere una meta o camino enfocado en su dimensión de ADN con mayor densidad de atributos o pilar destacado de identidad (por ejemplo, si su ADN tiene fuerte enfoque familiar, sugerir organizar un viaje familiar o rutina compartida; si es en salud, una meta de bienestar integral).

      ADN DEL USUARIO:
      ${dnaSummary}
      
      METAS ACTUALES:
      ${goalsSummary}
      
      INSTRUCCIONES:
      - Cada camino debe ser concreto, realista y específico.
      - "dimensionName": Indica el área principal de vida relacionada (ej: "Profesión", "Salud Física", "Familia y Relaciones", "Espiritualidad").
      - "description": Una descripción de 2-3 frases explicando detalladamente en qué consiste este camino y por qué se alinea perfectamente con su perfil.
      - "type": Debe ser exactamente "synergy" para la Sinergia Cruzada, "next_step" para el Siguiente Paso, y "dominant_dna" para el Enfoque de ADN.
      - Incluye un % de alineación estimado (entre 65% y 95%).
      - Incluye un emoji representativo.
      - Incluye 3 razones cortas (máx 8 palabras cada una) de por qué ese camino se alinea.
      - Incluye una pregunta inspiradora para abrir la conversación.
      
      Responde SOLO con este JSON:
      [
        {
          "title": "Nombre del camino de vida sugerido",
          "emoji": "🔬",
          "dimensionName": "Profesión",
          "alignment": 87,
          "tagline": "Una frase corta y poderosa",
          "description": "Explicación detallada de la propuesta...",
          "reasons": ["Razón 1", "Razón 2", "Razón 3"],
          "starterQuestion": "¿Quieres que exploremos juntos este camino?",
          "type": "synergy"
        },
        { ... }
      ]
    `.trim();

    const aiRes = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const raw = aiRes.choices[0]?.message?.content ?? '[]';

    let pathsData;
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      pathsData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ success: false, error: 'Failed to parse AI response' }, { status: 500 });
    }

    // 4. Persist Paths
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate old paths
      await tx.suggestedPath.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      });

      // Create new ones
      const createdPaths = [];
      for (const p of pathsData) {
        const newPath = await tx.suggestedPath.create({
          data: {
            userId,
            title: p.title,
            emoji: p.emoji,
            alignment: p.alignment,
            tagline: p.tagline,
            description: p.description,
            dimensionName: p.dimensionName,
            reasons: p.reasons,
            starterQuestion: p.starterQuestion,
            type: p.type || 'synergy',
            isActive: true
          }
        });
        createdPaths.push(newPath);
      }
      return createdPaths;
    });

    return NextResponse.json({ success: true, paths: result, cached: false });
  } catch (error: any) {
    console.error('[GET /api/ai/insights/paths] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { replaceId } = await req.json();
    if (!replaceId) {
      return NextResponse.json({ success: false, error: 'Missing replaceId' }, { status: 400 });
    }

    // 1. Get current context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        attributes: { include: { dimension: true } },
        goals: { where: { status: 'active' }, select: { title: true } },
        suggestedPaths: { where: { isActive: true } }
      }
    });

    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const pathToBeReplaced = user.suggestedPaths.find(p => p.id === replaceId);
    const typeToGenerate = pathToBeReplaced?.type ?? 'synergy';

    const dnaSummary = user.attributes
      .map(a => `- ${a.dimension.label} (${a.category}): ${a.name}`)
      .join('\n');

    const currentTitles = user.suggestedPaths.map(p => p.title).join(', ');

    // 2. Call AI for ONE new path
    const prompt = `
      Eres BEAN Insights. El usuario quiere REEMPLAZAR una de sus sugerencias de vida.
      Genera exactamente 1 NUEVO "Camino de Vida" que sea diferente a estos: ${currentTitles}.
      
      Este nuevo camino debe ser estrictamente de tipo: "${typeToGenerate}".
      
      INSTRUCCIONES DE TIPO PARA "${typeToGenerate}":
      ${typeToGenerate === 'synergy' ? '- Debe ser una Sinergia Cruzada: combina al menos dos dimensiones o atributos del ADN del usuario (por ejemplo, cruzar un estudio/profesión con un interés o habilidad para un proyecto único).' : ''}
      ${typeToGenerate === 'next_step' ? '- Debe ser un Siguiente Paso lógico: sugiere una especialización, certificación o evolución basada en sus metas actuales o su profesión/habilidad principal.' : ''}
      ${typeToGenerate === 'dominant_dna' ? '- Debe ser un Enfoque de ADN: sugerencia orientada a la dimensión más densa del ADN o pilar de identidad destacado (ej: familia, salud, etc.).' : ''}

      ADN DEL USUARIO:
      ${dnaSummary}
      
      INSTRUCCIONES GENERALES:
      - Debe ser concreto y específico.
      - "dimensionName": Área del ADN relacionada (ej: Profesión, Salud Física, Familia y Relaciones, etc).
      - "description": 2-3 frases explicativas de en qué consiste y por qué se alinea.
      - Incluye % alineación, emoji, tagline, 3 razones, y starterQuestion.
      - "type": Debe ser exactamente "${typeToGenerate}".
      
      Responde SOLO con el objeto JSON para este camino único (no array, solo el objeto).
    `.trim();

    const aiRes = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
    });

    const raw = aiRes.choices[0]?.message?.content ?? '{}';
    
    let newPathData;
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      newPathData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ success: false, error: 'Failed to parse AI response' }, { status: 500 });
    }

    // 3. Update DB
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate the old one
      await tx.suggestedPath.update({
        where: { id: replaceId },
        data: { isActive: false }
      });

      // Create the new one
      return await tx.suggestedPath.create({
        data: {
          userId,
          title: newPathData.title,
          emoji: newPathData.emoji,
          alignment: newPathData.alignment,
          tagline: newPathData.tagline,
          description: newPathData.description,
          dimensionName: newPathData.dimensionName,
          reasons: newPathData.reasons,
          starterQuestion: newPathData.starterQuestion,
          type: typeToGenerate,
          isActive: true
        }
      });
    });

    return NextResponse.json({ success: true, path: result });
  } catch (error: any) {
    console.error('[POST /api/ai/insights/paths] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
