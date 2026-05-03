// =======================================================
// BEAN — API Route: GET /api/ai/insights/paths
// Generates and persists life path suggestions based on user DNA
// =======================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('bean_user_id')?.value;
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
      Basándote ÚNICAMENTE en el ADN del usuario, genera exactamente 3 posibles "Caminos de Vida" que se alineen con su perfil.
      
      ADN DEL USUARIO:
      ${dnaSummary}
      
      METAS ACTUALES:
      ${goalsSummary}
      
      INSTRUCCIONES:
      - Cada camino debe ser concreto y específico.
      - "dimensionName": Indica el área principal del ADN relacionada (ej: "Career", "Health", "Social").
      - "description": Una descripción de 2-3 frases explicando detalladamente en qué consiste este camino y por qué es una buena opción para el usuario.
      - Incluye un % de alineación estimado (entre 65% y 95%).
      - Incluye un emoji representativo.
      - Incluye 3 razones cortas (máx 8 palabras cada una) de por qué ese camino se alinea.
      - Incluye una pregunta inspiradora para abrir la conversación.
      
      Responde SOLO con este JSON:
      [
        {
          "title": "Nombre del camino de vida",
          "emoji": "🔬",
          "dimensionName": "Career",
          "alignment": 87,
          "tagline": "Una frase corta y poderosa",
          "description": "Explicación detallada del camino...",
          "reasons": ["Razón 1", "Razón 2", "Razón 3"],
          "starterQuestion": "¿Quieres que exploremos juntos este camino?"
        },
        { ... }
      ]
    `.trim();

    const aiRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 1500,
      })
    });

    if (!aiRes.ok) throw new Error(`Deepseek error: ${aiRes.status}`);

    const aiData = await aiRes.json();
    const raw = aiData.choices[0]?.message?.content ?? '[]';

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
    const userId = req.cookies.get('bean_user_id')?.value;
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

    const dnaSummary = user.attributes
      .map(a => `- ${a.dimension.label} (${a.category}): ${a.name}`)
      .join('\n');

    const currentTitles = user.suggestedPaths.map(p => p.title).join(', ');

    // 2. Call AI for ONE new path
    const prompt = `
      Eres BEAN Insights. El usuario quiere REEMPLAZAR una de sus sugerencias de vida.
      Genera exactamente 1 NUEVO "Camino de Vida" que sea diferente a estos: ${currentTitles}.
      
      ADN DEL USUARIO:
      ${dnaSummary}
      
      INSTRUCCIONES:
      - Debe ser concreto y específico.
      - "dimensionName": Área del ADN relacionada (Career, Health, Social, Finance, etc).
      - "description": 2-3 frases explicativas.
      - Incluye % alineación, emoji, tagline, 3 razones y starterQuestion.
      
      Responde SOLO con el objeto JSON para este camino único (no array, solo el objeto).
    `.trim();

    const aiRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
      })
    });

    if (!aiRes.ok) throw new Error(`Deepseek error: ${aiRes.status}`);
    const aiData = await aiRes.json();
    const raw = aiData.choices[0]?.message?.content ?? '{}';
    
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
