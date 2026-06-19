import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTracedOpenAI, getTracedDeepseek } from '@/lib/openai';
import { langfuse } from '@/lib/langfuse';

export const dynamic = 'force-dynamic';

/**
 * Configure AI Client based on available keys.
 * Priority: GPT (if key) > DeepSeek (if key)
 */
function getAIClient(config: any) {
  const gptKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  if (gptKey) {
    return {
      client: getTracedOpenAI(config),
      model: "gpt-4o-mini",
      provider: 'openai'
    };
  }

  if (deepseekKey) {
    return {
      client: getTracedDeepseek(config),
      model: "deepseek-chat",
      provider: 'deepseek'
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  // Try to get userId for tracing
  const session = await auth();
    const userId = session?.user?.id;

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

    const ai = getAIClient({
      userId: userId || "anonymous",
      tags: ["agent:onboarding", `env:${process.env.NODE_ENV || 'development'}`]
    });
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
          content: `You are an expert AI psychologist and profiler that extracts structured life profile data for a platform called BEAN.
Your task is to convert unstructured user input (like a chat transcript, CV, or biography) into a highly detailed and robust structured JSON format.

## CONTEXT
BEAN models a user holistically using 19 dimensions grouped into three categories:
- IDENTITY: values, personality, interests, purpose, motivations.
- HUMAN CAPITAL: knowledge, skills, career, income, social_capital, physical_health, resilience.
- LIFE EXPERIENCE: work_satisfaction, relationships, mental_wellbeing, free_time, personal_growth, impact, financial_security.

We store data in two main structures:
1. UserAttribute (static traits, preferences, soft/hard skills, personality traits, interests, job titles, values)
2. DimensionInput (recent events, routines, behaviors, measured activities like "works 8 hours", "trains 3 times a week")

## OBJECTIVE
Extract AS MUCH DATA AS POSSIBLE to build a robust profile. 
Do not be limited to what is explicitly said. Infer unstated but highly probable attributes (e.g., if someone is a "Senior Software Engineer", you MUST infer skills like "Problem Solving", "Logic", "Programming", and interests like "Technology" or "Continuous Learning").
Extract:
* attributes (long-term traits, skills, values, personality markers)
* inputs (recent or measurable activities, habits, commitments)

## RULES
1. Only use valid BEAN dimensions (exactly as written in the list above).
2. For the attribute "category", use values like "skill", "interest", "profession", "value", "personality", "routine".
3. Be generous and exhaustive with the extraction (aim to extract 10-20 attributes if the text allows).
4. Output ONLY valid JSON matching this schema exactly:
{
  "attributes": [
    { "dimension": "skills", "name": "Leadership", "category": "skill", "metadata": { "level": 80 } }
  ],
  "inputs": [
    { "dimension": "physical_health", "inputType": "routine", "valueJson": { "description": "Goes to gym 3 times a week" } }
  ]
}`
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
