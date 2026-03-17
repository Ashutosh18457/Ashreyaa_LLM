import React, { useState } from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { User, Bot, ExternalLink, Sparkles, Paperclip, Presentation, Download } from 'lucide-react';
import { cn } from '../utils';
import { format } from 'date-fns';
import pptxgen from 'pptxgenjs';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);

  // Check if content is presentation JSON
  let presentationData = null;
  let isPresentation = false;
  
  if (isAssistant) {
    try {
      let contentToParse = message.content.trim();
      // Remove markdown code block if present
      if (contentToParse.startsWith('```json')) {
        contentToParse = contentToParse.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (contentToParse.startsWith('```')) {
        contentToParse = contentToParse.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      const parsed = JSON.parse(contentToParse);
      if (parsed.title && Array.isArray(parsed.slides)) {
        presentationData = parsed;
        isPresentation = true;
      }
    } catch (e) {
      // Not JSON, ignore
    }
  }

  const handleDownloadPPT = async () => {
    if (!presentationData) return;
    setIsGeneratingPPT(true);
    try {
      const pres = new pptxgen();
      
      // Title Slide
      const titleSlide = pres.addSlide();
      titleSlide.addText(presentationData.title, {
        x: 1, y: 2, w: '80%', h: 1.5,
        fontSize: 44, bold: true, color: '363636', align: 'center'
      });

      // Content Slides
      presentationData.slides.forEach((slide: any) => {
        const s = pres.addSlide();
        s.addText(slide.title, {
          x: 0.5, y: 0.5, w: '90%', h: 1,
          fontSize: 32, bold: true, color: '363636'
        });
        
        if (slide.content) {
          s.addText(slide.content, {
            x: 0.5, y: 1.5, w: '90%', h: 1,
            fontSize: 18, color: '666666'
          });
        }
        
        if (slide.bullets && Array.isArray(slide.bullets)) {
          const bulletText = slide.bullets.map((b: string) => ({ text: b, options: { bullet: true } }));
          s.addText(bulletText, {
            x: 0.5, y: slide.content ? 2.5 : 1.5, w: '90%', h: 3,
            fontSize: 20, color: '363636', bullet: true
          });
        }
      });

      await pres.writeFile({ fileName: `${presentationData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx` });
    } catch (error) {
      console.error('Error generating PPT:', error);
    } finally {
      setIsGeneratingPPT(false);
    }
  };

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

        {isPresentation && presentationData ? (
          <div className="bg-zinc-900/50 border border-teal-500/20 rounded-2xl p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
                  <Presentation size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{presentationData.title}</h3>
                  <p className="text-xs text-zinc-400 font-medium">{presentationData.slides.length} Slides</p>
                </div>
              </div>
              <button
                onClick={handleDownloadPPT}
                disabled={isGeneratingPPT}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-black font-bold text-sm rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPPT ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {isGeneratingPPT ? 'Generating...' : 'Download PPT'}
              </button>
            </div>
            
            <div className="grid gap-3 mt-6">
              {presentationData.slides.map((slide: any, idx: number) => (
                <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-xl">
                  <h4 className="text-sm font-bold text-teal-400 mb-2">Slide {idx + 1}: {slide.title}</h4>
                  {slide.content && <p className="text-xs text-zinc-300 mb-2">{slide.content}</p>}
                  {slide.bullets && slide.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                      {slide.bullets.map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <MarkdownRenderer content={message.content} />
          </div>
        )}

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
