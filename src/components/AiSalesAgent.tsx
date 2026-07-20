import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle } from 'lucide-react';
import { getAiResponse } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const WHATSAPP_NUMBER = "447438373644";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi,%20I'm%20interested%20in%20architecting%20a%20project%20with%20Whales%20Solution!`;

export default function AiSalesAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to Whales Solution. I'm your digital strategist. Ready to architect your dominance? What project do you have in mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isRequestInProgress = useRef(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasCheckedConfig = useRef(false);

  useEffect(() => {
    // Check AI configuration on mount
    if (hasCheckedConfig.current) return;
    hasCheckedConfig.current = true;

    const checkConfig = async () => {
      try {
        const res = await fetch("/api/ai/config-check");
        const data = await res.json();
        if (!data.hasKey) {
          setConfigError("Whale AI is not configured. Please add GEMINI_API_KEY to your environment variables.");
        }
      } catch (err) {
        console.error("Config check failed:", err);
      }
    };
    checkConfig();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isRequestInProgress.current) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    isRequestInProgress.current = true;

    try {
      const historyForAI = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const reply = await getAiResponse([
        ...historyForAI,
        { role: 'user', text: userMessage }
      ]);

      setMessages(prev => [...prev, { role: 'model', text: reply || "I'm analyzing your requirements. Let's discuss this in detail via WhatsApp for a precise strategic roadmap." }]);
    } catch (error: unknown) {
      console.error("AI Agent Error:", error);
      const err = error as { message?: string };
      let errorMessage = "Our neural nodes are currently high-capacity. Let's bypass the tech and talk directly on WhatsApp.";
      
      const rawMessage = err.message || (typeof err === 'string' ? err : "");
      const errorStr = (rawMessage + " " + JSON.stringify(err)).toUpperCase();

      if (errorStr.includes("NOT CONFIGURED") || errorStr.includes("CONFIG-CHECK")) {
        errorMessage = "Whale AI is not configured on this server. Please ensure GEMINI_API_KEY is set in your hosting environment Settings.";
      } else if (errorStr.includes("QUOTA EXCEEDED") || errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED")) {
        errorMessage = "Whale AI (Gemini) has reached its current performance threshold. Please try again in 60 seconds or reach out via WhatsApp.";
      } else if (errorStr.includes("NOT_FOUND") || errorStr.includes("404")) {
        errorMessage = "Neural node synchronization error (Model not found). Our architects are recalibrating.";
      } else if (errorStr.includes("OVERLOADED") || errorStr.includes("503") || errorStr.includes("BUSY")) {
        errorMessage = "The AI neural nodes are temporarily overloaded with high-frequency requests. Please try again in a moment.";
      } else if (rawMessage) {
        errorMessage = `Notice: ${rawMessage}. For immediate assistance, use the WhatsApp channel below.`;
      }
      
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
      isRequestInProgress.current = false;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-inter">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-bg-surface border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-neon-blue/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center relative overflow-hidden group/icon">
                  <motion.span 
                    animate={{
                      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 font-bold italic text-xl text-white drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                  >
                    i
                  </motion.span>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
                      animate={{
                        x: [0, Math.cos(i * 90 * Math.PI / 180) * 12, 0],
                        y: [0, Math.sin(i * 90 * Math.PI / 180) * 12, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    />
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Whales Intelligence</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Sales Agent Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-4 scroll-smooth custom-scrollbar"
            >
              {configError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
                  {configError}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-neon-blue text-bg-base font-medium ml-4' 
                      : 'bg-white/5 border border-white/10 text-white/90 mr-4'
                  }`}>
                    <div className="prose prose-invert prose-sm">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-1">
                      <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" />
                   </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 pb-2">
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-neon-blue/10 border border-neon-blue/30 rounded-xl text-neon-blue text-xs font-bold uppercase tracking-widest hover:bg-neon-blue hover:text-bg-base transition-all"
              >
                <MessageCircle size={14} />
                Instantly Connect via WhatsApp
              </a>
            </div>

            {/* Input */}
            <div className="p-6 pt-2">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our architecture..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pr-12 text-sm text-white outline-none focus:border-neon-blue/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-bg-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-3 text-center uppercase tracking-tighter">
                Powered by Whales Autonomous Intelligence Node
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group relative ${
          isOpen ? 'bg-bg-surface rotate-90 border border-white/20' : 'bg-transparent hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
             {/* Core Glow Aura */}
             <motion.div
               className="absolute inset-0 bg-neon-blue/20 blur-2xl rounded-full"
               animate={{
                 scale: [1, 1.4, 1],
                 opacity: [0.5, 0.8, 0.5]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             />
             
             {/* Spinning Rainbow Ring (Subtle) */}
             <motion.div
               className="absolute inset-[-4px] rounded-full border border-transparent bg-gradient-to-r from-red-500 via-neon-blue to-purple-500 opacity-30 blur-[2px]"
               style={{ maskImage: 'linear-gradient(white, white)', WebkitMaskImage: 'linear-gradient(white, white)', padding: '1px' }}
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             />

             <motion.span 
              animate={{
                filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 font-bold italic text-5xl text-white drop-shadow-[0_0_15px_rgba(0,212,255,0.8)]"
             >
               i
             </motion.span>

             {/* Orbiting Tech Dots */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"
                  animate={{
                    x: [
                      Math.cos(i * 45 * Math.PI / 180) * 32,
                      Math.cos((i * 45 + 180) * Math.PI / 180) * 32,
                      Math.cos(i * 45 * Math.PI / 180) * 32
                    ],
                    y: [
                      Math.sin(i * 45 * Math.PI / 180) * 32,
                      Math.sin((i * 45 + 180) * Math.PI / 180) * 32,
                      Math.sin(i * 45 * Math.PI / 180) * 32
                    ],
                    opacity: [0.2, 1, 0.2],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "linear"
                  }}
                />
             ))}
             <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-base z-20" />
          </div>
        )}
      </button>
    </div>
  );
}
