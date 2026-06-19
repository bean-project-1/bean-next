# Motor de Inteligencia Artificial (AI Engine) — BEAN Platform

Este directorio está reservado para el **Motor de IA independiente (AI Engine)** de la plataforma BEAN. 

Actualmente, toda la lógica de interacción con modelos de lenguaje (OpenAI y DeepSeek) se encuentra integrada y ejecutada de manera directa en el servidor Next.js (`apps/web`). El contenido anterior de este directorio ha sido removido para evitar duplicidad de código y dependencias innecesarias en el monorepo.

---

## Plan de Integración Futura

Si en el futuro deseas desacoplar la lógica de IA de la aplicación web (por ejemplo, para soportar cargas de procesamiento pesadas, integrar modelos de Machine Learning locales, o implementar lógica avanzada de agentes en Python), puedes reincorporar el motor de IA en este directorio.

### Opción A: Microservicio en Python (FastAPI) — RECOMENDADA
La forma recomendada para integrar un motor de IA robusto es crear un servicio independiente en Python.

1. **Estructura del Proyecto:**
   ```
   services/ai-engine/
   ├── app/
   │   ├── main.py          # Servidor FastAPI
   │   ├── config.py        # Configuración y variables de entorno
   │   ├── agents/          # Agentes autónomos (LangChain/LlamaIndex)
   │   └── prompts/         # Plantillas de sistema
   ├── requirements.txt     # Dependencias de Python
   ├── Dockerfile           # Imagen Docker para el despliegue
   └── README.md
   ```

2. **Habilitación en Docker Compose:**
   Descomenta o agrega la sección del servicio `ai-engine` en tu archivo `docker-compose.yml` en la raíz del proyecto para que Next.js y el motor de IA se comuniquen de manera interna en la misma red de Docker:
   ```yaml
   services:
     ai-engine:
       build: ./services/ai-engine
       ports:
         - "8000:8000"
       environment:
         - OPENAI_API_KEY=${OPENAI_API_KEY}
         - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
   ```

3. **Comunicación desde Next.js:**
   Configura una variable de entorno en `apps/web/.env`:
   ```env
   AI_ENGINE_URL=http://ai-engine:8000
   ```
   Y realiza peticiones HTTP (`fetch`) desde las API Routes hacia el servicio de Python en lugar de llamar directamente a la SDK de OpenAI.

---

### Opción B: Paquete Node.js/TypeScript en el Monorepo
Si prefieres mantenerte 100% en la infraestructura de JavaScript/TypeScript, puedes recrear el paquete del monorepo en este directorio:

1. **Estructura del Proyecto:**
   ```
   services/ai-engine/
   ├── analyzers/
   │   └── profileAnalyzer.ts   # Lógica de procesamiento de perfiles
   ├── package.json             # Con nombre "@bean/ai-engine"
   ├── tsconfig.json
   └── README.md
   ```

2. **Uso como dependencia interna:**
   Agrega la dependencia al `package.json` de tu aplicación web:
   ```json
   "dependencies": {
     "@bean/ai-engine": "*"
   }
   ```
   Luego ejecuta `npm install` desde la raíz para vincular el paquete en tu espacio de trabajo local (Workspace).
