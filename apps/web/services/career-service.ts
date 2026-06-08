import { prisma } from '@/lib/prisma';
import { openai, deepseek } from '@/lib/openai';

export class CareerService {
  private getClient() {
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
    return hasOpenAI ? openai : deepseek;
  }

  private getModel() {
    const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here";
    return hasOpenAI ? "gpt-4o-mini" : "deepseek-chat";
  }

  /**
   * AI-Parses raw resume text into a structured JSON schema.
   */
  async parseResumeWithAI(text: string): Promise<any> {
    const prompt = `
      Eres un experto en Selección de Personal y Análisis de Talento. 
      Analiza el siguiente texto de una hoja de vida (CV) y estructúralo en un objeto JSON con el siguiente formato exacto:
      {
        "summary": "Resumen ejecutivo corto del perfil profesional (máximo 3 frases).",
        "skills": ["Habilidad 1", "Habilidad 2", ...],
        "experience": [
          { "company": "Nombre de Empresa", "role": "Cargo", "description": "Logros clave y responsabilidades", "duration": "e.g., 2022 - 2024" }
        ],
        "education": [
          { "school": "Institución", "degree": "Título/Grado", "year": "Año de graduación" }
        ],
        "certifications": ["Certificación 1", "Certificación 2", ...]
      }

      Asegúrate de extraer únicamente información verídica y relevante presente en el texto.
      Devuelve SOLO el JSON sin etiquetas markdown o explicaciones adicionales.

      TEXTO DE LA HOJA DE VIDA:
      """
      ${text}
      """
    `;

    const client = this.getClient();
    const model = this.getModel();

    try {
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "You are a professional Resume Parser. Return JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      console.error('[CareerService] Error parsing resume:', error);
      throw new Error('No se pudo procesar la hoja de vida con IA.');
    }
  }

  /**
   * Syncs extracted resume skills/experience into UserAttribute database table.
   */
  async syncResumeToDNA(userId: string, parsedData: any): Promise<void> {
    // 1. Resolve dimension IDs
    const dimensions = await prisma.dimension.findMany();
    const dimMap = new Map<string, string>();
    dimensions.forEach(d => dimMap.set(d.name, d.id));

    const skillsDimId = dimMap.get('skills');
    const knowledgeDimId = dimMap.get('knowledge');
    const careerDimId = dimMap.get('career');

    if (!skillsDimId || !knowledgeDimId || !careerDimId) {
      console.error('[CareerService] Missing core dimensions in DB');
      return;
    }

    // 2. Clear previous resume-sourced attributes to prevent duplication
    // We only clean attributes that are sourced from the CV. To do this, we can filter or just keep attributes
    // Or we can delete attributes of type skill/knowledge/career that were automatically imported if we want,
    // but a safer way is to add new ones that don't already exist.
    const existingAttrs = await prisma.userAttribute.findMany({
      where: { userId }
    });

    const existingNames = new Set(existingAttrs.map(a => a.name.toLowerCase()));

    const newAttributes: any[] = [];

    // Add Skills
    if (Array.isArray(parsedData.skills)) {
      parsedData.skills.forEach((skill: string) => {
        if (!existingNames.has(skill.toLowerCase())) {
          newAttributes.push({
            userId,
            dimensionId: skillsDimId,
            name: skill,
            category: 'skill',
            metadata: { level: 'learned', source: 'resume' }
          });
        }
      });
    }

    // Add Certifications/Knowledge
    if (Array.isArray(parsedData.certifications)) {
      parsedData.certifications.forEach((cert: string) => {
        if (!existingNames.has(cert.toLowerCase())) {
          newAttributes.push({
            userId,
            dimensionId: knowledgeDimId,
            name: cert,
            category: 'knowledge',
            metadata: { level: 'certified', source: 'resume' }
          });
        }
      });
    }

    // Add Careers / Roles
    if (Array.isArray(parsedData.experience)) {
      parsedData.experience.forEach((exp: any) => {
        const roleName = exp.role;
        if (roleName && !existingNames.has(roleName.toLowerCase())) {
          newAttributes.push({
            userId,
            dimensionId: careerDimId,
            name: roleName,
            category: 'career',
            metadata: { company: exp.company, duration: exp.duration, source: 'resume' }
          });
        }
      });
    }

    if (newAttributes.length > 0) {
      await prisma.userAttribute.createMany({
        data: newAttributes
      });
      console.log(`[CareerService] Seeded ${newAttributes.length} DNA attributes from resume for user ${userId}`);
    }
  }

