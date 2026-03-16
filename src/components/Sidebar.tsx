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
    <div className="w-64 bg-zinc-900 text-zinc-400 flex flex-col h-full border-r border-zinc-800">
      <div className="p-4 flex items-center gap-3 border-b border-zinc-800">
        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="text-white font-bold tracking-tight">Ashreya AI</span>
      </div>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-zinc-700 shadow-sm"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Capabilities</p>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group text-left",
              activeCategory === cat.id 
                ? "bg-teal-500/10 text-teal-400" 
                : "hover:bg-zinc-800 hover:text-zinc-200"
            )}
          >
            <div className={cn(
              "transition-colors",
              activeCategory === cat.id ? "text-teal-400" : "text-zinc-500 group-hover:text-zinc-300"
            )}>
              {cat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{cat.label}</span>
              <span className="text-[10px] opacity-60">{cat.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
          <MessageSquare size={18} />
          <span className="text-sm font-medium">History</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
