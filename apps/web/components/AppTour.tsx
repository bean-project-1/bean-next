'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface Props {
  hasSeenTour: boolean;
}

export function AppTour({ hasSeenTour }: Props) {
  useEffect(() => {
    if (hasSeenTour) return;

    const tour = driver({
      showProgress: true,
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Atrás',
      doneBtnText: 'Empezar',
      steps: [
        {
          popover: {
            title: '¡Bienvenido a tu Bosque!',
            description: 'Este es tu espacio personal. Aquí crecerán tus proyectos y hábitos. Vamos a dar un rápido recorrido.',
          }
        },
        {
          element: '#tour-nav-home',
          popover: {
            title: '🌳 El Árbol (Tu Bosque)',
            description: 'Aquí plantas tus objetivos. Cada rama es un proyecto o meta, y las hojas son los pasos que debes dar.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-top-toggle',
          popover: {
            title: '🌱 El Semillero',
            description: 'Alterna esta vista para entrar al Semillero. Aquí guardamos las ideas sueltas que nos diste. Cuando estén maduras, puedes pasarlas al Bosque.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#tour-nav-schedule',
          popover: {
            title: '🧭 La Agenda (Brújula)',
            description: 'Esta es tu brújula diaria. Te organiza el tiempo disponible basándose en tu rutina de sueño y trabajo que nos contaste.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-nav-dna',
          popover: {
            title: '🧬 Tu ADN',
            description: 'Aquí vive tu perfil, tus habilidades (extraídas de tu CV/entrevista) y tus valores. Crecer en tu bosque mejora tu ADN.',
            side: 'top',
            align: 'center'
          }
        }
      ],
      onDestroyStarted: () => {
        // Marcar como visto en la base de datos
        fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasSeenTour: true })
        }).catch(console.error);
        tour.destroy();
      }
    });

    // Iniciar después de un breve momento para asegurar que la UI cargó
    setTimeout(() => {
      tour.drive();
    }, 1000);

  }, [hasSeenTour]);

  return null;
}
