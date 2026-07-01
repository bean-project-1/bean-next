import { Annotation, StateGraph, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableConfig } from "@langchain/core/runnables";

// Define the State
export const PlanificadorState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  currentPhase: Annotation<string>({
    reducer: (x, y) => y,
    default: () => "COACH",
  }),
  smartCriteria: Annotation<{
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
  }>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({
      specific: 'Pending',
      measurable: 'Pending',
      achievable: 'Pending',
      relevant: 'Pending',
      timeBound: 'Pending'
    }),
  }),
  macroMilestones: Annotation<any[]>({
    reducer: (x, y) => y,
    default: () => [],
  }),
  actionPlan: Annotation<any>({
    reducer: (x, y) => y,
    default: () => null,
  }),
  attachedContext: Annotation<any>({
    reducer: (x, y) => y,
    default: () => null,
  }),
  config: Annotation<any>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  })
});

// Helper to get the correct model
const getLangchainModel = (config: any) => {
  if (config.byokKey && config.byokProvider === "openai") {
    return new ChatOpenAI({
      apiKey: config.byokKey,
      modelName: "gpt-4o-mini",
    });
  }
  // Default fallback
  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
  });
};

// ── Node 1: COACH ──
async function coachNode(state: typeof PlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const smartSystemPrompt = `You are a Goal Planner Coach. Your mission is to gather SMART criteria for a user's goal.
Current SMART State:
${JSON.stringify(state.smartCriteria, null, 2)}

Instructions:
1. If any criteria is "Pending", ask ONE friendly, encouraging question to figure it out. Do NOT jump to conclusions.
2. CRITICAL TIME-BOUND MATH RULES: When collecting the "timeBound" criteria, do NOT ask the user for both their target date AND their weekly hours upfront. Ask for ONE of them. 
   - If they provide a target date, you MUST mathematically estimate the total real-world hours this goal requires, then divide those hours by the weeks until the target date to calculate the required weekly hours. 
   - If they provide weekly hours, calculate the realistic target date.
   - Refuse impossible compressions (e.g. 150 hours a week, or a 6-month college semester in 2 weeks). Explain why it's biologically/physically impossible and propose a mathematically viable alternative.
3. If the user provides a detail (e.g. "I want it by August", "10 hours a week"), extract it.
4. If all criteria are filled, say "ALL_SMART_COMPLETE" exactly at the end of your message.

Output must be ONLY a JSON object:
{
  "updatedSmartCriteria": {
    "specific": "value or Pending",
    "measurable": "value or Pending",
    "achievable": "value or Pending",
    "relevant": "value or Pending",
    "timeBound": "value or Pending"
  },
  "messageToUser": "Your response or question for the user. Say ALL_SMART_COMPLETE if criteria are fully met."
}`;

  const messages = [
    new SystemMessage(smartSystemPrompt),
    ...state.messages.slice(-5) // Last 5 messages for context
  ];

  try {
    const response = await model.invoke(messages, { ...config, response_format: { type: "json_object" } });
    const content = response.content as string;
    const parsed = JSON.parse(content);
    
    const isComplete = parsed.messageToUser.includes("ALL_SMART_COMPLETE") || 
      (!Object.values(parsed.updatedSmartCriteria).includes('Pending'));

    const outMessage = parsed.messageToUser.replace("ALL_SMART_COMPLETE", "").trim();

    return {
      messages: [new AIMessage(outMessage)],
      smartCriteria: parsed.updatedSmartCriteria,
      currentPhase: isComplete ? "ESTRATEGA" : "COACH"
    };
  } catch (e) {
    console.error("Coach Error:", e);
    return {
      messages: [new AIMessage("Hubo un error al procesar tu meta. ¿Puedes repetirlo?")],
      currentPhase: "COACH"
    };
  }
}

