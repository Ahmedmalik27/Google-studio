import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Code2, Search, Share2, Cpu, TrendingUp, ArrowUpRight, CheckCircle2, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { getProjects, Project as ProjectType } from '../services/projectService';
import { MOCK_PROJECTS } from '../constants';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectType[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchFeatured = async () => {
      try {
        const all = await getProjects();
        if (all.length > 0) {
          const hasIchiban = all.some(
            p => (p.title || '').toLowerCase().includes('ichiban') || 
                 (p.client || '').toLowerCase().includes('ichiban')
          );
          let finalProjects = [...all];
          if (!hasIchiban) {
            const ichibanMock = MOCK_PROJECTS.find(p => p.title === 'Ichiban Group');
            if (ichibanMock) {
              finalProjects = [ichibanMock as ProjectType, ...all];
            }
          }
          setFeaturedProjects(finalProjects.slice(0, 3));
        } else {
          setFeaturedProjects(MOCK_PROJECTS.slice(0, 3) as ProjectType[]);
        }
      } catch {
        setFeaturedProjects(MOCK_PROJECTS.slice(0, 3) as ProjectType[]);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    const particles: Sparkle[] = [];
    const particleCount = 100;

    class Sparkle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleDir: number;
      color: string;

      constructor() {
        this.x = (width / 2) + ((Math.random() - 0.5) * (width * 0.9));
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        this.color = Math.random() > 0.3 ? '0, 212, 255' : '255, 255, 255';
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity += this.twinkleSpeed * this.twinkleDir;
        if (this.opacity >= 1) { this.twinkleDir = -1; this.opacity = 1; }
        if (this.opacity <= 0.2) { this.twinkleDir = 1; this.opacity = 0.2; }
        if (this.y > height) {
          this.y = -10;
          this.x = (width / 2) + ((Math.random() - 0.5) * (width * 0.9));
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Sparkle());
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] md:h-screen flex flex-col items-center justify-center pt-20 md:pt-24">
        <div className="hero-spotlight" />
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-6xl px-6"
        >
          <div className="w-full max-w-[280px] md:max-w-[400px] mx-auto mb-0 animate-float">
            <img src="/logo.png" alt="Whales Solution Logo" className="w-full h-auto drop-shadow-[0_0_25px_rgba(0,212,255,0.5)]" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight md:leading-none -mt-4 md:-mt-8">
            Engineering the <span className="bg-gradient-to-r from-white to-neon-blue bg-clip-text text-transparent">Digital Deep.</span>
          </h1>
          <p className="text-base md:text-xl text-text-muted mb-8 md:mb-10 max-w-3xl mx-auto">
            We architect premium software, scale search visibility, and design enterprise-grade UI/UX for tomorrow&apos;s industry leaders.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-5 px-2">
            {['REACT.JS', 'NODE / PYTHON', 'FIGMA UI/UX', 'AWS CLOUD', 'DATA SEO'].map(tech => (
              <span key={tech} className="px-5 py-2 md:px-8 md:py-3.5 bg-white/5 border border-white/10 rounded-full text-[11px] md:text-sm font-space-grotesk tracking-[0.2em] text-text-muted hover:text-white hover:border-cyan-400/30 transition-all backdrop-blur-sm cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-6 md:px-[8%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-neon-blue uppercase tracking-widest text-xs md:text-sm font-space-grotesk mb-4 block">About Us</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">We don&apos;t just write code. We build ecosystems.</h2>
            <p className="text-text-muted text-base md:text-lg leading-relaxed mb-8 md:mb-10">
              Born from a necessity for better, cleaner, and faster technology, Whales Solution bridges the gap between raw data and breathtaking design. Our multi-disciplinary team brings Silicon Valley standards to every project we touch, ensuring your brand dominates the digital ocean.
            </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { label: 'Uptime Architecture', val: '99.9%' },
                { label: 'Performance Scaling', val: '10x' },
                { label: 'Technical Support', val: '24/7' },
                { label: 'Design Aesthetics', val: '#1' },
              ].map(stat => (
                <div key={stat.label} className="p-4 md:p-6 bg-bg-surface border border-white/5 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold text-neon-blue mb-1">{stat.val}</div>
                  <div className="text-text-muted text-[10px] md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="absolute inset-0 bg-neon-blue/20 blur-3xl rounded-full scale-75 group-hover:scale-90 transition-transform duration-700" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80" 
                alt="Cyber Security Data Abstract" 
                className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities / Services Section */}
      <section id="services" className="py-20 md:py-32 px-6 md:px-[8%] relative">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-neon-blue/5 blur-[100px] md:blur-[150px] -z-10" />
        <div className="max-w-4xl mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-neon-blue uppercase tracking-[0.3em] text-[10px] font-bold font-space-grotesk mb-4 md:mb-6 block"
          >
            Technical Infrastructure
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-8xl font-bold mb-6 md:mb-10 leading-tight md:leading-[0.9] tracking-tighter"
          >
            Our <span className="text-neon-blue">Technical</span> Arsenal.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-muted text-base md:text-xl max-w-2xl leading-relaxed"
          >
            We deploy a multi-layered technological framework designed to penetrate markets, capture audiences, and scale operations with zero friction.
          </motion.p>
        </div>

        <div className="space-y-12">
          {/* Featured Large Card: Software Development */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-bg-surface border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-neon-blue/40 transition-all duration-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                    <Code2 className="text-neon-blue" size={20} />
                  </div>
                  <span className="text-xs font-bold text-neon-blue uppercase tracking-widest">Engineering</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-6 group-hover:text-neon-blue transition-colors">Custom Software Development</h3>
                <p className="text-text-muted text-lg mb-10 leading-relaxed">
                  We build high-performance web and mobile applications. From intricate backend server architectures to seamless, fast frontend interfaces, our code is clean, scalable, and secure by default.
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {["Web Apps", "Mobile iOS/Android", "API Integration", "Enterprise Cloud"].map(tag => (
                    <span key={tag} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white/80 group-hover:border-neon-blue/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative h-[400px] lg:h-auto overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" 
                  alt="Software Engineering"
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-surface via-bg-surface/20 to-transparent" />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Search Engine Optimization",
                icon: <Search className="text-neon-blue" size={24} />,
                description: "Advanced technical SEO and content mapping. We optimize the underlying code, page speed, and structure so you dominate Google search results and capture high-intent traffic.",
                tags: ["Technical Audit", "Backlink Strategy", "Content Growth"],
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Social Media Management",
                icon: <Share2 className="text-neon-blue" size={24} />,
                description: "Algorithmic growth engineering. We design viral-ready campaigns, manage community interactions, and build massive digital brand authority across all major distribution nodes.",
                tags: ["Brand Ecosystem", "Viral Loops", "Community ROI"],
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "AI Integration & Agents",
                icon: <Cpu className="text-neon-blue" size={24} />,
                description: "Autonomous machine intelligence. We deploy custom LLM nodes and AI agents that automate complex business workflows, providing sub-second decision-making power.",
                tags: ["LLM Deployment", "Workflow Automation", "Smart Nodes"],
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Digital Marketing & Ads",
                icon: <TrendingUp className="text-neon-blue" size={24} />,
                description: "High-yield paid acquisition. We manage Google Ads and Meta campaigns with surgical precision, focusing on ROAS and predictive conversion modeling.",
                tags: ["PPC Strategy", "ROI Forecasting", "Scaling"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-bg-surface border border-white/5 rounded-[2rem] hover:border-neon-blue/30 transition-all duration-500 hover:bg-bg-surface/80 shadow-xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-neon-blue/10 group-hover:border-neon-blue/20 transition-all">
                    {item.icon}
                  </div>
                  <ArrowUpRight className="text-white/20 group-hover:text-neon-blue transition-colors" size={20} />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-space-grotesk group-hover:text-neon-blue transition-colors">{item.title}</h3>
                <p className="text-text-muted mb-8 leading-relaxed text-sm">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-neon-blue/60 uppercase tracking-widest">
                      // {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="py-20 md:py-24 px-6 md:px-[8%] overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8 text-white">
          <div className="max-w-2xl">
            <span className="text-neon-blue uppercase tracking-widest text-sm font-space-grotesk mb-4 block">Strategic Deployments</span>
            <h2 className="text-3xl md:text-6xl font-bold leading-tight tracking-tighter">Featured <span className="text-neon-blue">Digital Architectures.</span></h2>
          </div>
          <Link to="/projects" className="group flex items-center gap-4 px-6 py-3 md:px-8 md:py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-neon-blue/10 hover:border-neon-blue/30 transition-all font-bold uppercase tracking-widest text-[10px] md:text-xs">
            View All Projects
            <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 transition-all group-hover:bg-neon-blue hidden sm:block" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projectsLoading ? (
            <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-neon-blue" size={32} /></div>
          ) : featuredProjects.map((project, i) => (
            <Link key={i} to="/projects" className="group relative aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                <span className="text-neon-blue text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 block">{project.category}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-neon-blue transition-colors">{project.title}</h3>
                <p className="text-white/50 text-[10px] md:text-xs font-mono mt-1 md:mt-2">{'client' in project ? project.client : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-24 px-6 md:px-[8%] scroll-mt-24">
        <div className="bg-bg-surface border border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          <div>
            <span className="text-neon-blue uppercase tracking-widest text-xs md:text-sm font-space-grotesk mb-4 block">Initialize</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Let&apos;s build the future.</h2>
            <div className="space-y-4 text-text-muted text-sm md:text-base">
              <p className="flex items-center gap-2 flex-wrap">
                <strong>Email:</strong> 
                <a href="mailto:teamwhalessolution@gmail.com" className="text-white hover:text-neon-blue transition-colors">
                  teamwhalessolution@gmail.com
                </a>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <strong>Contact:</strong>
                <a 
                  href="https://wa.me/447438373644?text=Hi,%20I'm%20interested%20in%20architecting%20a%20project%20with%20Whales%20Solution!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:text-[#25D366] transition-all duration-300 group"
                >
                  <span className="underline decoration-white/20 group-hover:decoration-[#25D366]/40 transition-colors font-mono font-medium">+44 7438 373644</span>
                  <svg 
                    className="w-5 h-5 text-[#25D366] fill-current animate-pulse group-hover:scale-125 transition-transform duration-300 shrink-0" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.432.002 9.851-4.381 9.854-9.76a9.71 9.71 0 0 0-2.879-6.902 9.728 9.728 0 0 0-6.915-2.87C4.85.075.433 4.458.43 9.837a9.719 9.719 0 0 0 1.411 4.966L.892 19.98l5.22-.136l.535-.69zM16.92 14.1c-.267-.134-1.584-.782-1.83-.872-.247-.09-.427-.134-.607.134-.18.267-.696.872-.853 1.05-.157.18-.314.202-.58.069-.267-.134-1.13-.417-2.152-1.331-.795-.71-1.332-1.586-1.488-1.853-.157-.267-.017-.411.117-.544.12-.12.267-.314.401-.471.134-.157.18-.269.269-.449.09-.18.045-.337-.022-.471-.067-.134-.607-1.46-.83-2.002-.218-.524-.457-.453-.624-.461a12.164 12.164 0 0 0-.53-.007c-.18 0-.472.067-.719.337-.247.269-.944.923-.944 2.25s.965 2.607 1.1 2.787c.134.18 1.9 2.902 4.604 4.068.643.277 1.144.443 1.534.567.646.205 1.233.176 1.697.108.517-.076 1.584-.648 1.808-1.243.224-.596.224-1.106.157-1.213-.067-.107-.247-.152-.513-.285z" />
                  </svg>
                </a>
              </div>
              <p><strong>Location:</strong> Fully Remote / Global</p>
            </div>
          </div>
          
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);
    
    try {
      // Direct submission to Web3Forms to resolve domain restriction issues
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "b2971b41-c5b6-4480-b327-1c765d944659",
          ...formData,
          from_name: "Whales Solution Website",
          subject: `New Inquiry from ${formData.Name}`
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setStatus('success');
        setFormData({
          Name: '',
          Email: '',
          Message: ''
        });
      } else {
        console.error("Submission Error:", result);
        setStatus('error');
        setErrorMessage(result.message || "Transmission rejected by the provider. Please use manual failover.");
      }
    } catch (err) {
      console.error("Submission Exception:", err);
      setStatus('error');
      setErrorMessage("SIGNAL_LOST: The transmission was interrupted. Please use the Direct Email button.");
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage(null);
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 bg-neon-blue/5 border border-neon-blue/20 rounded-2xl text-center h-full min-h-[450px]"
      >
        <div className="w-20 h-20 bg-neon-blue rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,212,255,0.4)]">
          <CheckCircle2 className="text-bg-base" size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-4">Message Received</h3>
        <p className="text-text-muted max-w-sm mx-auto leading-relaxed text-sm">
          Thank you for reaching out. A member of our team will review your inquiry and respond within 24 hours.
        </p>
        <button 
          onClick={handleReset}
          className="mt-10 px-8 py-3 bg-neon-blue text-bg-base font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all shadow-lg shadow-neon-blue/20"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="group relative">
          <input 
            type="text" 
            name="Name" 
            value={formData.Name}
            onChange={handleChange}
            placeholder="Full Name" 
            required 
            disabled={status === 'submitting'}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-neon-blue/40 transition-all disabled:opacity-50" 
          />
        </div>
        <div className="group relative">
          <input 
            type="email" 
            name="Email" 
            value={formData.Email}
            onChange={handleChange}
            placeholder="Email Address" 
            required 
            disabled={status === 'submitting'}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-neon-blue/40 transition-all disabled:opacity-50" 
          />
        </div>
        <div className="group relative">
          <textarea 
            name="Message" 
            value={formData.Message}
            onChange={handleChange}
            placeholder="How can we help you?" 
            required 
            rows={5} 
            disabled={status === 'submitting'}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-neon-blue/40 transition-all resize-none disabled:opacity-50" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full py-4 bg-neon-blue text-bg-base font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all shadow-lg shadow-neon-blue/20 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl space-y-4"
          >
            <div className="flex gap-4">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Transmission Fault</p>
                <p className="text-white/80 text-[11px] leading-relaxed font-mono">
                  {errorMessage || "Transmission error. Gateway unreachable."}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <a 
                href={`mailto:teamwhalessolution@gmail.com?subject=Whales Inquiry&body=Hi Whales Team, I'd like to discuss a project...`}
                className="w-full py-3 bg-white text-bg-base rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-neon-blue transition-all flex items-center justify-center gap-2"
              >
                <Mail size={12} /> Send Direct Email (Failover)
              </a>
              <button
                onClick={handleReset}
                className="w-full py-2 text-white/40 text-[9px] uppercase tracking-[0.2em] hover:text-white transition-colors"
              >
                Clear Configuration cache
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 text-[9px] text-white/10 uppercase tracking-[0.3em] font-mono">
        <span className="w-8 h-[1px] bg-white/5" />
        SECURE_PIPELINE: PROXY_ALPHA_v2
        <span className="w-8 h-[1px] bg-white/5" />
      </div>
    </div>
  );
}
