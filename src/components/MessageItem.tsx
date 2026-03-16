import React from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { User, Bot, ExternalLink, Sparkles, Paperclip } from 'lucide-react';
import { cn } from '../utils';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "flex w-full gap-5 p-6 sm:p-8 transition-all duration-300",
      isAssistant ? "bg-white/[0.02]" : "bg-transparent"
    )}>
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105",
          isAssistant 
            ? "bg-gradient-to-br from-teal-400 to-teal-600 text-black shadow-teal-500/20" 
            : "bg-zinc-800 text-zinc-400 border border-white/5"
        )}>
          {isAssistant ? <Bot size={22} /> : <User size={22} />}
        </div>
      </div>
      
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-bold tracking-tight",
              isAssistant ? "text-teal-400" : "text-white"
            )}>
              {isAssistant ? 'Ashreya AI' : 'You'}
            </span>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              {format(message.timestamp, 'HH:mm')}
            </span>
          </div>
          {isAssistant && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-teal-500/10 rounded-full border border-teal-500/20">
              <Sparkles size={10} className="text-teal-400" />
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-tighter">Verified</span>
            </div>
          )}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {message.attachments.map(att => (
              <div key={att.id} className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl group cursor-pointer transition-all hover:border-teal-500/50">
                {att.type.startsWith('image/') ? (
                  <img src={att.url} alt={att.name} className="max-w-[300px] max-h-[300px] object-contain transition-transform group-hover:scale-105" />
                ) : (
                  <div className="p-3 text-xs flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <Paperclip size={16} className="text-teal-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-200">{att.name}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">{att.type.split('/')[1]}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <MarkdownRenderer content={message.content} />
        </div>

        {message.groundingMetadata?.groundingChunks && message.groundingMetadata.groundingChunks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-teal-500 rounded-full" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Verified Sources</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.groundingMetadata.groundingChunks.map((chunk, idx) => chunk.web && (
                <a
                  key={idx}
                  href={chunk.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-teal-500/30 rounded-xl text-[11px] text-zinc-400 hover:text-teal-400 transition-all shadow-sm group"
                >
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-teal-400 transition-colors" />
                  <span className="truncate max-w-[200px] font-medium">{chunk.web.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
