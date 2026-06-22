import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { observeOpenAI } from 'langfuse';
import { openai, getTracedOpenAI } from './openai';

/**
 * Returns a Langfuse-traced OpenAI instance.
 * If the user has provided their own API Key (BYOK) via the 'bean_byok_key' cookie,
 * it returns an instance configured with that key.
 * Otherwise, it falls back to the default platform API key instance.
 * 
 * @param req The incoming NextRequest containing cookies
 * @param config Optional Langfuse trace config (e.g. userId, tags)
 */
export function getDynamicAIClient(req: NextRequest, config?: any) {
  const byokKey = req.cookies.get('bean_byok_key')?.value;
  return getDynamicAIClientByKey(byokKey, config);
}

export function getDynamicAIClientByKey(byokKey?: string, config?: any) {
  if (byokKey && byokKey.startsWith('sk-')) {
    // Create a new instance with the user's key
    const rawClient = new OpenAI({
      apiKey: byokKey,
    });
    
    // Add the "byok" tag to easily identify these requests in Langfuse
    const traceConfig = {
      ...config,
      tags: [...(config?.tags || []), 'byok'],
    };

    return observeOpenAI(rawClient, traceConfig);
  }

  // Fallback to platform key
  if (config) {
    return getTracedOpenAI(config);
  }
  return openai;
}

export function getDynamicModel(req: NextRequest, fallbackModel: string = "gpt-4o-mini") {
  const byokKey = req.cookies.get('bean_byok_key')?.value;
  if (byokKey && byokKey.startsWith('sk-')) {
    // If they bring their own key, they can access gpt-4o or gpt-4o-mini. We default to gpt-4o-mini for speed/cost,
    // but we can let them use standard OpenAI models since it's their key.
    // For now, return gpt-4o-mini as a safe BYOK model
    return "gpt-4o-mini";
  }
  
  return fallbackModel;
}
