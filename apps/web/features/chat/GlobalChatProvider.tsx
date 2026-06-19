'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GlobalAIChat } from './GlobalAIChat';
import { MessageSquare } from 'lucide-react';

interface GlobalChatContextType {
  isOpen: boolean;
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
}

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

export function GlobalChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMsg, setInitialMsg] = useState<string | undefined>(undefined);

  const openChat = (msg?: string) => {
    setInitialMsg(msg);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setTimeout(() => setInitialMsg(undefined), 300); // Clear message after animation
  };

  return (
    <GlobalChatContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
      
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          onClick={() => openChat()}
          className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[9990] w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      <GlobalAIChat isOpen={isOpen} onClose={closeChat} initialMessage={initialMsg} />
    </GlobalChatContext.Provider>
  );
}

export function useGlobalChat() {
  const context = useContext(GlobalChatContext);
  if (!context) throw new Error('useGlobalChat must be used within GlobalChatProvider');
  return context;
}
