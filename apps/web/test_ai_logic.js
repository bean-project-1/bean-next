function getAIClientMock(env) {
  const gptKey = env.OPENAI_API_KEY;
  const deepseekKey = env.DEEPSEEK_API_KEY;

  if (gptKey) {
    return { provider: 'openai', model: "gpt-4o-mini" };
  }

  if (deepseekKey) {
    return { provider: 'deepseek', model: "deepseek-chat" };
  }

  return null;
}

console.log('Case 1 (Only DeepSeek):', getAIClientMock({ DEEPSEEK_API_KEY: 'sk-...' }));
console.log('Case 2 (GPT and DeepSeek):', getAIClientMock({ OPENAI_API_KEY: 'sk-...', DEEPSEEK_API_KEY: 'sk-...' }));
console.log('Case 3 (None):', getAIClientMock({ }));
