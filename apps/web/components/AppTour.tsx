// =======================================================
// BEAN — App Tour Coordination (Dual Tour: Coach/Roadmap + Dashboard)
// apps/web/components/AppTour.tsx
// =======================================================
'use client';

import { useEffect, useRef, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useGlobalChat } from '@/features/chat/GlobalChatProvider';

interface Props {
  hasSeenTour: boolean;
}

export function AppTour({ hasSeenTour }: Props) {
  const hasStartedRef = useRef(false);
  const { isOpen } = useGlobalChat();
  const [wantsMainTour, setWantsMainTour] = useState(false);

  useEffect(() => {
    const isFreshOnboarding = sessionStorage.getItem('just_onboarded') === 'true' || 
                              sessionStorage.getItem('first_tour_active') === 'true' ||
                              !!sessionStorage.getItem('just_onboarded_goal');
                              
    if (hasSeenTour && !isFreshOnboarding) return;

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
              description: 'Tu perfil completo. Revisa tus atributos, tu brújula vocacional y cómo evoluciona tu identidad.',
              side: 'top',
              align: 'center'
            }
          },
          {
            element: '#tour-nav-descubre',
            popover: {
              title: '💡 Descubre',
              description: 'Explora nuevos caminos, ideas de proyectos y posibles trayectorias según tu perfil.',
              side: 'top',
              align: 'center'
            }
          },
          {
            element: '#tour-nav-bean',
            popover: {
              title: '🤖 Chat y Herramientas',
              description: 'Toca una vez para abrir el Chat y hablar con el Coach desde cualquier pantalla. Si MANTIENES PRESIONADO este botón, se abrirán opciones rápidas como Notas, Pomodoro o el Semillero.',
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
          }
        ],
        onDestroyStarted: () => {
          onboardingTour.destroy();
          // Flag that we want the main dashboard tour, but wait for the chat to close
          setWantsMainTour(true);
        }
      });
      onboardingTour.drive();
    };

    // ─── 3. Event Listener / Lifecycle ─────────────────────────
    const handleStartOnboarding = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      startOnboardingTour();
    };

    window.addEventListener('start-onboarding-tour', handleStartOnboarding);

    // Watch for chat closing if we want the main tour
    if (wantsMainTour && !isOpen) {
      setWantsMainTour(false);
      setTimeout(() => {
        startMainTour();
      }, 600);
    }

    // If it's a standard user returning or not starting onboarding flow directly, run main tour
    const isNewUserOnboarding = sessionStorage.getItem('just_onboarded') === 'true' || 
                                sessionStorage.getItem('first_tour_active') === 'true' ||
                                !!sessionStorage.getItem('just_onboarded_goal');
    
    let timer: any;
    if (!isNewUserOnboarding) {
      timer = setTimeout(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;
        startMainTour();
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('start-onboarding-tour', handleStartOnboarding);
    };
  }, [hasSeenTour, wantsMainTour, isOpen]);

  return null;
}
