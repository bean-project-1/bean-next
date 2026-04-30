// =======================================================
// BEAN — API Route: GET /api/ai/insights/paths
// Generates 3 life path suggestions based on user DNA
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

    const prompt = `
Eres BEAN Insights, un experto en desarrollo personal y planificación de vida. 
Basándote ÚNICAMENTE en el ADN del usuario, genera exactamente 3 posibles "Caminos de Vida" que se alinean con su perfil.

ADN DEL USUARIO:
${dnaSummary}

METAS ACTUALES:
${goalsSummary}

INSTRUCCIONES:
- Cada camino debe ser concreto y específico (ej: "Investigador en Neurociencias", no "Científico").
- Incluye un % de alineación estimado (entre 65% y 95%).
- Incluye un emoji representativo.
- Incluye 3 razones cortas (máx 8 palabras cada una) de por qué ese camino se alinea.
- Incluye una pregunta inspiradora para abrir la conversación.

Responde SOLO con este JSON (sin markdown, sin backticks, solo el JSON puro):
[
  {
    "title": "Nombre del camino de vida",
    "emoji": "🔬",
    "alignment": 87,
    "tagline": "Una frase corta y poderosa que describe este camino",
    "reasons": ["Razón 1", "Razón 2", "Razón 3"],
    "starterQuestion": "¿Quieres que exploremos juntos este camino?"
  },
  { ... },
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
        max_tokens: 1000,
      })
    });

    if (!aiRes.ok) {
      throw new Error(`Deepseek error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices[0]?.message?.content ?? '[]';

    let paths;
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      paths = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse paths JSON:', raw);
      return NextResponse.json({ success: false, error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json({ success: true, paths });
  } catch (error: any) {
    console.error('[GET /api/ai/insights/paths] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
