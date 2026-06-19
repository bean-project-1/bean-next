# 📘 Manual Técnico para Desarrolladores (BEAN Platform)

¡Bienvenido al manual técnico de la plataforma **BEAN**! Este documento está diseñado específicamente para desarrolladores junior que se integran al equipo de desarrollo y desean comprender la arquitectura del código, la estructura de sus componentes y cómo realizar modificaciones de manera segura y eficiente.

---

## 1. Arquitectura General y Estructura del Monorepo

BEAN está estructurado como un **Monorepo** administrado mediante **Turborepo** y **npm Workspaces**. Esto permite que múltiples paquetes y aplicaciones coexistan en el mismo repositorio compartiendo configuraciones y tipos de TypeScript, sin necesidad de publicar paquetes en npm.

### Estructura de Carpetas

```
bean-next/
├── apps/
│   └── web/                  # Aplicación principal en Next.js (App Router)
├── packages/
│   ├── config/               # Configuración compartida de TypeScript, ESLint, etc.
│   ├── types/                # Interfaces de TypeScript y enums compartidos
│   └── ui/                   # Biblioteca de componentes visuales (Design System)
├── services/
│   └── ai-engine/            # Servicio de análisis de IA (Node.js/TypeScript)
├── docs/                     # Documentación de arquitectura (ADRs) y manuales
├── infra/                    # Infraestructura como código (scripts Bicep / Terraform)
├── package.json              # Configuración raíz del monorepo
└── turbo.json                # Configuración de caché y tareas de Turborepo
```

### Comandos Clave en la Raíz
Siempre ejecuta estos comandos desde la raíz del proyecto (`bean-next/`):

*   **Levantar entorno de desarrollo**:
    ```bash
    npm run dev
    ```
    *(Arranca en paralelo la aplicación web y el servicio de IA en modo de escucha)*
*   **Compilar todo el monorepo**:
    ```bash
    npm run build
    ```
*   **Ejecutar el formateador de código (Prettier)**:
    ```bash
    npm run format
    ```
*   **Ejecutar el Linter para buscar problemas estáticos**:
    ```bash
    npm run lint
    ```
*   **Validar tipos en todos los proyectos**:
    ```bash
    npm run type-check
    ```
*   **Empujar el esquema de base de datos**:
    ```bash
    npm run db:push
    ```
    *(Alinea tu esquema local de MongoDB con Prisma)*
*   **Abrir la consola visual de la base de datos (Prisma Studio)**:
    ```bash
    npm run db:studio
    ```

---

## 2. Los Componentes del Monorepo

### A. `@bean/types` (Tipos Compartidos)
Ubicación: [packages/types/src/index.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/types/src/index.ts)

Este paquete contiene todas las interfaces de TypeScript que garantizan la consistencia de los datos entre el frontend (Next.js), el backend y el motor de IA. 

#### Entidades Principales
*   **`User`**: Representa al usuario autenticado.
*   **`Dimension`**: Cada uno de los 10 aspectos analizados (ej. `values`, `skills`, `health`).
*   **`DimensionScore`**: Puntuación de 0 a 10 para una dimensión específica con su tendencia (`up`, `down`, `stable`).
*   **`LifeState`**: Captura instantánea del estado de vida general de un usuario (incluye `lifeScore`, `balanceScore`, `alignmentScore` y `energyIndex`).
*   **`BranchPlan`**: Estructura que genera el planificador de hábitos (`BranchPlannerAgent`) que contiene hitos (`Milestone`) y hábitos planificados (`PlannedHabit`).

### B. `@bean/ui` (Librería de Componentes)
Ubicación: [packages/ui/src/components](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/ui/src/components)

Es la librería visual de BEAN. Está basada en React, Tailwind CSS y animaciones fluidas (con Framer Motion y GSAP). Cualquier componente reutilizable en varias vistas del frontend debe estar aquí.

#### Componentes clave:
*   [RadarChart.tsx](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/ui/src/components/RadarChart.tsx): Renderiza el gráfico de radar con las puntuaciones de las dimensiones.
*   [LifeScore.tsx](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/ui/src/components/LifeScore.tsx): Visualiza la puntuación general con efectos fluidos.
*   [TagInput.tsx](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/ui/src/components/TagInput.tsx): Entrada dinámica para tags (habilidades, valores) usada en onboarding y perfil.

### C. `apps/web` (Frontend & NextAuth API)
Ubicación: [apps/web](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/apps/web)

Es una aplicación de Next.js utilizando el **App Router** (`app/`).
*   **Autenticación**: Configurada con **NextAuth.js v5 (Auth.js)** en [auth.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/apps/web/auth.ts) conectada al adaptador de Prisma.
*   **Base de Datos**: Utiliza **MongoDB** a través de Prisma ORM. El archivo de configuración principal es [schema.prisma](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/apps/web/prisma/schema.prisma).
*   **Rutas del Servidor (API Routes)**: Ubicadas en `app/api/`. Por ejemplo, la extracción de objetivos inicial durante el onboarding usa el endpoint [route.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/apps/web/app/api/onboarding/extract-goals/route.ts).

