# AI Engine — BEAN Life Intelligence

This service contains the AI analysis logic for BEAN.

## Structure

```
ai-engine/
├── analyzers/
│   └── profileAnalyzer.ts    # Core analysis functions
├── prompts/
│   └── systemPrompts.ts      # System prompt templates
├── trajectory/
│   └── trajectoryEngine.ts   # Future: dedicated trajectory model
└── insights/
    └── insightEngine.ts      # Future: insight categorization
```

## Functions

| Function              | Description                             |
|-----------------------|-----------------------------------------|
| `analyzeProfile()`    | Scores all 10 dimensions, returns lifeScore |
| `generateInsights()`  | Returns prioritized insight list        |
| `simulateTrajectory()`| Projects 12-month life trajectory      |

## Enabling AI

Set `OPENAI_API_KEY` in your `.env` file. The functions currently return
mock data and print a warning when the key is not configured.

## Future: Python FastAPI

For high-throughput or ML model requirements, the engine can be migrated to
a Python FastAPI service. The `docker-compose.yml` already has a placeholder
`ai-engine` service to enable this.
