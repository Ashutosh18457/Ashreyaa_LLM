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
    <div className="border-t border-zinc-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map(att => (
              <div key={att.id} className="relative group">
                {att.type.startsWith('image/') ? (
                  <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded-lg border border-zinc-200" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-zinc-100 rounded-lg border border-zinc-200 text-[10px] text-center p-1 break-all">
                    {att.name}
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute -top-1 -right-1 bg-zinc-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="relative flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-zinc-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
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
            placeholder="Ask Nexus AI anything..."
            className="flex-1 min-h-[44px] max-h-40 p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none transition-all"
            rows={1}
          />
          
          <button
            onClick={handleSend}
            disabled={(!content.trim() && attachments.length === 0) || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              content.trim() || attachments.length > 0
                ? "bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-[10px] text-zinc-400 mt-2 text-center">
          Nexus AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};
