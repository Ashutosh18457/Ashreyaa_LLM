import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { Attachment } from '../types';
import { cn } from '../utils';

interface ChatInputProps {
  onSend: (content: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((content.trim() || attachments.length > 0) && !isLoading) {
      onSend(content, attachments);
      setContent('');
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          base64,
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {attachments.map(att => (
              <div key={att.id} className="relative group animate-in fade-in zoom-in duration-200">
                {att.type.startsWith('image/') ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex flex-col items-center justify-center bg-zinc-900 rounded-xl border border-white/10 text-[10px] text-center p-2 break-all shadow-lg">
                    <Paperclip size={16} className="mb-1 text-teal-500" />
                    <span className="line-clamp-2 text-zinc-400 font-medium">{att.name}</span>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110 shadow-xl z-10"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="relative flex items-end gap-3 bg-zinc-900/50 border border-white/10 rounded-2xl p-2 focus-within:border-teal-500/50 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all shadow-2xl">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-zinc-500 hover:text-teal-400 hover:bg-white/5 rounded-xl transition-all active:scale-95"
            title="Attach files"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or drop files..."
            className="flex-1 min-h-[44px] max-h-40 py-2.5 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 resize-none transition-all text-sm font-medium"
            rows={1}
          />
          
          <button
            onClick={handleSend}
            disabled={(!content.trim() && attachments.length === 0) || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-all active:scale-95 shadow-lg",
              content.trim() || attachments.length > 0
                ? "bg-teal-500 text-black hover:bg-teal-400 shadow-teal-500/20"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <p className="text-[10px] text-zinc-600 font-medium tracking-wide flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-teal-500/50" />
            Ashreya AI v2.0
          </p>
          <p className="text-[10px] text-zinc-600 font-medium tracking-wide flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-teal-500/50" />
            Enterprise Grade Security
          </p>
        </div>
      </div>
    </div>
  );
};
