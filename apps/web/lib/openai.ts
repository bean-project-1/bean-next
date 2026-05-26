import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash_if_unused',
});

export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key_to_prevent_crash_if_unused',
  baseURL: 'https://api.deepseek.com',
});
