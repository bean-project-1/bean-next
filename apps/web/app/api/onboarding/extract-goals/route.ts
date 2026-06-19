import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Langfuse, observeOpenAI } from 'langfuse';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { text, attributes } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";

    const openai = observeOpenAI(new OpenAI({
      apiKey: hasOpenAI ? process.env.OPENAI_API_KEY : process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || (!hasOpenAI && process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com/v1' : undefined)
    }), {
      userId: userId || "anonymous",
      tags: ["agent:onboarding", `env:${process.env.NODE_ENV || 'development'}`]
    });

    const langfuse = new Langfuse();
    const trace = langfuse.trace({
      name: 'Onboarding - Extract Goals',
      metadata: { textLength: text.length }
    });

    const model = hasOpenAI ? "gpt-4o-mini" : "deepseek-chat";

    const prompt = `You are an expert AI Life Coach for the BEAN platform.
Your task is to extract structured life goals from a user's natural language response.

## CONTEXT
The user was asked what their main goals are right now. Here is their response:
"${text}"

${attributes ? `\n## USER DNA (Attributes)
${JSON.stringify(attributes)}` : ''}

## OBJECTIVE
Identify 1 to 3 main overarching goals the user wants to achieve based on their text. If they mention specific habits, roll them up into a larger goal if it makes sense, or keep them as specific goals.

## RULES
1. Output ONLY valid JSON matching this schema:
{
  "goals": [
    { "title": "Aprender React y Desarrollo Frontend" },
    { "title": "Mejorar mi condición cardiovascular" }
  ]
}
2. The title should be actionable and concise (max 8 words).
3. Always respond in Spanish.`;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message.content || '{"goals": []}';
    let data;
    try {
      data = JSON.parse(rawContent);
    } catch (e) {
      data = { goals: [{ title: 'Mi nueva meta' }] };
    }

    trace.update({ metadata: { extracted: data.goals.length } });

    return NextResponse.json({ goals: data.goals });
  } catch (error: any) {
    console.error('[API Extract Goals]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
