import { Annotation, StateGraph, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableConfig } from "@langchain/core/runnables";

// Define the State for Group Planning
export const GroupPlanificadorState = Annotation.Root({
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
  teamContext: Annotation<string>({
    reducer: (x, y) => y,
    default: () => "",
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
      modelName: "gpt-4o",
    });
  }
  // Default fallback
  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o",
  });
};

// ── Node 1: COACH (Project Manager) ──
async function coachNode(state: typeof GroupPlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const smartSystemPrompt = `You are a Collaborative Project Manager for this Team/Space. Your mission is to gather SMART criteria for the team's goal.
Current SMART State:
${JSON.stringify(state.smartCriteria, null, 2)}

Team Context (Members and DNA):
${state.teamContext}

Instructions:
1. If any criteria is "Pending", ask ONE friendly, encouraging question to figure it out from the team.
2. Consider the Team's DNA when proposing ideas or evaluating the "Achievable" criteria.
3. If the team provides a detail, extract it.
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
  "messageToUser": "Your response or question for the team. Say ALL_SMART_COMPLETE if criteria are fully met."
}`;

  const messages = [
    new SystemMessage(smartSystemPrompt),
    ...state.messages.slice(-5)
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
      messages: [new AIMessage("Hubo un error al procesar el proyecto del equipo. ¿Pueden repetirlo?")],
      currentPhase: "COACH"
    };
  }
}

// ── Node 2: ESTRATEGA ──
async function estrategaNode(state: typeof GroupPlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const systemPrompt = `You are the Estratega (Strategist) for a Team Project. Read the following SMART Goal:
${JSON.stringify(state.smartCriteria, null, 2)}

Instructions:
1. Apply Reverse Engineering to break down the goal into Major Macro-Milestones (e.g., Phase 1, Phase 2).
2. Ensure the phases make sense for a team effort.
3. Return ONLY a valid JSON object with the milestones.

Output JSON format:
{
  "milestones": [
    { "title": "Milestone 1", "description": "What to achieve collaboratively" }
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

// ── Node 3: CRONOLOGISTA (Task Assigner) ──
async function cronologistaNode(state: typeof GroupPlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const systemPrompt = `You are the Cronologista and Task Assigner. Transform these Macro-Milestones into a final actionable plan:
${JSON.stringify(state.macroMilestones, null, 2)}

Team Context (Members and DNA):
${state.teamContext}

Instructions:
1. For each milestone, create actionable tasks.
2. CRITICAL: For each task, YOU MUST assign it to a specific team member based on their DNA and Role. 
3. Provide the exact 'assigneeId' matching a team member's ID from the Team Context.
4. Add a "Risk & Mitigation" note for each phase.
5. Return ONLY a valid JSON object representing the final plan.

Output JSON format:
{
  "phases": [
    {
      "title": "Phase title",
      "description": "Risk & Mitigation note",
      "tasks": [
        { "name": "Task 1", "description": "Actionable description", "estimatedHours": 2, "assigneeId": "member_id_here" }
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
async function revisorNode(state: typeof GroupPlanificadorState.State, config?: RunnableConfig) {
  const model = getLangchainModel(state.config);

  const systemPrompt = `You are the Revisor (Editor) for a Team Project. Modify the Action Plan based on the team's instructions.
Current Plan:
${JSON.stringify(state.actionPlan, null, 2)}

Team Context (Members and DNA):
${state.teamContext}

${state.attachedContext ? "Attached Context (Target node/task to modify):\n" + JSON.stringify(state.attachedContext, null, 2) + "\n" : ''}
Instructions:
1. Apply the requested changes (re-assigning tasks, dividing work, changing hours).
2. If assigning new tasks, use the 'assigneeId' from the Team Context.
3. Return the FULL updated Action Plan JSON.
4. Also return a short, conversational message explaining what you did to the team.

Output JSON format:
{
  "updatedActionPlan": { "phases": [ ... ] },
  "messageToUser": "¡Listo equipo! Reasigné la tarea a Ana por su perfil creativo."
}`;

  const messages = [
    new SystemMessage(systemPrompt),
    ...state.messages.slice(-3)
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
      messages: [new AIMessage("Hubo un error al modificar el plan del equipo. ¿Pueden intentarlo de nuevo?")],
      currentPhase: "DONE"
    };
  }
}

// ── Graph Edges ──
const routeInitial = (state: typeof GroupPlanificadorState.State) => {
  if (state.actionPlan) {
    return "revisor_node";
  }
  return "coach_node";
};

const routeAfterCoach = (state: typeof GroupPlanificadorState.State) => {
  if (state.currentPhase === "ESTRATEGA") {
    return "estratega_node";
  }
  return END;
};

// ── Graph Builder ──
const builder = new StateGraph(GroupPlanificadorState)
  .addNode("coach_node", coachNode)
  .addNode("estratega_node", estrategaNode)
  .addNode("cronologista_node", cronologistaNode)
  .addNode("revisor_node", revisorNode)
  .addConditionalEdges("__start__", routeInitial)
  .addConditionalEdges("coach_node", routeAfterCoach)
  .addEdge("estratega_node", "cronologista_node")
  .addEdge("cronologista_node", END)
  .addEdge("revisor_node", END);

export const groupGoalGraph = builder.compile();
