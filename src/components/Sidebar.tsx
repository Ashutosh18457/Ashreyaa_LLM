import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Code, 
  Briefcase, 
  Lightbulb, 
  Zap,
  Settings,
  Plus,
  MessageSquare,
  Cpu,
  Globe,
  CreditCard,
  Presentation
} from 'lucide-react';
import { AssistantCategory } from '../types';
import { cn } from '../utils';

interface SidebarProps {
  activeCategory: AssistantCategory;
  onCategoryChange: (category: AssistantCategory) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenPayment: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  onNewChat,
  onOpenSettings,
  onOpenHistory,
  onOpenPayment,
  isOpen,
  onClose
}) => {
  const categories: { id: AssistantCategory; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'general', label: 'General', icon: <LayoutDashboard size={18} />, description: 'Versatile AI assistant' },
    { id: 'ml-engineer', label: 'ML Engineer', icon: <Cpu size={18} />, description: 'Train & optimize models' },
    { id: 'coding', label: 'Coding', icon: <Code size={18} />, description: 'Technical & programming' },
    { id: 'research', label: 'Research', icon: <Search size={18} />, description: 'Deep analysis & search' },
    { id: 'satellite', label: 'Satellite', icon: <Globe size={18} />, description: 'Orbital intelligence' },
    { id: 'presentation', label: 'PPT Generator', icon: <Presentation size={18} />, description: 'Create presentations' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0c0c0e] text-zinc-400 flex flex-col h-full border-r border-white/5 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight leading-none">Ashreya AI</span>
              <span className="text-[10px] text-teal-500/80 font-semibold tracking-wider uppercase mt-1">Enterprise</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

      <div className="px-4 mb-6">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 shadow-sm active:scale-[0.98]"
        >
          <Plus size={18} />
          <span className="text-sm font-semibold">New Session</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Capabilities</p>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left",
              activeCategory === cat.id 
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                : "hover:bg-white/5 hover:text-zinc-200 border border-transparent"
            )}
          >
            <div className={cn(
              "transition-colors p-1.5 rounded-lg",
              activeCategory === cat.id ? "bg-teal-500/20 text-teal-400" : "bg-zinc-800/50 text-zinc-500 group-hover:text-zinc-300"
            )}>
              {cat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{cat.label}</span>
              <span className="text-[10px] opacity-50 font-medium">{cat.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-1">
        <button 
          onClick={onOpenPayment}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-teal-400 transition-all group border border-transparent hover:border-teal-500/20"
        >
          <CreditCard size={18} className="text-zinc-500 group-hover:text-teal-400 transition-colors" />
          <span className="text-sm font-semibold">Billing</span>
        </button>
        <button 
          onClick={onOpenHistory}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-zinc-200 transition-all group"
        >
          <MessageSquare size={18} className="text-zinc-500 group-hover:text-teal-400 transition-colors" />
          <span className="text-sm font-semibold">History</span>
        </button>
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-zinc-200 transition-all group"
        >
          <Settings size={18} className="text-zinc-500 group-hover:text-teal-400 transition-colors" />
          <span className="text-sm font-semibold">Settings</span>
        </button>
      </div>
    </div>
    </>
  );
};
