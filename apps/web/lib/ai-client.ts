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
  const byokProvider = req.cookies.get('bean_byok_provider')?.value;
  return getDynamicAIClientByKey(byokKey, byokProvider, config);
}

export function getDynamicAIClientByKey(byokKey?: string, byokProvider?: string, config?: any) {
  if (byokKey && byokKey.length >= 10) {
    let baseURL = undefined;
    if (byokProvider === 'deepseek') {
      baseURL = "https://api.deepseek.com/v1";
    } else if (byokProvider === 'gemini') {
      baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";
    }

    // Create a new instance with the user's key
    const rawClient = new OpenAI({
      apiKey: byokKey,
      baseURL
    });
    
    // Add the "byok" tag to easily identify these requests in Langfuse
    const traceConfig = {
      ...config,
      tags: [...(config?.tags || []), 'byok', `provider:${byokProvider || 'openai'}`],
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
  const byokProvider = req.cookies.get('bean_byok_provider')?.value;
  return getDynamicModelByKey(byokKey, byokProvider, fallbackModel);
}

export function getDynamicModelByKey(byokKey?: string, byokProvider?: string, fallbackModel: string = "gpt-4o-mini", byokDefaultModel: string = "gpt-4o-mini") {
  if (byokKey && byokKey.length >= 10) {
    if (byokProvider === 'deepseek') return 'deepseek-chat';
    if (byokProvider === 'gemini') return 'gemini-1.5-flash';
    return byokDefaultModel;
  }

  return fallbackModel;
}
