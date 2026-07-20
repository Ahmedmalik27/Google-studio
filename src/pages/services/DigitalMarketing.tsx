import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Megaphone, Users, MessageSquare, PieChart, Sparkles, Share2 } from 'lucide-react';

const DigitalMarketingPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8%] min-h-screen bg-bg-base">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full mb-6">
            <Megaphone className="w-4 h-4 text-neon-blue" />
            <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">Digital Marketing</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-space-grotesk leading-tight mb-8">
            Strategic Growth in a <span className="text-neon-blue">Digital Ecosystem</span>
          </h1>
          
          <p className="text-xl text-text-muted leading-relaxed mb-12">
            Whales specializes in high-velocity digital marketing for enterprise brands. We combine creative storytelling with rigorous data analysis to amplify your message across every touchpoint.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <Users className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Audience Intelligence</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                We deep-dive into your customer personas to understand exactly where they live, what they want, and how they interact with your brand.
              </p>
            </div>
            
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <Share2 className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Omni-Channel Content</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                From social media dominance to high-authority thought leadership, we ensure your message is consistent and impactful across all channels.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <PieChart className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Conversion Rate Optimization</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Traffic is meaningless without action. We obsess over user behavior to turn every click into a meaningful conversion.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <MessageSquare className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Reputation Management</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Protect your brand's integrity. We proactively monitor and manage your digital footprint to ensure your reputation stays pristine.
              </p>
            </div>
          </div>

          <div className="relative p-10 bg-white/5 border border-white/10 rounded-3xl overflow-hidden group">
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-neon-blue mb-6" />
              <h2 className="text-3xl font-bold mb-4">Ready to amplify your brand?</h2>
              <p className="text-text-muted mb-8 max-w-xl">
                Let's develop a marketing architecture that doesn't just reach people—it moves them. Reach out today for a consultation.
              </p>
              <Link to="/#contact" className="inline-block px-8 py-4 bg-neon-blue text-bg-base rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                Connect with an Expert
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
          </div>
        </motion.div>
      </div>
  );
};

export default DigitalMarketingPage;
