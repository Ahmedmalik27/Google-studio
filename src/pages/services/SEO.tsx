import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, BarChart, Globe, Zap, Target } from 'lucide-react';

const SEOPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8%] min-h-screen bg-bg-base">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full mb-6">
            <Search className="w-4 h-4 text-neon-blue" />
            <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest text-shadow-[0_0_10px_rgba(0,212,255,0.5)]">Search Engine Optimization</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-space-grotesk leading-tight mb-8">
            Dominate the <span className="text-neon-blue">Digital Archipelago</span> with Precision SEO
          </h1>
          
          <p className="text-xl text-text-muted leading-relaxed mb-12">
            At Whales, we don't just optimize for algorithms; we optimize for authority. Our SEO strategies are designed to elevate your enterprise from the depths of Page 2 to the absolute pinnacle of search visibility.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <TrendingUp className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Authority Link Building</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                We secure high-quality, relevant backlinks from industry leaders, reinforcing your site's credibility in the eyes of search engines.
              </p>
            </div>
            
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <BarChart className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Data-Driven Strategy</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Eliminate guesswork. We use advanced analytics and competitive intelligence to target the keywords that actually drive conversion.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <Zap className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Technical Excellence</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Core Web Vitals, schema markup, and high-scale architecture—we ensure your foundation is built for speed and crawlability.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/50 transition-all group">
              <Globe className="w-10 h-10 text-neon-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">International Scale</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Expanding globally? We manage complex hreflang implementations and localized content strategies to conquer new markets.
              </p>
            </div>
          </div>

          <div className="relative p-10 bg-neon-blue rounded-3xl overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-bg-base mb-4">Ready to reach the surface?</h2>
              <p className="text-bg-base/80 mb-8 max-w-xl">
                Our SEO audits reveal the hidden obstacles blocking your growth. Let's build a roadmap to the first page.
              </p>
              <Link to="/#contact" className="inline-block px-8 py-4 bg-bg-base text-white rounded-xl font-bold hover:scale-105 transition-all shadow-xl">
                Get Your Free SEO Audit
              </Link>
            </div>
            <Target className="absolute -bottom-10 -right-10 w-64 h-64 text-bg-base/10 rotate-12" />
          </div>
        </motion.div>
      </div>
  );
};

export default SEOPage;