  /**
   * Simulates 3 ideal job opportunities matching the user's CV and DNA attributes.
   */
  async simulateJobs(userId: string): Promise<any[]> {
    // Fetch user resume
    const resume = await prisma.userResume.findFirst({ where: { userId, isBase: true } });
    const parsedResume = resume?.parsedData ? JSON.stringify(resume.parsedData) : 'No CV uploaded yet.';

    // Fetch user DNA attributes
    const attributes = await prisma.userAttribute.findMany({
      where: { userId },
      include: { dimension: true }
    });

    const structuredDNA = attributes.map(a => `- [${a.dimension.label}] ${a.name} (${a.category})`).join('\n');

    const prompt = `
      Eres un Orientador de Carreras IA y Cazatalentos. En base al ADN Vital y Hoja de Vida del usuario, simula 3 ofertas de empleo ideales que tengan sentido para su perfil actual.
      Evalúa el nivel de compatibilidad en una escala de 0 a 100 en dos dimensiones clave:
      1. Habilidades (Capital): ¿Tiene el perfil técnico/práctico necesario?
      2. Valores (Identidad): ¿Alinea el rol con sus motivaciones e intereses?

      Devuelve un objeto JSON con el siguiente formato exacto:
      {
        "jobs": [
          {
            "id": "1",
            "title": "Título del Puesto",
            "company": "Nombre de Empresa Ficticia o Real",
            "description": "Descripción corta del rol y por qué encaja con su propósito.",
            "requirements": ["Requisito 1", "Requisito 2", "Requisito 3"],
            "alignment": {
              "skills": 85,
              "values": 90,
              "overall": 88
            },
            "explanation": "Breve explicación en español de por qué es una excelente opción."
          }
        ]
      }

      Devuelve SOLO el JSON sin markdown ni explicaciones adicionales.

      ADN DEL USUARIO:
      """
      ${structuredDNA}
      """

      RESUME DEL USUARIO:
      """
      ${parsedResume}
      """
    `;

    const client = this.getClient();
    const model = this.getModel();

    try {
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "You are an expert Talent Matcher AI. Return JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message.content || '{"jobs":[]}';
      const parsed = JSON.parse(content);
      return parsed.jobs || [];
    } catch (error) {
      console.error('[CareerService] Error simulating jobs:', error);
      return [];
    }
  }

  /**
   * Optimizes the executive summary and description of experience/skills to match a specific job description.
   */
  async tailorResumeForJob(parsedResume: any, jobOfferText: string): Promise<any> {
    const prompt = `
      Eres un Redactor Profesional de Hojas de Vida y Experto ATS (Applicant Tracking System).
      Tu tarea es optimizar/adaptar el CV base de un usuario para que sea altamente competitivo para la vacante que se detalla.

      INSTRUCCIONES DE OPTIMIZACIÓN:
      1. Reescribe el "summary" (Resumen Ejecutivo) para enfocarlo en las necesidades de la vacante, utilizando palabras clave estratégicas de la oferta.
      2. En la lista de "experience", reescribe las descripciones de sus funciones y logros usando verbos de acción y alineándolos con los requerimientos del cargo.
      3. Sugiere qué "skills" (Habilidades) de su repertorio debe destacar primero.
      4. IMPORTANTE: No inventes títulos universitarios, empresas falsas o habilidades que el usuario claramente no tiene en su CV base. Adapta la redacción y enfoca su experiencia real.

      Devuelve un objeto JSON con la versión optimizada bajo esta estructura:
      {
        "summary": "Resumen adaptado...",
        "skills": ["Habilidad destacada 1", "Habilidad destacada 2", ...],
        "experience": [
          { "company": "Empresa base", "role": "Rol base", "description": "Descripción de funciones optimizada y enfocada a la vacante...", "duration": "Duración base" }
        ],
        "certifications": ["Certificación destacada 1", ...]
      }

      Devuelve SOLO el JSON.

      CV BASE DEL USUARIO:
      """
      ${JSON.stringify(parsedResume)}
      """

      OFERTA LABORAL OBJETIVO:
      """
      ${jobOfferText}
      """
    `;

    const client = this.getClient();
    const model = this.getModel();

    try {
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "You are a professional ATS Resume Writer. Return JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      console.error('[CareerService] Error tailoring resume:', error);
      throw new Error('No se pudo optimizar el CV en este momento.');
    }
  }