// ── Node 2: ESTRATEGA ──
async function estrategaNode(state: typeof PlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const systemPrompt = `You are the Estratega (Strategist). Read the following SMART Goal:
${JSON.stringify(state.smartCriteria, null, 2)}

Instructions:
1. Apply Reverse Engineering to break down the goal into Major Macro-Milestones (e.g., Month 1, Month 2, etc).
2. Return ONLY a valid JSON object with the milestones.

Output JSON format:
{
  "milestones": [
    { "title": "Milestone 1", "description": "What to achieve" }
  ]
}`;

  try {
    const response = await model.invoke([new SystemMessage(systemPrompt)], { ...config, response_format: { type: "json_object" } });
    const content = response.content as string;
    const parsed = JSON.parse(content);

    return {
      macroMilestones: parsed.milestones || [],
      currentPhase: "CRONOLOGISTA"
    };
  } catch (e) {
    console.error("Estratega Error:", e);
    return { currentPhase: "DONE" };
  }
}

// ── Node 3: CRONOLOGISTA ──
async function cronologistaNode(state: typeof PlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const systemPrompt = `You are the Cronologista. Transform these Macro-Milestones into a final actionable plan:
${JSON.stringify(state.macroMilestones, null, 2)}

Instructions:
1. For each milestone, create actionable weekly/daily tasks using action verbs.
2. Add a "Risk & Mitigation" note (what could go wrong and how to fix it).
3. Return ONLY a valid JSON object representing the final plan.

Output JSON format:
{
  "phases": [
    {
      "title": "Phase title",
      "description": "Risk & Mitigation note",
      "tasks": [
        { "name": "Task 1", "description": "Actionable description", "estimatedHours": 2 }
      ]
    }
  ]
}`;

  try {
    const response = await model.invoke([new SystemMessage(systemPrompt)], { ...config, response_format: { type: "json_object" } });
    const content = response.content as string;
    const parsed = JSON.parse(content);

    return {
      actionPlan: parsed,
      currentPhase: "DONE"
    };
  } catch (e) {
    console.error("Cronologista Error:", e);
    return { currentPhase: "DONE" };
  }
}

// ── Node 4: REVISOR (Editor) ──
async function revisorNode(state: typeof PlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const systemPrompt = `You are the Revisor (Editor). Your job is to modify an existing Action Plan based on the user's instructions.
Current Plan:
${JSON.stringify(state.actionPlan, null, 2)}

${state.attachedContext ? `Attached Context (Target node/task to modify):\n${JSON.stringify(state.attachedContext, null, 2)}\n` : ''}
Instructions:
1. Apply the user's requested changes to the Action Plan.
2. If an Attached Context is provided, focus the modifications on that specific task, phase, or milestone.
3. Return the FULL updated Action Plan JSON (following the exact same schema).
4. Also return a short, conversational message explaining what you did.

Output JSON format:
{
  "updatedActionPlan": { "phases": [ ... ] },
  "messageToUser": "¡Listo! He dividido la tarea como pediste."
}`;

  const messages = [
    new SystemMessage(systemPrompt),
    ...state.messages.slice(-3) // Last 3 messages for context
  ];

  try {
    const response = await model.invoke(messages, { ...config, response_format: { type: "json_object" } });
    const content = response.content as string;
    const parsed = JSON.parse(content);

    return {
      actionPlan: parsed.updatedActionPlan,
      messages: [new AIMessage(parsed.messageToUser)],
      currentPhase: "DONE"
    };
  } catch (e) {
    console.error("Revisor Error:", e);
    return {
      messages: [new AIMessage("Hubo un error al modificar el plan. ¿Puedes intentarlo de nuevo?")],
      currentPhase: "DONE"
    };
  }
}

// ── Graph Edges ──
const routeInitial = (state: typeof PlanificadorState.State) => {
  if (state.actionPlan) {
    return "revisor_node";
  }
  return "coach_node";
};

const routeAfterCoach = (state: typeof PlanificadorState.State) => {
  if (state.currentPhase === "ESTRATEGA") {
    return "estratega_node";
  }
  return END;
};

// ── Graph Builder ──
const builder = new StateGraph(PlanificadorState)
  .addNode("coach_node", coachNode)
  .addNode("estratega_node", estrategaNode)
  .addNode("cronologista_node", cronologistaNode)
  .addNode("revisor_node", revisorNode)
  .addConditionalEdges("__start__", routeInitial)
  .addConditionalEdges("coach_node", routeAfterCoach)
  .addEdge("estratega_node", "cronologista_node")
  .addEdge("cronologista_node", END)
  .addEdge("revisor_node", END);

export const goalGraph = builder.compile();
