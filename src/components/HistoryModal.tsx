import React from 'react';
import { X, MessageSquare, Clock, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectChat }) => {
  if (!isOpen) return null;

  // Mock history data - in a real app this would come from localStorage or a database
  const history: ChatHistoryItem[] = [
    { id: '1', title: 'ML Model Optimization', timestamp: new Date(Date.now() - 3600000), preview: 'How can I optimize my PyTorch training loop for faster convergence?' },
    { id: '2', title: 'Satellite Data Analysis', timestamp: new Date(Date.now() - 86400000), preview: 'Analyze the latest Sentinel-2 imagery for agricultural monitoring.' },
    { id: '3', title: 'Business Strategy Q1', timestamp: new Date(Date.now() - 172800000), preview: 'Develop a monetization strategy for a SaaS platform.' },
    { id: '4', title: 'Neural Network Architecture', timestamp: new Date(Date.now() - 604800000), preview: 'What are the benefits of using Transformer-based models for time-series?' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
                  <Clock size={20} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Session History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search past sessions..." 
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-teal-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  onSelectChat(item.id);
                  onClose();
                }}
                className="group p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl cursor-pointer transition-all flex items-start gap-4"
              >
                <div className="p-2 bg-zinc-800 rounded-xl text-zinc-500 group-hover:text-teal-400 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-zinc-200 truncate">{item.title}</h3>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                      {format(item.timestamp, 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1 font-medium">{item.preview}</p>
                </div>
                <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-6 bg-zinc-950/50 border-t border-white/5 text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              History is stored locally on your device
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
