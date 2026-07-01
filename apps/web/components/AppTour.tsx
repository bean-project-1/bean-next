// =======================================================
// BEAN — App Tour Coordination (Dual Tour: Coach/Roadmap + Dashboard)
// apps/web/components/AppTour.tsx
// =======================================================
'use client';

import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface Props {
  hasSeenTour: boolean;
}

export function AppTour({ hasSeenTour }: Props) {
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasSeenTour) return;
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // ─── 1. Main Dashboard Tour Definition ──────────────────────
    const startMainTour = () => {
      console.log('[AppTour] Starting Main Dashboard Tour');
      const mainTour = driver({
        showProgress: true,
        popoverClass: 'bean-driver-popover',
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Atrás',
        doneBtnText: 'Comenzar Mi Día',
        steps: [
          {
            popover: {
              title: '🌳 ¡Bienvenido a tu Bosque!',
              description: 'Este es tu espacio personal. Aquí crecerán tus proyectos y hábitos. Vamos a dar un rápido recorrido por el resto de la plataforma.',
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
          // Mark tour as seen in user database
          fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hasSeenTour: true })
          }).catch(console.error);
          mainTour.destroy();
        }
      });
      mainTour.drive();
    };

    // ─── 2. First Goal/Coach Tour Definition ────────────────────
    const startOnboardingTour = () => {
      console.log('[AppTour] Starting Goal Roadmap & Coach Tour');
      const onboardingTour = driver({
        showProgress: true,
        popoverClass: 'bean-driver-popover',
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Atrás',
        doneBtnText: 'Ver Mi Bosque',
        steps: [
          {
            element: '#tour-goal-roadmap',
            popover: {
              title: '📋 La Mesa de Dibujo',
              description: 'Aquí está el borrador de tu plan. Cada fase contiene tareas y subtareas que te ayudarán a alcanzar tu objetivo. Puedes revisar y editar cualquier detalle haciendo clic en ellos.',
              side: 'left',
              align: 'center'
            }
          },
          {
            element: '#tour-coach-chat',
            popover: {
              title: '💬 Interactúa con tu Asistente',
              description: '¡Este es tu Coach personal! Pídele que agregue tareas, que cambie fechas o rediseñe el plan. ¡DATO CLAVE: Puedes arrastrar (drag & drop) cualquier tarea o fase directamente hacia cualquier parte de este panel de chat para añadirlo como contexto y hacer preguntas al instante!',
              side: 'right',
              align: 'center'
            }
          },
          {
            element: '#tour-nav-schedule',
            popover: {
              title: '📅 Agenda y Hábitos',
              description: 'Las tareas y hábitos que confirmes aquí se sincronizarán automáticamente con tu Agenda Diaria para ayudarte a encontrar el mejor momento para actuar.',
              side: 'top',
              align: 'center'
            }
          }
        ],
        onDestroyStarted: () => {
          onboardingTour.destroy();
          // Chain to Main Dashboard Tour automatically
          setTimeout(() => {
            startMainTour();
          }, 600);
        }
      });
      onboardingTour.drive();
    };

    // ─── 3. Event Listener / Lifecycle ─────────────────────────
    const handleStartOnboarding = () => {
      startOnboardingTour();
    };

    window.addEventListener('start-onboarding-tour', handleStartOnboarding);

    // If it's a standard user returning or not starting onboarding flow directly, run main tour
    const isNewUserOnboarding = sessionStorage.getItem('just_onboarded') === 'true' || sessionStorage.getItem('first_tour_active') === 'true';
    if (!isNewUserOnboarding) {
      const timer = setTimeout(() => {
        startMainTour();
      }, 1500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('start-onboarding-tour', handleStartOnboarding);
      };
    }

    return () => {
      window.removeEventListener('start-onboarding-tour', handleStartOnboarding);
    };

  }, [hasSeenTour]);

  return null;
}
