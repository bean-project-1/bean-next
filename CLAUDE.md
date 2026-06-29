# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BEAN is an AI-powered "life intelligence" platform that scores a user's life across pillars (Identity, Capital, Wellbeing), generates AI insights, and plans goals/habits via agentic features (branch planner, idea incubator, career coach, shared-goal "spaces").

## Monorepo layout

npm workspaces + Turborepo. Almost all product code lives in `apps/web`; other workspaces are thin.

- `apps/web/` — the only real application: Next.js 16 (App Router), React 19, NextAuth v5, Prisma + MongoDB. Frontend, API routes, and all AI/LLM logic live here.
- `packages/types/` — shared TypeScript interfaces (`@bean/types`), e.g. `User`, `Dimension`, `DimensionScore`, `LifeState`, `BranchPlan`.
- `packages/ui/` — shared design-system components (`@bean/ui`), e.g. `RadarChart`, `LifeScore`, `TagInput`. Any component reused across views belongs here.
- `packages/config/` — shared ESLint/TS config.
- `services/ai-engine/` — currently empty (README only). Previous Node-based profile analyzer was removed; AI logic now lives directly in `apps/web` API routes/services. Do not assume code exists here — check the README's plan before adding anything.
- `infra/` — Bicep/Terraform IaC, not actively maintained alongside app code.
- `docs/` — ADRs (`architecture.md`) and manuals. `docs/developer_manual.md` describes an older state of the repo (e.g. it still references the removed `ai-engine` analyzer) — verify against actual code before trusting it.

## Commands (run from repo root unless noted)

```bash
npm install                 # install all workspaces
npm run dev                 # turbo run dev (apps/web on :3000, falls back to :3001)
npm run build                # turbo run build
npm run lint                  # turbo run lint
npm run type-check            # turbo run type-check
npm run format                 # prettier --write across the repo

npm run db:generate           # prisma generate (schema at apps/web/prisma/schema.prisma)
npm run db:push               # push schema to MongoDB + regenerate client
npm run db:migrate            # prisma migrate dev
npm run db:studio             # Prisma Studio GUI

cd apps/web && npm run db:seed        # seed fake data (prisma/seed.ts)
cd apps/web && npm run eval:chat      # run chat coach evals (scripts/evals/eval-chat.ts)
```

There is no unit/integration test runner configured (no Jest/Vitest) — `eval:chat` is the closest thing to automated verification for AI flows. Validate changes with `npm run lint && npm run type-check`.

### Database

MongoDB **must** run as a replica set (Prisma requirement). `DATABASE_URL` needs `?replicaSet=rs0&directConnection=true`. Local setup: `docker compose up -d mongodb` then `docker exec -it bean-mongodb mongosh --eval "rs.initiate()"` (one-time).

## Architecture notes

### Auth
NextAuth v5 (Auth.js) configured in `apps/web/auth.ts` + `auth.config.ts`, using `PrismaAdapter`, JWT sessions, Google OAuth + Credentials (bcrypt) providers. A `createUser` event auto-seeds a default `BaseCommitment` ("Dormir"/sleep) tied to the `physical_health` Dimension — new-user side effects like this live in `auth.ts`, not in the registration route.

### Data model (`apps/web/prisma/schema.prisma`)
MongoDB via Prisma. Key models: `User`, `Dimension`/`UserAttribute`/`DimensionInput` (the scored pillars), `Goal`/`GoalAction`/`Task` (planning), `BaseCommitment`/`SuggestedPath` (recurring life commitments), `ChatSession`/`ChatMessage` (AI chat), `Space`/`SpaceMember`/`SpaceInvitation`/`SpaceMessage` (shared/collaborative goals), `IncubatorSeed` (idea incubator), `PostIt`/`DailyTask` (scheduling), `UserResume` (career), `PushSubscription`/`NotificationLog`. Per ADR-002, pillar data intentionally lives in flexible JSON fields rather than fully typed columns while the schema is still evolving.

### AI/LLM integration
All LLM calls happen inside `apps/web` (API routes under `app/api/ai/*`, `app/api/onboarding/*`, etc., and services under `apps/web/services/*`) — there is no separate AI microservice currently.

- `apps/web/lib/openai.ts` — base OpenAI/DeepSeek clients, wrapped with Langfuse (`observeOpenAI`) for tracing.
- `apps/web/lib/ai-client.ts` — `getDynamicAIClient(req)` / `getDynamicModel(req)`: resolves the actual client/model per-request, supporting **BYOK** (bring-your-own-key) via the `bean_byok_key` / `bean_byok_provider` cookies (openai/deepseek/gemini), falling back to the platform key. New AI endpoints should go through this rather than instantiating `OpenAI` directly, so BYOK and tracing keep working.
- Every traced call should keep Langfuse metadata meaningful (model, tags) for observability, per `docs/developer_manual.md` guidance on ADR/trace hygiene.

### Frontend structure
`apps/web/app/` uses route groups: `(app)` for the authenticated product (dna, home, insights, profile, schedule), `(auth)` for login/register/password flows. Feature logic/components are organized by domain under `apps/web/features/*` (chat, dna, forest, idea-incubator, insights, life-tree, notifications, onboarding, profile, schedule, spaces, career), not colocated under `app/`. Shared visual components come from `@bean/ui`; shared types from `@bean/types`.

### Path aliases
- Root `tsconfig.json`: `@bean/types`, `@bean/ui`, `@bean/config/*`.
- `apps/web/tsconfig.json`: `@/*` → `apps/web/*`.

## 🛠️ Superpowers Plugin (Custom Commands)

Cuando el usuario ejecute un comando de superpowers, activa el sub-agente correspondiente siguiendo estas instrucciones:

- `/superpowers:brainstorm` -> No escribas código. Haz 3-4 preguntas socráticas exhaustivas al usuario para descubrir casos límite, implicaciones de arquitectura y reglas de negocio sobre la funcionalidad solicitada.
- `/superpowers:plan` -> Analiza el estado actual del repositorio y genera una propuesta técnica en un archivo temporal `proposal_artifacts.md`. Define contratos de API, cambios en la base de datos y dependencias.
- `/superpowers:tasks` -> Toma el plan aprobado y genera un archivo `tasks.md` en la raíz con un checklist atómico de micro-tareas (de 2 a 5 minutos cada una) que sigan TDD.
- `/apply <tarea>` -> Ejecuta única y exclusivamente la tarea especificada abriendo un entorno/rama aislada. No pases a la siguiente hasta que el usuario lo indique.
- `/verify` -> Ejecuta de forma autónoma la suite de tests locales, linters y validaciones de tipos para asegurar que el cambio es 100% seguro.