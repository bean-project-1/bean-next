import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { langfuse } from '@/lib/langfuse';

export const dynamic = 'force-dynamic';

/**
 * Configure AI Client based on available keys.
 * Priority: GPT (if key) > DeepSeek (if key)
 */
function getAIClient() {
  const gptKey = process.env.OPENAI_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  if (gptKey) {
    return {
      client: new OpenAI({ apiKey: gptKey }),
      model: "gpt-4o-mini",
      provider: 'openai'
    };
  }

  if (deepseekKey) {
    return {
      client: new OpenAI({
        apiKey: deepseekKey,
        baseURL: "https://api.deepseek.com",
      }),
      model: "deepseek-chat",
      provider: 'deepseek'
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  // Try to get userId for tracing
  const userId = req.cookies.get('bean_user_id')?.value;

  // Start Langfuse trace
  const trace = langfuse.trace({
    name: "onboarding-extraction",
    userId: userId || "anonymous",
    public: true,
  });

  try {
    const { text } = await req.json();

    if (!text || text.length < 50) {
      trace.update({ output: { error: 'Text too short' } });
      return NextResponse.json({ error: 'Text too short' }, { status: 400 });
    }

    const ai = getAIClient();
    if (!ai) {
      trace.update({ output: { error: 'No AI provider configured' } });
      return NextResponse.json({ 
        success: false, 
        error: 'No AI provider configured. Please add OPENAI_API_KEY or DEEPSEEK_API_KEY to .env' 
      }, { status: 500 });
    }

    trace.update({ 
      metadata: { provider: ai.provider, model: ai.model } 
    });

    console.log(`[API Extract] Using provider: ${ai.provider} with model: ${ai.model}`);

    const completion = await ai.client.chat.completions.create({
      model: ai.model,
      messages: [
        {
          role: "system",
          content: `You are an AI system that extracts structured life profile data for a platform called BEAN.
Your task is to convert unstructured user input into a structured JSON format.

## CONTEXT
BEAN models a user using 19 dimensions: 
values, personality, interests, purpose, motivations, knowledge, skills, career, income, social_capital, physical_health, resilience, work_satisfaction, relationships, mental_wellbeing, free_time, personal_growth, impact, financial_security.

We store data in two main structures:
1. UserAttribute (static traits, preferences, skills)
2. DimensionInput (events, behaviors, activities)

## OBJECTIVE
Extract:
* attributes (long-term traits)
* inputs (recent or measurable activities)

## RULES
1. Only use valid BEAN dimensions.
2. Inferred data must be realistic.
3. Normalize metadata: level (0-100), frequency (1-5), importance (0-100).
4. Output ONLY valid JSON.`
        },
        {
          role: "user",
          content: text
        }
      ],
      // DeepSeek supports json_object too since it's OpenAI-compatible
      response_format: { type: "json_object" }
    }, {
      headers: {
        "X-Langfuse-Trace-Id": trace.id,
      }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    trace.update({ output: result });
    
    // Ensure logs are sent in serverless environment
    await langfuse.flushAsync();

    return NextResponse.json({ 
      success: true, 
      data: result,
      provider: ai.provider
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    trace.update({ output: { error: errorMsg } });
    await langfuse.flushAsync();

    console.error('[API Extract]', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to extract data',
      detail: errorMsg
    }, { status: 500 });
  }
}
