import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Cpu, Zap, MessageSquare, BrainCircuit } from 'lucide-react';

const AIAgentsPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8%] min-h-screen bg-bg-base text-white">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full mb-6">
                  <Bot className="w-4 h-4 text-neon-blue" />
                  <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">AI & Automation Units</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-space-grotesk leading-tight mb-8">
                  Autonomous <span className="text-neon-blue italic">Agents</span> for the Modern Enterprise
                </h1>
                <p className="text-xl text-text-muted leading-relaxed">
                  Whales builds specialized AI Agents that don't just chat—they work. Automate complex workflows, unify data silos, and scale your operations with machine intelligence.
                </p>
             </div>
             <div className="relative group">
                <div className="absolute inset-0 bg-neon-blue/40 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative aspect-square bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-3xl p-12 overflow-hidden">
                   <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
                      {Array.from({length: 36}).map((_, i) => (
                         <div key={i} className="border-[0.5px] border-white/50" />
                      ))}
                   </div>
                   <BrainCircuit className="w-full h-full text-neon-blue drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
                </div>
             </div>
          </div>

          <div className="space-y-6 mb-32">
             <h2 className="text-3xl font-bold font-space-grotesk text-center mb-12">Intelligence Architecture</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                   <MessageSquare className="w-8 h-8 text-neon-blue mb-4" />
                   <h3 className="text-xl font-bold mb-2">Customer Service Nodes</h3>
                   <p className="text-sm text-text-muted">Multi-turn, context-aware agents that handle complex customer inquiries across multiple platforms in real-time.</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                   <Database className="w-8 h-8 text-neon-blue mb-4" />
                   <h3 className="text-xl font-bold mb-2">Data Intelligence Agents</h3>
                   <p className="text-sm text-text-muted">Agents that monitor your internal data, identifying patterns and generating executive summaries for decision makers.</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                   <Zap className="w-8 h-8 text-neon-blue mb-4" />
                   <h3 className="text-xl font-bold mb-2">Workflow Accelerators</h3>
                   <p className="text-sm text-text-muted">Deep integration into your existing tech stack (Slack, CRM, Jira) to automate repetitive administrative tasks autonomously.</p>
                </div>
             </div>
          </div>

          <div className="relative p-12 bg-white text-bg-base rounded-[40px] overflow-hidden">
             <div className="relative z-10">
                <Sparkles className="w-12 h-12 mb-6" />
                <h2 className="text-4xl font-bold mb-6 font-space-grotesk max-w-xl">The Intelligence Revolution won't be televised. It will be Automated.</h2>
                <div className="flex flex-wrap gap-4">
                   <Link to="/#contact" className="inline-block px-8 py-4 bg-bg-base text-white rounded-xl font-bold hover:bg-neon-blue transition-all text-center">
                      Deploy Your First Agent
                   </Link>
                   <Link to="/#contact" className="inline-block px-8 py-4 bg-transparent border-2 border-bg-base text-bg-base rounded-xl font-bold hover:bg-bg-base hover:text-white transition-all text-center">
                      View Demo
                   </Link>
                </div>
             </div>
             <Cpu className="absolute -bottom-20 -right-20 w-80 h-80 text-bg-base/5 -rotate-12" />
          </div>
        </motion.div>
      </div>
  );
};

const Database = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
    <path d="M3 12A9 3 0 0 0 21 12"/>
  </svg>
)

export default AIAgentsPage;
