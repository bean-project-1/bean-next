import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env before any other imports!
dotenv.config();

async function testPlanner(input: string, hoursPerWeek: number) {
  console.log(`\n======================================================`);
  console.log(`TESTING INPUT: "${input}" | Hours/Week: ${hoursPerWeek}`);
  console.log(`======================================================`);
  
  // Dynamically import GoalService to ensure environment variables are loaded first
  const { GoalService } = await import('./services/goal-service');
  const service = new GoalService();
  
  console.log('1. Parsing Goal Intent with AI...');
  const parsedGoal = await service.parseGoalWithAI(input);
  console.log('Parsed Goal:', JSON.stringify(parsedGoal, null, 2));
  
  console.log('\n2. Generating Hierarchical Plan with AI...');
  const dnaAnalysis = service.computeDNAAnalysis(parsedGoal.relevantDimensions || [], {});
  
  const constraints = {
    ...parsedGoal.constraints,
    timePerWeek: hoursPerWeek
  };
  
  const { draft: plan } = await service.generateHierarchicalPlan(parsedGoal, dnaAnalysis, constraints);
  
  if (!plan) {
    console.log('\nNO PLAN GENERATED (Unrealistic goal / negotiation needed)');
    return;
  }
  
  console.log('\nGENERATED PLAN SUMMARY:');
  console.log(`Phases Count: ${plan.phases.length}`);
  console.log(`Habits Count: ${plan.habits.length}`);
  console.log(`Continuous Projects Count: ${plan.continuousProjects.length}`);
  
  console.log('\n--- PHASES ---');
  plan.phases.forEach((p: any, idx: number) => {
    console.log(`\n[Phase ${idx + 1}] ${p.title} (Target: ${p.targetDate})`);
    console.log(`Description: ${p.description}`);
    if (p.milestone) {
      console.log(`  Milestone: ${p.milestone.title}`);
    }
    console.log(`  Tasks (${p.tasks.length}):`);
    p.tasks.forEach((t: any) => {
      console.log(`    - ${t.name} (Estimated Hours: ${t.estimatedHours}h, Target: ${t.targetDate})`);
      if (t.subTasks && t.subTasks.length > 0) {
        t.subTasks.forEach((st: any) => {
          console.log(`      * Subtask: ${st.name} (${st.estimatedHours}h)`);
        });
      }
    });
  });
  
  console.log('\n--- HABITS ---');
  plan.habits.forEach((h: any) => {
    console.log(`- ${h.title} (${h.type}): ${h.estimatedHours}h/session, daysOfWeek: ${JSON.stringify(h.daysOfWeek)}, Start: ${h.startDate}, End: ${h.endDate}`);
  });
  
  console.log('\n--- CONTINUOUS PROJECTS ---');
  plan.continuousProjects.forEach((cp: any) => {
    console.log(`- ${cp.title} (${cp.type}): ${cp.estimatedHours}h/session, daysOfWeek: ${JSON.stringify(cp.daysOfWeek)}, Start: ${cp.startDate}, End: ${cp.endDate}`);
  });
}

async function main() {
  await testPlanner("Quiero ser diseñador web UX/UI", 10);
}

main().catch(console.error);
