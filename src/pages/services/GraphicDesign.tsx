import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Palette, PenTool, Layers, Box, Monitor } from 'lucide-react';

const GraphicDesignPage = () => {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8%] min-h-screen bg-bg-base text-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full mb-6">
              <Palette className="w-4 h-4 text-neon-blue" />
              <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">Graphic Design & Branding</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black font-space-grotesk tracking-tighter mb-8 leading-[0.9]">
              VISUAL <span className="text-neon-blue">GRAVITY</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              In a world of noise, we create silence. Whales delivers high-impact visual systems that define industry leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
             <div className="group relative aspect-[4/5] bg-white/5 overflow-hidden rounded-3xl border border-white/10 hover:border-neon-blue/50 transition-all p-12 flex flex-col justify-end">
                <Box className="absolute top-12 left-12 w-16 h-16 text-neon-blue opacity-20 group-hover:opacity-100 transition-all group-hover:rotate-12" />
                <h3 className="text-2xl font-bold mb-2">3D Modeling</h3>
                <p className="text-sm text-text-muted">High-fidelity spatial design for modern enterprise interfaces.</p>
             </div>
             
             <div className="group relative aspect-[4/5] bg-neon-blue overflow-hidden rounded-3xl p-12 flex flex-col justify-end">
                <PenTool className="absolute top-12 left-12 w-16 h-16 text-bg-base opacity-20 group-hover:opacity-100 transition-all" />
                <h3 className="text-2xl font-bold mb-2 text-bg-base">Identity Design</h3>
                <p className="text-sm text-bg-base/70">Building brands that command respect and inspire authority.</p>
             </div>

             <div className="group relative aspect-[4/5] bg-white/5 overflow-hidden rounded-3xl border border-white/10 hover:border-neon-blue/50 transition-all p-12 flex flex-col justify-end">
                <Layers className="absolute top-12 left-12 w-16 h-16 text-neon-blue opacity-20 group-hover:opacity-100 transition-all" />
                <h3 className="text-2xl font-bold mb-2">UI/UX Systems</h3>
                <p className="text-sm text-text-muted">Consistent, scalable design libraries for complex applications.</p>
             </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-20">
             <div>
                <h2 className="text-3xl font-bold mb-8 font-space-grotesk">Our Aesthetic Philosophy</h2>
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                         <span className="text-neon-blue font-mono">01</span>
                      </div>
                      <div>
                         <h4 className="font-bold mb-2">Brutalist Precision</h4>
                         <p className="text-sm text-text-muted">We value structure and clarity over unnecessary decoration. Every line has a purpose.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                         <span className="text-neon-blue font-mono">02</span>
                      </div>
                      <div>
                         <h4 className="font-bold mb-2">Futuristic Minimalism</h4>
                         <p className="text-sm text-text-muted">Designing for 2030, available today. We use space and contrast to create depth.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                         <span className="text-neon-blue font-mono">03</span>
                      </div>
                      <div>
                         <h4 className="font-bold mb-2">Emotional Impact</h4>
                         <p className="text-sm text-text-muted">Design is a biological hack. We trigger the right responses through color and balance.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative">
                <div className="absolute inset-0 bg-neon-blue/20 blur-[120px] rounded-full" />
                <div className="relative aspect-square border border-white/10 rounded-full flex items-center justify-center p-20 animate-spin-slow">
                   <div className="w-full h-full border border-neon-blue/30 rounded-full border-dashed" />
                   <Monitor className="absolute text-neon-blue w-20 h-20 drop-shadow-[0_0_20px_rgba(0,212,255,0.8)]" />
                </div>
             </div>
          </div>

          <div className="mt-32 p-12 bg-gradient-to-r from-bg-base to-white/5 border border-white/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
             <div>
                <h3 className="text-2xl font-bold mb-2">Elevate your Visual Language</h3>
                <p className="text-text-muted">Stop blending in. Let's create something extraordinary.</p>
             </div>
              <Link to="/#contact" className="inline-block whitespace-nowrap px-8 py-4 bg-neon-blue text-bg-base font-bold rounded-xl hover:scale-105 transition-all text-center">
                 View Design Folio
              </Link>
          </div>
        </motion.div>
      </div>
  );
};

export default GraphicDesignPage;
