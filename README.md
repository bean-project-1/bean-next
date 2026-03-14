# BEAN — Life Intelligence Platform

> **Understand, measure, and improve your life trajectory using AI.**

BEAN is an AI-powered life intelligence platform that analyzes multiple life dimensions — identity, capital, and wellbeing — and generates personalized insights and trajectory simulations.

---

## Architecture Overview

```
bean/
├── apps/
│   └── web/                  # Next.js 14 App Router (main product)
├── packages/
│   ├── types/                # Shared TypeScript interfaces
│   ├── ui/                   # Reusable design-system components
│   └── config/               # Shared ESLint / TS configs
├── services/
│   └── ai-engine/            # AI analysis service (Python FastAPI — future)
├── infra/                    # Infrastructure-as-Code (Bicep / Terraform)
└── docs/                     # Architecture Decision Records
```

### Technology Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14, React 18, TypeScript, TailwindCSS |
| Backend    | Next.js API Routes (v1), FastAPI (planned) |
| Database   | PostgreSQL + Prisma ORM             |
| AI         | OpenAI GPT-4 Turbo                  |
| DevOps     | Docker, Turborepo, GitHub Actions   |
| Deployment | Vercel / Azure App Service          |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/bean.git
cd bean
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Fill in your DATABASE_URL, OPENAI_API_KEY, etc.
```

### 3. Start the Database

```bash
docker compose up postgres -d
```

### 4. Run Database Migrations

```bash
npm run db:push     # push schema (dev)
# or
npm run db:migrate  # create migration files
```

### 5. Start Development Server

```bash
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

| Variable            | Description                          | Required |
|---------------------|--------------------------------------|----------|
| `DATABASE_URL`      | PostgreSQL connection string         | ✅       |
| `OPENAI_API_KEY`    | OpenAI API key for AI features       | ✅       |
| `NEXTAUTH_SECRET`   | NextAuth session secret              | ✅       |
| `NEXTAUTH_URL`      | Base URL for auth callbacks          | ✅       |
| `AI_ENGINE_URL`     | FastAPI AI engine URL (future)       | ❌       |
| `AZURE_CLIENT_ID`   | Azure AD app ID (production)         | ❌       |

---

## Development Workflow

```bash
npm run dev          # Start all dev servers
npm run build        # Build all packages
npm run lint         # Lint entire monorepo
npm run format       # Prettier format all files
npm run type-check   # TypeScript checks
npm run db:studio    # Open Prisma Studio (DB GUI)
```

---

## BEAN Dimensions

BEAN measures life across three high-level pillars:

| Pillar        | Sub-dimensions                         |
|---------------|----------------------------------------|
| **Identity**  | Values, Interests, Motivations         |
| **Capital**   | Knowledge, Skills, Career, Income      |
| **Wellbeing** | Health, Relationships, Happiness       |

Each sub-dimension is scored 0–10 and feeds into an overall **Life Score**.

---

## Contributing

1. Branch from `main`
2. Follow the conventional commits spec (`feat:`, `fix:`, `chore:`)
3. Run `npm run lint && npm run type-check` before pushing
4. Open a PR with a description of the change

---

## License

MIT © BEAN Team
