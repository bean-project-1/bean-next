import { GoalService } from './services/goal-service.js';
import { PrismaClient } from './lib/generated-prisma/index.js';

async function test() {
  const prisma = new PrismaClient();
  const goalService = new GoalService();
  
  const user = await prisma.user.findFirst();
  if (!user) return console.log("No user found");

  const goalText = "Convertirme en cientifico de datos\n[RAW CONVERSATION CONTEXT FOR EXACT DETAILS/ASSETS]:\nUSER: quiero ser cientifico de datos\nASSISTANT: Cuantas horas?";
  
  console.log("Parsing goal...");
  const parsedGoal = await goalService.parseGoalWithAI(goalText);
  console.log("Parsed Goal:", parsedGoal);
  
  const userDNA = await goalService.getUserDNA(user.id);
  const dnaAnalysis = goalService.computeDNAAnalysis(parsedGoal.relevantDimensions, userDNA);
  
  console.log("Generating plan...");
  try {
    const plan = await goalService.generateHierarchicalPlan(parsedGoal, dnaAnalysis, parsedGoal.constraints, user.id);
    console.log("Plan generated successfully:", plan.phases?.length, "phases");
  } catch(e) {
    console.error("GENERATION FAILED:", e);
  }

  await prisma.$disconnect();
}

test().catch(console.error);
