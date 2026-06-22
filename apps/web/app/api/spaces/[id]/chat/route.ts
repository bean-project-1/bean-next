import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '../../../../../lib/prisma';
import { getTracedOpenAI } from '../../../../../lib/openai';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: spaceId } = resolvedParams;
    
    // For MVP, we fetch all messages for the space
    const messages = await prisma.spaceMessage.findMany({
      where: { spaceId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true, avatarUrl: true, id: true } }
      }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: spaceId } = resolvedParams;
    const { content, mentions } = await req.json();

    if (!content.trim()) return NextResponse.json({ error: 'Empty message' }, { status: 400 });

    // Save user message
    const userMessage = await prisma.spaceMessage.create({
      data: {
        spaceId,
        userId: session.user.id,
        role: 'user',
        content,
        mentions: mentions || []
      },
      include: {
        user: { select: { name: true, avatarUrl: true, id: true } }
      }
    });

    const isBeanMentioned = mentions && mentions.includes('bean');

    if (isBeanMentioned) {
      const history = await prisma.spaceMessage.findMany({
        where: { spaceId },
        orderBy: { createdAt: 'asc' },
        take: 20,
        include: {
          user: {
            select: { name: true }
          }
        }
      });

      const aiMessages = [
        { 
          role: 'system', 
          content: `Eres BEAN, el agente de IA de este Árbol/Espacio. 
Tu misión es ayudar a crear y organizar metas.
Puedes usar 'create_goal' para añadir una rama al árbol. 
Se conversacional, amigable y al grano.` 
        },
        ...history.map(m => ({ 
          role: m.role === 'user' ? 'user' : 'assistant', 
          content: m.role === 'user' ? `[${m.user?.name || 'Usuario'}]: ${m.content}` : m.content 
        }))
      ];

      const tracedClient = getTracedOpenAI({ userId: session.user.id, tags: ["agent:space_chat"] });

      const tools = [
        {
          type: "function",
          function: {
            name: "create_goal",
            description: "Crea una nueva meta (rama) en el árbol.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "El título corto de la meta" },
                description: { type: "string", description: "Descripción de la meta" }
              },
              required: ["title", "description"],
              additionalProperties: false
            },
            strict: true
          }
        }
      ];

      const response = await tracedClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: aiMessages as any,
        temperature: 0.7,
        tools: tools as any,
        tool_choice: "auto",
      });

      const choice = response.choices[0];
      const toolCall = choice.message?.tool_calls?.[0];

      let aiResponseContent = choice.message?.content || "";

      if (toolCall && toolCall.type === 'function' && toolCall.function.name === 'create_goal') {
        const { title, description } = JSON.parse(toolCall.function.arguments);
        
        await prisma.goal.create({
          data: {
            spaceId: spaceId === 'personal' ? null : spaceId,
            userId: session.user.id,
            title,
            description,
            status: 'active'
          }
        });

        aiResponseContent = `¡Listo! Acabo de crear la rama "${title}" en el árbol.`;
      }

      if (aiResponseContent || choice.message?.content) {
        await prisma.spaceMessage.create({
          data: {
            spaceId,
            role: 'assistant',
            content: aiResponseContent || choice.message?.content || "",
            mentions: []
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: userMessage });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
