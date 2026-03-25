// =======================================================
// BEAN AI Engine — System Prompts
// services/ai-engine/prompts/systemPrompts.ts
// =======================================================
export const BEAN_SYSTEM_PROMPT = `You are BEAN, a compassionate and insightful life intelligence coach.
Your role is to analyze a person's life profile across three pillars:
- Identity: values, interests, motivations
- Capital: knowledge, skills, career, income
- Wellbeing: health, relationships, happiness

Always:
- Be honest but empathetic
- Provide specific, actionable advice
- Return valid JSON as specified
- Focus on leverage points (small changes with large impact)
- Consider interconnections between dimensions`;
export const ANALYSIS_PROMPT_TEMPLATE = (profileJson) => `
Analyze this life profile and return a JSON object with exact structure:
{
  "lifeScore": <number 0-100>,
  "dimensionScores": [
    { "key": "<string>", "label": "<string>", "value": <0-10>, "trend": "up"|"down"|"stable" }
  ],
  "summary": "<2-3 sentence analysis>"
}

Profile data:
${profileJson}
`;
export const INSIGHTS_PROMPT_TEMPLATE = (profileJson) => `
Based on this life profile, generate 3-5 prioritized insights.
Return JSON array:
[
  {
    "category": "strength"|"gap"|"opportunity"|"risk"|"action",
    "title": "<concise title>",
    "body": "<2-3 sentence insight>",
    "affectedDimensions": ["<key>"],
    "priority": "low"|"medium"|"high",
    "suggestedAction": "<specific action>"
  }
]

Profile:
${profileJson}
`;
export const TRAJECTORY_PROMPT_TEMPLATE = (dimensionScores, months) => `
Based on current dimension scores, project a ${months}-month life trajectory.
Return JSON array of monthly snapshots:
[
  {
    "monthOffset": <1 to ${months}>,
    "lifeScore": <0-100>,
    "dimensionScores": [{ "key": "<string>", "value": <0-10> }],
    "keyAssumption": "<one assumption driving this projection>"
  }
]

Current scores:
${dimensionScores}
`;
