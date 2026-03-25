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

---

## Getting Started / Guía de Instalación desde Cero

### 1. Prerrequisitos (¿Qué necesito instalar en mi máquina?)
Para correr este proyecto limpiamente, requieres:
- **Node.js** (Versión 20 o superior).
- **npm** (Versión 10 o superior - viene incluido con Node 20+).
- **Docker Desktop** (o Podman Desktop) para correr la base de datos de manera local.
- Un clon de este repositorio.

### 2. Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto para descargar todas las dependencias del monorepo (usamos npm workspaces + Turborepo):
```bash
npm install
```

### 3. Variables de Entorno

Toma el archivo `.env.example` en la raíz (o en `apps/web/.env`) y asegúrate de tener un archivo `.env`:
```bash
cp .env.example .env
```
Asegúrate de que `DATABASE_URL` apunte a tu instancia de base de datos (por defecto: `mongodb://localhost:27017/bean_db`). Note que el proyecto usa MongoDB, no PostgreSQL.

### 4. Arrancar la Base de Datos (MongoDB)

Este proyecto requiere **MongoDB configurado como Replica Set** debido a los requerimientos de Prisma ORM. 
Si tienes Docker Desktop (o Podman) instalado:

```bash
# 1. Levantar el contenedor
docker compose up -d mongodb
# (Si usas Podman, cambia `docker compose` por `podman compose`)

# 2. IMPORTANTE: Inicializar el Replica Set (Solo la primera vez)
docker exec -it bean-mongodb mongosh --eval "rs.initiate()"
# (En Podman: podman exec -it bean-mongodb mongosh --eval "rs.initiate()")
```
*Alternativa sin Docker ni Podman*: Usa una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas/database), crea un cluster y pega el link de conexión en tu `.env`. No tendrías que descargar nada.

### 5. Configurar el Esquema de Prisma

Sincroniza la estructura de la base de datos y genera el cliente de Prisma:
```bash
npm run db:push
```

### 6. Ejecutar la Aplicación Web

```bash
npm run dev
```
La aplicación web (Next.js) arrancará (típicamente en `http://localhost:3000` o `3001` si el puerto base está ocupado).

---

## 🛑 Problemas Frecuentes al Levantar (Troubleshooting)

1. **`os error 10061` o "Connection Refused" con MongoDB**
   - **Por qué pasa:** El contenedor de Docker no está corriendo o intentaste conectarte a localhost sin tener un servidor de bases de datos activo.
   - **Solución:** Verifica que Docker o Podman estén corriendo. Ejecuta `docker compose up -d mongodb` o su equivalente en podman.

2. **La terminal se queda "pegada" o da Timeout cuando ejecuto `npm run db:push`**
   - **Por qué pasa:** Prisma requiere que MongoDB sea un *Replica Set*. Tu contenedor probablemente arrancó, pero el Cluster interno nunca fue inicializado.
   - **Solución:** Ejecuta el comando de inicialización sobre tu contenedor que está corriendo: `docker exec -it bean-mongodb mongosh --eval "rs.initiate()"`.

3. **`npm error code ENOWORKSPACES` al iniciar `npm run dev`**
   - **Por qué pasa:** Next.js trata de instalar dependencias opcionales globalmente (como el motor `sharp` para optimización de imágenes) y no respeta el esquema de workspaces de npm en Turborepo.
   - **Solución:** **No es fatal e ignóralo**. Fíjate en los logs de la terminal: si un par de líneas más abajo dice que fue exitoso (`✓ Ready in X.Xs`), significa que tu servidor web de Next.js arrancó tranquilamente. 

4. **El puerto 3000 está en uso**
   - **Por qué pasa:** Tienes otra aplicación o servicio tomándolo.
   - **Solución:** Next.js automáticamente intentará arrancar en el 3001. Abre `http://localhost:3001` en tu navegador.

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
