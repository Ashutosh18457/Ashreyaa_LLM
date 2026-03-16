import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { MessageItem } from './components/MessageItem';
import { Message, Attachment, AssistantCategory } from './types';
import { geminiService } from './services/geminiService';
import { Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeCategory, setActiveCategory] = useState<AssistantCategory>('general');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string, attachments: Attachment[]) => {
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMessageId = Math.random().toString(36).substring(7);
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      let fullContent = '';
      let groundingMetadata = undefined;

      const stream = geminiService.chatStream(newMessages, activeCategory);
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullContent += chunk.text;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullContent } 
              : msg
          ));
        }
        
        if (chunk.candidates?.[0]?.groundingMetadata) {
          groundingMetadata = chunk.candidates[0].groundingMetadata;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, groundingMetadata } 
              : msg
          ));
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'I encountered an error. Please try again.' } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-black text-zinc-100 selection:bg-teal-500/30">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        onNewChat={handleNewChat}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 shadow-lg shadow-teal-500/5">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-base font-black text-white capitalize tracking-tight flex items-center gap-2">
                {activeCategory.replace('-', ' ')}
                <span className="px-1.5 py-0.5 bg-zinc-800 text-[10px] rounded text-zinc-500 uppercase font-bold tracking-widest">Active</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em]">Neural Engine v3.1 Flash</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-white/5">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-zinc-800 overflow-hidden shadow-xl">
                    <img src={`https://picsum.photos/seed/user${i}/64/64`} alt="user" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col ml-1">
                <span className="text-[10px] text-white font-bold leading-none">3 Active Nodes</span>
                <span className="text-[8px] text-teal-500 font-bold uppercase tracking-tighter">Synchronized</span>
              </div>
            </div>
            
            <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white border border-transparent hover:border-white/10">
              <Bot size={20} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative z-10"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-[2.5rem] flex items-center justify-center text-black shadow-2xl shadow-teal-500/30 mb-10 relative group"
              >
                <Bot size={48} />
                <div className="absolute inset-0 rounded-[2.5rem] bg-teal-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none">
                  Ashreya <span className="text-teal-500">Intelligence</span>
                </h2>
                <p className="text-zinc-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
                  Your high-performance neural partner for machine learning, satellite data analysis, and complex problem solving.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-16">
                {[
                  { title: "ML Engineer", desc: "Train, optimize, and deploy models.", icon: "🧠", color: "from-teal-500/20" },
                  { title: "Data Scientist", desc: "Analyze datasets & feature engineering.", icon: "📊", color: "from-blue-500/20" },
                  { title: "Research Analyst", desc: "Latest SOTA papers and research.", icon: "🔬", color: "from-purple-500/20" },
                  { title: "MLOps Architect", desc: "Automated training pipelines.", icon: "⚙️", color: "from-emerald-500/20" }
                ].map((item, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={() => handleSend(`Can you help me as a ${item.title}?`, [])}
                    className={cn(
                      "p-6 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl text-left hover:border-teal-500/50 hover:bg-zinc-900/60 transition-all group relative overflow-hidden",
                      "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 hover:before:opacity-100 before:transition-opacity",
                      item.color
                    )}
                  >
                    <div className="relative z-10">
                      <span className="text-3xl mb-4 block filter drop-shadow-lg">{item.icon}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors tracking-tight">{item.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1.5 font-medium leading-snug">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto py-8">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <MessageItem message={msg} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="relative z-20">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
