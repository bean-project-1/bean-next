# 🌳 BEAN — CONTEXTO COMPLETO DEL PROYECTO

Estoy construyendo un producto llamado **BEAN**, cuya misión es ayudar a las personas a diseñar, entender y ejecutar su plan de vida a través de un sistema inteligente y visual representado como un árbol.

---

# 🧠 MODELO CONCEPTUAL (CORE)

BEAN se basa en 3 capas principales:

## 🌱 Identidad (quién eres)

* valores
* personalidad
* intereses
* propósito
* motivaciones

## 🌿 Capital humano (con qué cuentas)

* conocimiento
* habilidades
* carrera
* ingresos
* capital social
* salud física
* energía
* resiliencia emocional
* entorno

## 🌳 Experiencia de vida (cómo estás viviendo)

* satisfacción laboral
* relaciones
* bienestar mental
* tiempo libre
* impacto social
* estabilidad financiera
* progreso percibido
* felicidad

---

# 🧬 ADN DEL USUARIO

Cada dimensión tiene esta estructura:

* score (0-100)
* importance (0-100)
* satisfaction (0-100)
* trend (up/down/stable)

Además, cada dimensión tiene **atributos granulares**:

Ejemplo:

* valores → [{ name: "familia", alignment: 80 }]
* intereses → [{ name: "ciclismo", frequency: 4 }]
* habilidades → [{ name: "programación", level: 85 }]

👉 El ADN es una **agregación de estos atributos**
👉 Los atributos son la **fuente de verdad**

---

# 🧠 SCORES DERIVADOS

* growthScore → progreso general
* balanceScore → qué tan equilibrada está la vida
* alignmentScore → coherencia con propósito/valores
* energyIndex → energía disponible

---

# 🗄️ ARQUITECTURA (NoSQL)

Se usa una base de datos NoSQL (tipo MongoDB) con:

* users
* user_dna
* user_attributes
* base_commitments // Tareas diarias recurrentes (dormir, tareas de metas) unificadas
* goals
* actions // Eventos puntuales o una vez, las recurrentes viven en base_commitments
* events
* dna_history

👉 El ADN es calculado, no la fuente de verdad

---

# 🌳 MODELO VISUAL (ÁRBOL)

El árbol representa la vida del usuario:

* 🌱 raíces → identidad + capital
* 🌿 tronco → estabilidad / energía / consistencia (alimentado por los Compromisos Base)
* 🌳 ramas → objetivos (goals)
* 🍃 hojas → acciones (tareas específicas o hitos)
* 🌈 color → balance
* 📏 tamaño → growth

---

# 🎨 IMPLEMENTACIÓN VISUAL

Se usa:

* SVG como base visual
* GSAP para animaciones
* React / Next.js para estado

---

# 🌳 ESTRUCTURA DEL SVG

El árbol está dividido en:

* roots
* trunk (forma sólida, no línea)
* branches (paths independientes)
* leaves (paths orgánicos, no círculos)

Cada elemento tiene IDs para animación:

* trunk_main
* branch_1, branch_2, ...
* leaf_1, leaf_2, ...

---

# 🎬 ANIMACIÓN

NO se usan frames.

Todo es dinámico con GSAP:

Ejemplos:

* crecimiento del tronco → scaleY
* crecimiento de ramas → scaleX
* aparición de hojas → scale + opacity
* movimiento → rotation / skew / morphing

Ejemplo:

gsap.from("#branch_1", {
scaleX: 0,
transformOrigin: "left center"
});

---

# 🔥 PRINCIPIOS CLAVE

* No mostrar 19 métricas → mostrar insights
* Dimensiones = interpretación
* Atributos = evidencia
* El árbol NO es decoración → es el producto
* Todo debe ser dinámico y conectado al ADN

---

# 🛡️ COMPROMISOS BASE (NUEVO PARADIGMA)

En BEAN no existen los "hábitos" como tareas aisladas o castigadoras. En su lugar, usamos **Compromisos Base**.

* **Unificación Jerárquica:** Las tareas repetitivas necesarias para alcanzar una meta (ej. "leer 20 mins para la tesis") viven al mismo nivel que las tareas fundamentales de mantenimiento de vida (ej. "dormir 8 horas"). Ambas son Compromisos Base.
* **Agrupación por Energía:** En la interfaz, los Compromisos Base no se organizan por hora del día, sino por **Estado de Energía** (Alta energía vs. Baja energía), dándole al usuario la flexibilidad compasiva de elegir qué hacer según cómo se siente.
* **Impacto Visual:** Cumplir con los Compromisos Base fortalece el **tronco**, asegurando que haya suficiente energía para que nazcan y crezcan las ramas (metas).

---

# 🚀 OBJETIVO ACTUAL

Estoy construyendo:

👉 un árbol animado que crece dinámicamente
👉 donde:

* nuevas ramas = nuevos objetivos
* nuevas hojas = acciones completadas
* el estado visual refleja el ADN del usuario

---

# 🎯 SIGUIENTE PASO

Quiero avanzar en:

La creacion de la base de datos en un contenedor docker con data mockeada para pruebas
Ejemplos:

* generar ramas dinámicamente desde datos
* conectar ADN → animaciones
* mejorar el diseño visual del árbol
* crear motor de insights
* construir onboarding

---

# 🧠 INSTRUCCIONES PARA LA IA

Actúa como:

* experto en producto
* experto en UX
* experto en frontend (React + SVG + animaciones)
* experto en sistemas inteligentes

Ayúdame a diseñar soluciones simples, escalables y elegantes.
Evita complejidad innecesaria.

---
