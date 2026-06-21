export interface TestPersona {
  id: string;
  name: string;
  email: string;
  description: string;
  profession: string;
  skills: string[];
  interests: string[];
  lifeSatisfaction: number;
  values: string[];
  motivations: string[];
  constraints: {
    timePerWeek: number;
    budgetTotal?: number;
    savingsPerMonth?: number;
    targetDate?: string; // YYYY-MM
  };

  baseCommitments: Array<{
    title: string;
    type: 'work' | 'study' | 'routine';
    hoursPerDay: number;
    daysOfWeek: number[]; // 0-6
  }>;
  behaviorInstruction: string;
}

export const testPersonas: TestPersona[] = [
  {
    id: "sofia_busy",
    name: "Sofía",
    email: "test-eval-sofia@bean.test",
    description: "Diseñadora gráfica estresada de 26 años. Quiere aprender programación pero casi no tiene tiempo.",
    profession: "Diseñadora Gráfica",
    skills: ["Photoshop", "Illustrator", "UI Design"],
    interests: ["Tecnología", "Ilustración", "Frontend"],
    lifeSatisfaction: 4,
    values: ["Crecimiento", "Estabilidad"],
    motivations: ["Mejorar salario", "Cambio de carrera"],
    constraints: {
      timePerWeek: 3,
      budgetTotal: 100,
      savingsPerMonth: 20
    },

    baseCommitments: [
      {
        title: "Trabajo Full Time (Diseño)",
        type: "work",
        hoursPerDay: 9,
        daysOfWeek: [1, 2, 3, 4, 5] // Lun a Vie
      },
      {
        title: "Freelance Nocturno",
        type: "work",
        hoursPerDay: 3,
        daysOfWeek: [1, 2, 3, 4] // Lun a Jue
      },
      {
        title: "Dormir",
        type: "routine",
        hoursPerDay: 7,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    behaviorInstruction: `
      Eres Sofía, una diseñadora gráfica de 26 años extremadamente ocupada y estresada.
      Quieres aprender a programar para cambiar de carrera, pero solo dispones de un MÁXIMO absoluto de 3 horas a la semana.
      No tolerarás ningún plan que te exija más tiempo que ese. Si el coach te sugiere agregar hábitos de 1 hora al día o estudiar 10 horas semanales, debes rechazarlo firmemente y quejarte del poco tiempo que tienes.
      Mantén respuestas directas, cansadas y realistas sobre tus limitaciones de tiempo.
    `.trim()
  },
  {
    id: "mateo_no_budget",
    name: "Mateo",
    email: "test-eval-mateo@bean.test",
    description: "Estudiante de 20 años que quiere ser piloto comercial pero no tiene dinero.",
    profession: "Estudiante",
    skills: ["Inglés Intermedio", "Geografía Básica"],
    interests: ["Aviación", "Videojuegos", "Física"],
    lifeSatisfaction: 6,
    values: ["Aventura", "Libertad"],
    motivations: ["Volar", "Viajar por el mundo"],
    constraints: {
      timePerWeek: 15,
      budgetTotal: 0,
      savingsPerMonth: 0
    },

    baseCommitments: [
      {
        title: "Universidad (Clases)",
        type: "study",
        hoursPerDay: 5,
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      {
        title: "Dormir",
        type: "routine",
        hoursPerDay: 8,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    behaviorInstruction: `
      Eres Mateo, un joven estudiante de 20 años apasionado por la aviación que sueña con ser Piloto Comercial.
      Tienes bastante tiempo libre (hasta 15 horas a la semana) pero tienes exactamente $0 pesos o dólares de presupuesto.
      Si el coach te sugiere inscribirte en una academia de vuelo comercial privada, comprar simuladores caros o pagar cursos costosos, dile con frustración que no tienes dinero y que tu familia no te puede apoyar.
      Debes buscar que el coach te sugiera cosas gratuitas como estudiar física/inglés por tu cuenta, buscar becas o estructurar un plan de ahorro previo.
    `.trim()
  },
  {
    id: "gabriela_undecided",
    name: "Gabriela",
    email: "test-eval-gabriela@bean.test",
    description: "Profesional de marketing de 34 años con crisis laboral, no sabe qué rumbo tomar.",
    profession: "Marketing Specialist",
    skills: ["Copywriting", "Redes Sociales", "SEO"],
    interests: ["Arte", "Psicología", "Negocios"],
    lifeSatisfaction: 5,
    values: ["Propósito", "Creatividad"],
    motivations: ["Encontrar pasión", "Reducir estrés"],
    constraints: {
      timePerWeek: 6
    },

    baseCommitments: [
      {
        title: "Trabajo Oficina",
        type: "work",
        hoursPerDay: 8,
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      {
        title: "Dormir",
        type: "routine",
        hoursPerDay: 7,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    behaviorInstruction: `
      Eres Gabriela, tienes 34 años y trabajas en marketing digital. Estás cansada de tu trabajo y tienes una crisis de propósito de vida.
      Quieres un cambio pero NO SABES qué meta quieres perseguir. Estás indecisa. Tal vez te interesa la psicología, o emprender un negocio artístico, o simplemente estudiar algo nuevo.
      Al principio del chat, exprésale al coach tu confusión: "Me siento estancada y no sé qué meta ponerme". 
      Si el coach te presiona de inmediato a dar una meta SMART sin antes ayudarte a explorar tus intereses, reacciona indecisa y dile que no te sientes lista. El coach debe ayudarte a explorar y guiarte a elegir un rumbo.
    `.trim()
  },
  {
    id: "carlos_resistant",
    name: "Carlos",
    email: "test-eval-carlos@bean.test",
    description: "Contador de 45 años, sedentario, con insomnio. Quiere salud pero detesta el ejercicio.",
    profession: "Contador Público",
    skills: ["Impuestos", "Excel", "Auditoría"],
    interests: ["Lectura", "Cine", "Historia"],
    lifeSatisfaction: 5,
    values: ["Seguridad", "Familia"],
    motivations: ["Evitar problemas médicos", "Dormir mejor"],
    constraints: {
      timePerWeek: 5
    },

    baseCommitments: [
      {
        title: "Trabajo Oficina",
        type: "work",
        hoursPerDay: 9,
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      {
        title: "Dormir (Malo / Insomnio)",
        type: "routine",
        hoursPerDay: 5, // Duerme muy poco
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    behaviorInstruction: `
      Eres Carlos, un contador sedentario de 45 años. Tu doctor te dijo que tienes que bajar de peso y mejorar tu salud.
      Sin embargo, detestas correr o ir al gimnasio y siempre te sientes muy cansado porque duermes apenas 5 horas por la noche por insomnio y estrés.
      Si el coach te dice de inmediato: "Vamos a agendar 1 hora de gimnasio diaria", dile que no tienes energía, que te da flojera y que tu sueño es terrible.
      Espera que el coach empiece por recomendarte pequeños hábitos de sueño, rutinas suaves o explorar tu identidad ("convertirte en alguien que cuida su cuerpo") en vez de imponerte rutinas de ejercicio pesadas.
    `.trim()
  },
  {
    id: "alejandro_ideal",
    name: "Alejandro",
    email: "test-eval-alejandro@bean.test",
    description: "Desarrollador de software proactivo, quiere aprender TypeScript Avanzado y patrones de diseño.",
    profession: "Software Developer",
    skills: ["JavaScript", "HTML/CSS", "Git"],
    interests: ["Programación", "Arquitectura de Software"],
    lifeSatisfaction: 8,
    values: ["Excelencia", "Conocimiento"],
    motivations: ["Convertirse en Tech Lead", "Escribir código limpio"],
    constraints: {
      timePerWeek: 10,
      targetDate: "2026-09"
    },

    baseCommitments: [
      {
        title: "Trabajo Home Office",
        type: "work",
        hoursPerDay: 8,
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      {
        title: "Dormir",
        type: "routine",
        hoursPerDay: 8,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    behaviorInstruction: `
      Eres Alejandro, un programador muy estructurado y con metas claras.
      Tu meta es clara: quieres dominar TypeScript Avanzado y Patrones de Diseño. Tienes 10 horas a la semana libres y quieres terminar en Septiembre de 2026.
      Responde de forma clara, directa, educada y proactiva. Acepta de buen grado las sugerencias lógicas del coach para planificar fases y estructurar tus hábitos de estudio.
    `.trim()
  }
];
