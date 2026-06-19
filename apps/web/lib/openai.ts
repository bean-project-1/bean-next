import OpenAI from 'openai';
import { observeOpenAI } from 'langfuse';

const rawOpenai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash_if_unused',
});

const rawDeepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key_to_prevent_crash_if_unused',
  baseURL: 'https://api.deepseek.com',
});

export const openai = observeOpenAI(rawOpenai);
export const deepseek = observeOpenAI(rawDeepseek);

export const getTracedOpenAI = (config: any) => observeOpenAI(rawOpenai, config);
export const getTracedDeepseek = (config: any) => observeOpenAI(rawDeepseek, config);