### D. `services/ai-engine` (Motor de IA)
Ubicación: [services/ai-engine](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/services/ai-engine)

Este módulo de backend se encarga de analizar los perfiles utilizando llamadas de IA (OpenAI / DeepSeek) y Langfuse para trazabilidad de prompts.
*   El analizador core está en [profileAnalyzer.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/services/ai-engine/analyzers/profileAnalyzer.ts), que cuenta con las funciones:
    *   `analyzeProfile()`: Procesa la puntuación global de 10 dimensiones.
    *   `generateInsights()`: Genera fortalezas, riesgos, y sugerencias de acción personalizadas.
    *   `simulateTrajectory()`: Proyecta la evolución mensual a futuro.

---

## 3. Guía Paso a Paso para Modificaciones Comunes

### Escenario A: Añadir un campo a un Modelo en la Base de Datos

Si necesitas agregar una propiedad (por ejemplo, `phoneNumber`) al modelo de usuario:

1.  Abre el esquema de Prisma en [schema.prisma](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/apps/web/prisma/schema.prisma).
2.  Busca el modelo `User` y añade el campo:
    ```prisma
    model User {
      id            String    @id @default(auto()) @map("_id") @db.ObjectId
      name          String?
      email         String    @unique
      // ... otros campos
      phoneNumber   String?   @map("phone_number") // Nuevo campo
      // ...
    }
    ```
3.  Ve a la terminal (raíz del proyecto) y ejecuta:
    ```bash
    npm run db:push
    ```
    *Esto sincronizará MongoDB y re-generará el código autogenerado del Prisma Client.*
4.  Si el campo debe compartirse con el resto del monorepo, actualiza la interfaz en `@bean/types`:
    Abre [index.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/types/src/index.ts) y edita la interfaz `User`:
    ```typescript
    export interface User {
      id: string;
      email: string;
      name?: string;
      phoneNumber?: string; // Agregado aquí
      // ...
    }
    ```

---

### Escenario B: Crear un nuevo Componente Visual Compartido

Si deseas crear un nuevo componente visual, por ejemplo, `Badge.tsx`:

1.  Crea el archivo `Badge.tsx` en [packages/ui/src/components/Badge.tsx](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/ui/src/components/Badge.tsx):
    ```tsx
    import React from 'react';

    interface BadgeProps {
      label: string;
      variant?: 'success' | 'warning' | 'info';
    }

    export const Badge: React.FC<BadgeProps> = ({ label, variant = 'info' }) => {
      const colors = {
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      };

      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>
          {label}
        </span>
      );
    };
    ```
2.  Exporta el nuevo componente en el archivo índice de `@bean/ui` en [index.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/packages/ui/src/index.ts):
    ```typescript
    export * from './components/Badge';
    ```
3.  Para usarlo en la app web (`apps/web`), simplemente impórtalo normalmente:
    ```tsx
    import { Badge } from '@bean/ui';
    
    // En tu vista de Next.js:
    <Badge label="En Progreso" variant="warning" />
    ```

---

### Escenario C: Cambiar un Prompt o Parámetro de IA

La lógica de LLMs está integrada en las rutas API y el `ai-engine`. Tomemos como ejemplo el endpoint de extracción de objetivos del onboarding [route.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/apps/web/app/api/onboarding/extract-goals/route.ts):

1.  Abre el archivo [route.ts](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/apps/web/app/api/onboarding/extract-goals/route.ts).
2.  Busca la variable `prompt` (líneas 28–50). Aquí puedes modificar las instrucciones del sistema, las restricciones de formato o cambiar el tono del análisis.
3.  Si necesitas cambiar la versión del modelo (por ejemplo, migrar de `gpt-4o-mini` a `gpt-4o`):
    Modifica la línea 26:
    ```typescript
    const model = hasOpenAI ? "gpt-4o" : "deepseek-chat";
    ```
4.  **Trazabilidad**: Notarás que se utiliza un cliente de `Langfuse` para trazar la llamada (líneas 20-24 y 66). Si realizas cambios importantes, asegúrate de mantener actualizados los metadatos del trace para la observabilidad en producción.

---

## 4. Flujo de Trabajo y Buenas Prácticas

1.  **Validación antes de subir cambios**:
    Antes de realizar un Commit en Git, asegúrate de que no haya errores de tipado o formato corriendo en tu consola:
    ```bash
    npm run lint && npm run type-check && npm run format
    ```
2.  **Convención de Commits**:
    Utilizamos la especificación *Conventional Commits* para facilitar la generación automática de changelogs:
    *   `feat: nuevo componente Badge para el UI` (Nueva característica)
    *   `fix: error de conexión en MongoDB directConnection` (Corrección de errores)
    *   `chore: actualizar typescript en packages` (Tareas de mantenimiento)
    *   `docs: actualizar manual de desarrollo` (Documentación)
3.  **Variables de Entorno**:
    Nunca agregues tokens o credenciales reales al repositorio. Todas las credenciales van en el archivo `.env` local, el cual está excluido en el `.gitignore`. Puedes usar como guía el archivo [.env.example](file:///c:/Users/dhdiazga/OneDrive%20-%20Telefonica/Documentos/Desarrollos/bean-next/.env.example).
