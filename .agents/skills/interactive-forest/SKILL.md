---
name: interactive-forest
description: Guía de diseño, reglas de UI y arquitectura visual para crear un bosque gamificado en primera persona en Bean.
---

# 🌲 Interactive Forest Design Guidelines

Este archivo contiene las reglas y la visión para transformar el Bosque de Bean en una experiencia inmersiva y gamificada.

## 🎯 Visión General
Queremos que el usuario sienta que navega un bosque en primera persona. Al hacer clic en un árbol, la "cámara" debe acercarse suavemente (zoom in) hacia el árbol, permitiendo ver sus detalles, e interactuar con cada rama individualmente.

## 🎨 Principios Visuales y Gamificación
*(Describe aquí cómo te imaginas los gráficos, colores, interacciones y el sentimiento general. Ej. ¿Estilo cartoon, realista, low-poly?)*
- **Estilo:** 
- **Colores:** 
- **Feedback visual (Gamificación):** 

## 🛠 Tecnologías y Librerías Preferidas
*(Instruye al agente sobre qué librerías usar para lograr este efecto)*
- [ ] Mantener **Framer Motion** y llevar las transformaciones 3D CSS al máximo (Perspectiva, Zoom, Pan).
- [ ] Migrar a **React Three Fiber (Three.js)** para un entorno 3D real y modelos 3D interactivos.
- [ ] Uso de **View Transitions API** para transiciones fluidas entre el bosque y el detalle de la meta.

## 📐 Reglas Estrictas para el Agente
1. Todo cambio visual debe mantener el rendimiento fluido (60fps).
2. Las animaciones deben sentirse orgánicas y vivas.
3. (Agrega más reglas aquí...)
