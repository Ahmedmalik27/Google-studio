import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, MousePointer2, TrendingUp, BarChart3, ShieldCheck, DollarSign } from 'lucide-react';

const GoogleAdsPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8%] min-h-screen bg-bg-base text-white">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full mb-6 text-neon-blue uppercase text-[10px] font-bold tracking-widest">
            <Target className="w-3 h-3" />
            Performance Tracking — Active
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-space-grotesk leading-tight mb-8">
            High-Yield <span className="text-neon-blue uppercase">Google Ads</span> Management
          </h1>
          
          <p className="text-lg text-text-muted leading-relaxed mb-12 max-w-2xl">
            Whales transforms your advertising budget into a surgical instrument for growth. We specialize in high-intent lead generation and enterprise ecommerce scaling.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                <MousePointer2 className="w-8 h-8 text-neon-blue mb-6" />
                <h3 className="text-xl font-bold mb-3">Precision Keywords</h3>
                <p className="text-sm text-text-muted">We go beyond broad volume. We target high-value, long-tail intent that actually connects with C-suite decision makers.</p>
             </div>
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-neon-blue mb-6" />
                <h3 className="text-xl font-bold mb-3">Aggressive ROI Scaling</h3>
                <p className="text-sm text-text-muted">Stop wasting spend. Our constant A/B testing and bid optimization ensure you win the auctions that matter.</p>
             </div>
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                <BarChart3 className="w-8 h-8 text-neon-blue mb-6" />
                <h3 className="text-xl font-bold mb-3">Transparent Analytics</h3>
                <p className="text-sm text-text-muted">Real-time dashboards that show exactly where your money is going and what it's bringing back. No jargon, just results.</p>
             </div>
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                <ShieldCheck className="w-8 h-8 text-neon-blue mb-6" />
                <h3 className="text-xl font-bold mb-3">Anti-Fraud Protection</h3>
                <p className="text-sm text-text-muted">We use advanced filtering to block bot traffic and invalid clicks, ensuring your budget reaches real humans.</p>
             </div>
          </div>

          <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                   <DollarSign className="text-neon-blue" />
                   <h3 className="text-2xl font-bold">Maximize your ROAS</h3>
                </div>
                <p className="text-text-muted mb-6">Our average client sees a 30% increase in lead quality within the first 60 days of Whales management.</p>
                <div className="flex gap-4">
                   <div className="px-4 py-2 bg-neon-blue/20 rounded-lg text-xs font-bold border border-neon-blue/20">SEARCH ADS</div>
                   <div className="px-4 py-2 bg-neon-blue/20 rounded-lg text-xs font-bold border border-neon-blue/20">DISPLAY</div>
                   <div className="px-4 py-2 bg-neon-blue/20 rounded-lg text-xs font-bold border border-neon-blue/20">REMARKETING</div>
                </div>
             </div>
             <Link to="/#contact" className="inline-block bg-neon-blue text-bg-base px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all shrink-0">
                Audit My Ad Account
             </Link>
          </div>
        </motion.div>
      </div>
  );
};

export default GoogleAdsPage;
