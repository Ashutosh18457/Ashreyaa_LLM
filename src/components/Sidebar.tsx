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
  Cpu
} from 'lucide-react';
import { AssistantCategory } from '../types';
import { cn } from '../utils';

interface SidebarProps {
  activeCategory: AssistantCategory;
  onCategoryChange: (category: AssistantCategory) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategoryChange, onNewChat }) => {
  const categories: { id: AssistantCategory; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'general', label: 'General', icon: <LayoutDashboard size={18} />, description: 'Versatile AI assistant' },
    { id: 'ml-engineer', label: 'ML Engineer', icon: <Cpu size={18} />, description: 'Train & optimize models' },
    { id: 'coding', label: 'Coding', icon: <Code size={18} />, description: 'Technical & programming' },
    { id: 'research', label: 'Research', icon: <Search size={18} />, description: 'Deep analysis & search' },
    { id: 'satellite', label: 'Satellite', icon: <Search size={18} />, description: 'Orbital intelligence' },
  ];

  return (
    <div className="w-64 bg-[#0c0c0e] text-zinc-400 flex flex-col h-full border-r border-white/5">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
          A
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold tracking-tight leading-none">Ashreya AI</span>
          <span className="text-[10px] text-teal-500/80 font-semibold tracking-wider uppercase mt-1">Enterprise</span>
        </div>
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
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-zinc-200 transition-all group">
          <MessageSquare size={18} className="text-zinc-500 group-hover:text-teal-400 transition-colors" />
          <span className="text-sm font-semibold">History</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-zinc-200 transition-all group">
          <Settings size={18} className="text-zinc-500 group-hover:text-teal-400 transition-colors" />
          <span className="text-sm font-semibold">Settings</span>
        </button>
      </div>
    </div>
  );
};
