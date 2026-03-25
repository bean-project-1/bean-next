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

## 🚀 Guía Definitiva de Instalación (Paso a Paso)

Sigue estos pasos cuidadosamente para levantar todo el proyecto desde cero en tu máquina local.

### 1. Prerrequisitos
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

### 3. Variables de Entorno (Crucial para el Login y Base de Datos)
Toma el archivo `.env.example` en la raíz (o en `apps/web/.env`) y crea tu archivo `.env`:
```bash
cp .env.example .env
```
Asegúrate de que tu `.env` tenga estrictamente lo siguiente para que el proyecto conecte y te permita iniciar sesión:
```ini
# Base de Datos MongoDB (El parámetro directConnection=true es vital si usas Docker/Podman en Windows)
DATABASE_URL="mongodb://localhost:27017/bean_db?replicaSet=rs0&directConnection=true"

# Autenticación (NextAuth)
NEXTAUTH_SECRET="cualquier-texto-secreto-seguro"
NEXTAUTH_URL="http://localhost:3000" # Cambiar a 3001 si tu puerto 3000 está ocupado
```

### 4. Arrancar las Bases de Datos (MongoDB y Mongo Express)
Este proyecto requiere **MongoDB configurado como Replica Set** debido a los requerimientos de Prisma ORM. 

```bash
# 1. Levantar el contenedor de Base de Datos Y el visor web (Mongo Express)
docker compose up -d mongodb mongo-express
# (Si usas Podman, cambia `docker compose` por `podman compose`)

# 2. IMPORTANTE: Inicializar el Replica Set (Solo la primera vez que creas el contenedor)
docker exec -it bean-mongodb mongosh --eval "rs.initiate()"
# (En Podman: podman exec -it bean-mongodb mongosh --eval "rs.initiate()")
```
*Alternativa sin Docker ni Podman*: Usa una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas/database), crea un cluster y pega el link de conexión en tu `.env`. 

### 5. Configurar el Esquema (Prisma)
Una vez que la base de datos esté arriba, sincroniza la estructura ejecutando este comando desde la **raíz del proyecto**:
```bash
npm run db:push
```
Esto creará las colecciones en MongoDB y generará el Prisma Client localmente.

### 6. Llenar la Base de Datos con Datos Fake (SEED)
Para no empezar con la plataforma vacía, llenaremos información ficticia de prueba:
```bash
# Ve a la carpeta web y corre el seed
cd apps/web
npm run db:seed
```
*Si tienes problemas con Typescript en Windows ejecutando esto, revisa que no haya errores de importación en `prisma/seed.ts`.*

### 7. Ejecutar la Aplicación Frontend y Backend
Regresa a la raíz del proyecto y enciende el entorno completo de desarrollo:
```bash
cd ../../
npm run dev
```
La aplicación web (que sirve el frontend de React y el backend en Next.js App Router) arrancará en `http://localhost:3000` (o `3001`).

---

## 🗄️ ¿Cómo y dónde ver la Base de Datos?

Tienes **3 opciones principales** para inspeccionar qué se está guardando:

1. **Prisma Studio (La más fácil e integrada):**
   Corre el comando `npm run db:studio` en la raíz. Se te abrirá una interfaz moderna en `http://localhost:5555` que lee inteligentemente tus modelos de Prisma.
   
2. **Mongo Express (Visor web crudo):**
   Como lo levantamos en el paso 4, puedes entrar a **`http://localhost:8081`**.
   - **Usuario:** `admin`
   - **Contraseña:** `pass`
   Aquí verás la base de datos exactamente como es en formato JSON.

3. **MongoDB Compass o Extensiones de VSCode (Para Profesionales):**
   Descarga la app de escritorio de MongoDB Compass y conéctate usando el mismo string de tu `.env`: `mongodb://localhost:27017/bean_db?directConnection=true`.

---

## 🛑 Problemas Frecuentes al Levantar (Troubleshooting)

1. **`os error 10061` o "Connection Refused" con MongoDB**
   - **Por qué pasa:** Tus contenedores no están corriendo.
   - **Solución:** Verifica que Docker o Podman Desktop estén abiertos y corre `docker compose up -d mongodb`.

2. **La terminal se queda "pegada", da Timeout en `db:push` o el Login se queda cargando infinito**
   - **Por qué pasa:** Prisma requiere que MongoDB sea un *Replica Set*. O no corriste la inicialización o te falta un parámetro de conexión.
   - **Solución:** Corre `docker exec -it bean-mongodb mongosh --eval "rs.initiate()"` y asegúrate que tu `DATABASE_URL` termine en `&directConnection=true`. También revisa que `NEXTAUTH_SECRET` exista.

3. **`npm error code ENOWORKSPACES` al iniciar `npm run dev`**
   - **Por qué pasa:** Next.js trata de instalar dependencias opcionales (como `sharp`) y rompe momentáneamente con los npm workspaces.
   - **Solución:** Ignóralo. Si abajo ves `✓ Ready in X.Xs`, significa que tu servidor arrancó sin problemas. 

4. **El puerto 3000 está en uso**
   - **Por qué pasa:** Tienes otro proyecto ocupándolo.
   - **Solución:** Next.js usará el 3001 automáticamente. Entra a `http://localhost:3001`.

---

## 🛠️ Comandos Útiles del Monorepo (Development Workflow)

```bash
npm run dev          # Arranca todos los servidores (Web, AI, etc.) en modo watch
npm run build        # Construye todos los paquetes para producción
npm run lint         # Ejecuta el linter en todo el repositorio
npm run format       # Formatea el código con Prettier
npm run type-check   # Valida tipado estricto de TypeScript
npm run db:studio    # Abre la interfaz visual de base de datos de Prisma
npm run db:push      # Empuja los cambios de schema.prisma hacia la base de datos
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
