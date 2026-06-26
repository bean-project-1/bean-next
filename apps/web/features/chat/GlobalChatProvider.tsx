'use client';

import React, { createContext, useContext, useState, ReactNode, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SpaceChat } from '../spaces/components/SpaceChat';
import { useUIStore } from '../../hooks/useUIStore';

interface GlobalChatContextType {
  isOpen: boolean;
  existingGoalData: any;
  openChat: (initialMessage?: string, context?: string, existingGoalData?: any) => void;
  openDraft: (goalData: any) => void;
  closeChat: () => void;
}

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

function URLChatTrigger({ openChat }: { openChat: (initialMessage?: string, context?: string) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const context = searchParams.get('context');
    if (context === 'weekly_review') {
      openChat(undefined, 'weekly_review');
      
      // Clean up the URL parameter
      const params = new URLSearchParams(searchParams.toString());
      params.delete('context');
      const query = params.toString() ? `?${params.toString()}` : '';
      router.replace(`${pathname}${query}`);
    }
  }, [searchParams, openChat, router, pathname]);

  return null;
}

export function GlobalChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMsg, setInitialMsg] = useState<string | undefined>(undefined);
  const [chatContext, setChatContext] = useState<string>('global');
  const [existingGoalData, setExistingGoalData] = useState<any>(undefined);

  const isSpaceZoomed = useUIStore(state => state.isSpaceZoomed);
  const pathname = usePathname();
  
  // Hide global chat if zoomed into any space (since that space will render its own chat)
  // Also hide on the public landing page — chat is an in-app feature
  const hideGlobalButton = isSpaceZoomed || pathname === '/';

  const openChat = (msg?: string, context?: string, goalData?: any) => {
    setInitialMsg(msg);
    setChatContext(context || 'global');
    setExistingGoalData(goalData);
    setIsOpen(true);
  };

  // Open the chat directly on the draft tab with the given goal data pre-loaded
  const openDraft = (goalData: any) => {
    setExistingGoalData(goalData);
    setInitialMsg(undefined);
    setChatContext('refactor_goal');
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setTimeout(() => {
      setInitialMsg(undefined);
      setChatContext('global');
      setExistingGoalData(undefined);
    }, 300);
  };

  return (
    <GlobalChatContext.Provider value={{ isOpen, existingGoalData, openChat, openDraft, closeChat }}>
      {children}
      
      <Suspense fallback={null}>
        <URLChatTrigger openChat={openChat} />
      </Suspense>

      {!hideGlobalButton && (
        <SpaceChat 
          spaceId="personal" 
          spaceName="Árbol Personal" 
          members={[]} 
          isOpenExternal={isOpen}
          onChangeOpenExternal={(val) => {
            if (val) {
              openChat();
            } else {
              closeChat();
            }
          }}
          onRefreshTree={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('refresh-life-tree'));
            }
          }} 
          initialMessage={initialMsg}
          existingGoalData={existingGoalData}
        />
      )}
    </GlobalChatContext.Provider>
  );
}

export function useGlobalChat() {
  const context = useContext(GlobalChatContext);
  if (!context) throw new Error('useGlobalChat must be used within GlobalChatProvider');
  return context;
}

