import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { MessageItem } from './components/MessageItem';
import { Message, Attachment, AssistantCategory } from './types';
import { geminiService } from './services/geminiService';
import { Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="flex h-screen bg-zinc-50">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        onNewChat={handleNewChat}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-900 capitalize">
                {activeCategory.replace('-', ' ')} Mode
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium">Powered by Gemini 3.1 Pro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <span className="text-[10px] text-zinc-400 font-medium ml-2">3 Experts Online</span>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-teal-500/20 mb-8"
              >
                <Bot size={40} />
              </motion.div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight"
              >
                How can I assist you today?
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-500 mb-12"
              >
                I am Ashreya AI, your next-generation assistant for complex research, coding, business strategy, and creative problem-solving.
              </motion.p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  { title: "ML Engineer", desc: "Train, optimize, and deploy machine learning models.", icon: "🧠" },
                  { title: "Data Scientist", desc: "Analyze datasets and perform feature engineering.", icon: "📊" },
                  { title: "Research Analyst", desc: "Find the latest SOTA papers and ML research.", icon: "🔬" },
                  { title: "MLOps Architect", desc: "Design automated training and deployment pipelines.", icon: "⚙️" }
                ].map((item, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={() => handleSend(`Can you help me as a ${item.title}?`, [])}
                    className="p-4 bg-white border border-zinc-200 rounded-2xl text-left hover:border-teal-500 hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-teal-600 transition-colors">{item.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageItem message={msg} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>
    </div>
  );
}
