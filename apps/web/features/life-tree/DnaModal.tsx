'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Brain, Heart, Target, Lightbulb } from 'lucide-react';

interface DnaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DnaItem = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white/50 shadow-sm transition-all hover:bg-white/80">
    <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
      <Icon size={20} />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  </div>
);

const DnaModal = ({ isOpen, onClose }: DnaModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl z-[101] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500 rounded-lg text-white">
                    <Sparkles size={18} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Your BEAN DNA</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid gap-4">
                <DnaItem 
                  icon={Heart} 
                  label="Values" 
                  value="Freedom, Creativity, Impact" 
                  color="bg-rose-500" 
                />
                <DnaItem 
                  icon={Brain} 
                  label="Personality" 
                  value="ENTP-A | The Visionary" 
                  color="bg-violet-500" 
                />
                <DnaItem 
                  icon={Lightbulb} 
                  label="Interests" 
                  value="AI, Philosophy, Outdoors" 
                  color="bg-amber-500" 
                />
                <DnaItem 
                  icon={Sparkles} 
                  label="Motivations" 
                  value="Solving complex problems" 
                  color="bg-blue-500" 
                />
                <DnaItem 
                  icon={Target} 
                  label="Purpose" 
                  value="Building tools for human growth" 
                  color="bg-emerald-500" 
                />
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Close Vision
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DnaModal;
