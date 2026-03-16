import React from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { User, Bot, ExternalLink } from 'lucide-react';
import { cn } from '../utils';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "flex w-full gap-4 p-6 transition-colors",
      isAssistant ? "bg-white/50" : "bg-transparent"
    )}>
      <div className="flex-shrink-0">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
          isAssistant ? "bg-teal-600 text-white" : "bg-zinc-900 text-white"
        )}>
          {isAssistant ? <Bot size={18} /> : <User size={18} />}
        </div>
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900">
            {isAssistant ? 'Ashreya AI' : 'You'}
          </span>
          <span className="text-[10px] text-zinc-400">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map(att => (
              <div key={att.id} className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
                {att.type.startsWith('image/') ? (
                  <img src={att.url} alt={att.name} className="max-w-[200px] max-h-[200px] object-contain" />
                ) : (
                  <div className="p-2 text-xs flex items-center gap-2">
                    <Paperclip size={14} className="text-zinc-400" />
                    <span>{att.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <MarkdownRenderer content={message.content} />

        {message.groundingMetadata?.groundingChunks && message.groundingMetadata.groundingChunks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Sources</p>
            <div className="flex flex-wrap gap-2">
              {message.groundingMetadata.groundingChunks.map((chunk, idx) => chunk.web && (
                <a
                  key={idx}
                  href={chunk.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded text-[11px] text-zinc-600 transition-colors"
                >
                  <ExternalLink size={10} />
                  <span className="truncate max-w-[150px]">{chunk.web.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import { Paperclip } from 'lucide-react';