  /**
   * Computes gaps between user DNA and a job description, and outputs a concrete BEAN Goal structure.
   */
  async generateCareerPlan(userId: string, jobTitle: string, company: string, jobOfferText: string): Promise<any> {
    // 1. Fetch user profile & DNA
    const attributes = await prisma.userAttribute.findMany({
      where: { userId },
      include: { dimension: true }
    });
    const structuredDNA = attributes.map(a => `- [${a.dimension.name}] ${a.name}`).join('\n');

    const prompt = `
      Eres un Arquitecto de Vida e Inteligencia de Carrera.
      Un usuario de BEAN quiere conseguir el empleo de: "${jobTitle}" en "${company}".
      Tu labor es analizar la brecha entre su ADN vital actual (habilidades, conocimientos, trayectoria) y la vacante, y diseñar un Plan de Preparación.

      El plan debe ser realista y estructurado. Debe durar entre 3 y 12 meses dependiendo de la complejidad.
      Crea entre 3 y 5 fases.
      Crea un máximo de 15 tareas en total. Las tareas deben durar un estimado de 1 a 4 horas cada una (representan el esfuerzo del usuario en su tiempo libre).
      Actividades recurrentes (e.g. estudiar inglés 30 mins diarios, hacer networking semanal) DEBEN ir en la lista de "habits" (hábitos).

      Devuelve un objeto JSON con el siguiente formato exacto:
      {
        "title": "Conseguir empleo como ${jobTitle} en ${company}",
        "description": "Plan estratégico de preparación para solventar las brechas de habilidades y certificaciones requeridas.",
        "readinessScore": 65,
        "gaps": ["Falta de certificación X", "Falta de portafolio con Next.js"],
        "phases": [
          {
            "title": "Fase 1: Título de Fase",
            "description": "Objetivo de esta fase",
            "targetDaysFromNow": 30,
            "milestone": {
              "title": "Hito medible",
              "description": "Descripción del entregable final de la fase",
              "evaluationType": "text | document | image | none",
              "evaluationInstructions": "Instrucciones de verificación"
            },
            "tasks": [
              {
                "name": "Nombre de la Tarea",
                "description": "Detalle paso a paso",
                "estimatedHours": 3,
                "daysFromStart": 10
              }
            ]
          }
        ],
        "habits": [
          {
            "title": "Hábito de Carrera",
            "description": "Detalle del hábito",
            "frequency": { "type": "daily" | "weekly", "value": 1 },
            "estimatedHours": 1.0
          }
        ]
      }

      Devuelve SOLO el JSON sin formateadores markdown adicionales.

      ADN ACTUAL DEL USUARIO:
      """
      ${structuredDNA}
      """

      REQUISITOS DEL EMPLEO:
      """
      ${jobOfferText}
      """
    `;

    const client = this.getClient();
    const model = this.getModel();

    try {
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "You are a Career Goal Planner. Return JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      console.error('[CareerService] Error generating career plan:', error);
      throw new Error('No se pudo generar el plan de carrera.');
    }
  }
}
