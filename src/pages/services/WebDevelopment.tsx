import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Code, Server, Smartphone, Layout as LayoutIcon, Cpu, Database } from 'lucide-react';

const WebDevelopmentPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8%] min-h-screen bg-bg-base text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full mb-6">
                <Code className="w-4 h-4 text-neon-blue" />
                <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">Web Development</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-space-grotesk leading-tight mb-8">
                Engineering <span className="text-neon-blue">Digital Monoliths</span>
              </h1>
              <p className="text-xl text-text-muted leading-relaxed">
                We build high-scale, performance-first web applications for the enterprise. No templates. No shortcuts. Just pure, scalable engineering.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-all cursor-default">
                <Server className="w-8 h-8 text-neon-blue mb-3" />
                <span className="text-xs font-bold uppercase tracking-tighter">Backend Architecture</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-all cursor-default mt-8">
                <LayoutIcon className="w-8 h-8 text-neon-blue mb-3" />
                <span className="text-xs font-bold uppercase tracking-tighter">Fluid UX Design</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-all cursor-default -mt-8">
                <Smartphone className="w-8 h-8 text-neon-blue mb-3" />
                <span className="text-xs font-bold uppercase tracking-tighter">Mobile Optimization</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-all cursor-default">
                <Cpu className="w-8 h-8 text-neon-blue mb-3" />
                <span className="text-xs font-bold uppercase tracking-tighter">Edge Computing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4 font-space-grotesk underline decoration-neon-blue underline-offset-8">Performance</h3>
              <p className="text-text-muted leading-relaxed">
                Every millisecond matters. We optimize for Core Web Vitals to ensure your site is blazing fast, providing an elite experience for your users and a boost to your SEO.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4 font-space-grotesk underline decoration-neon-blue underline-offset-8">Scalability</h3>
              <p className="text-text-muted leading-relaxed">
                Our architectures are built to handle sudden traffic spikes without breaking. We use serverless and microservices patterns to keep you online 24/7.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4 font-space-grotesk underline decoration-neon-blue underline-offset-8">Security</h3>
              <p className="text-text-muted leading-relaxed">
                Enterprise-grade security is baked in from the first line of code. We protect your data and your users with modern encryption and secure Auth patterns.
              </p>
            </div>
          </div>

          <div className="p-1 gap-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
             {[
               { title: "React/Next.js", icon: <Code /> },
               { title: "Cloud Native", icon: <Database /> },
               { title: "API First", icon: <Cpu /> },
               { title: "Custom CMS", icon: <LayoutIcon /> }
             ].map((tech, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/2 rounded-xl border border-white/5">
                  <div className="text-neon-blue opacity-50">{tech.icon}</div>
                  <span className="text-sm font-medium">{tech.title}</span>
                </div>
             ))}
          </div>

          <div className="mt-32 text-center">
             <h2 className="text-4xl font-bold mb-6">Build your future. <span className="text-neon-blue italic">Properly.</span></h2>
             <Link to="/#contact" className="inline-block px-10 py-5 bg-white text-bg-base font-bold rounded-full hover:bg-neon-blue transition-all">
                Initiate Project Protocol
             </Link>
          </div>
        </motion.div>
      </div>
  );
};

export default WebDevelopmentPage;
