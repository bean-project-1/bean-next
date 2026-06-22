'use client';

import React, { createContext, useContext, useState, ReactNode, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { GlobalAIChat } from './GlobalAIChat';
import { MessageSquare, Bot } from 'lucide-react';
import { useUIStore } from '../../hooks/useUIStore';

interface GlobalChatContextType {
  isOpen: boolean;
  openChat: (initialMessage?: string, context?: string, existingGoalData?: any) => void;
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

  const openChat = (msg?: string, context?: string, goalData?: any) => {
    setInitialMsg(msg);
    setChatContext(context || 'global');
    setExistingGoalData(goalData);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setTimeout(() => {
      setInitialMsg(undefined);
      setChatContext('global');
      setExistingGoalData(undefined);
    }, 300); // Clear message and reset context after animation
  };

  return (
    <GlobalChatContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
      
      <Suspense fallback={null}>
        <URLChatTrigger openChat={openChat} />
      </Suspense>

      {/* Floating Action Button (FAB) */}
      {!isOpen && !isSpaceZoomed && (
        <button
          onClick={() => openChat()}
          className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[9990] w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      <GlobalAIChat isOpen={isOpen} onClose={closeChat} initialMessage={initialMsg} context={chatContext} existingGoalData={existingGoalData} />
    </GlobalChatContext.Provider>
  );
}

export function useGlobalChat() {
  const context = useContext(GlobalChatContext);
  if (!context) throw new Error('useGlobalChat must be used within GlobalChatProvider');
  return context;
}

