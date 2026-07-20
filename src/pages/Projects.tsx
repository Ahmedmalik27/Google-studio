import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjects, Project as ProjectType } from '../services/projectService';
import { MOCK_PROJECTS } from '../constants';

export default function Projects() {
  const [projectsList, setProjectsList] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProjects = async () => {
      try {
        const firestoreProjects = await getProjects();
        if (firestoreProjects.length > 0) {
          const hasIchiban = firestoreProjects.some(
            p => (p.title || '').toLowerCase().includes('ichiban') || 
                 (p.client || '').toLowerCase().includes('ichiban')
          );
          if (!hasIchiban) {
            const ichibanMock = MOCK_PROJECTS.find(p => p.title === 'Ichiban Group');
            if (ichibanMock) {
              setProjectsList([ichibanMock as ProjectType, ...firestoreProjects]);
            } else {
              setProjectsList(firestoreProjects);
            }
          } else {
            setProjectsList(firestoreProjects);
          }
        } else {
          // If no projects in firestore, use mock data as default
          setProjectsList(MOCK_PROJECTS as ProjectType[]);
        }
      } catch (error) {
        console.error('Failed to sync with neural core. Falling back to cached assets.', error);
        setProjectsList(MOCK_PROJECTS as ProjectType[]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <Loader2 className="animate-spin text-neon-blue" size={40} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 md:px-[8%]">
      <div className="max-w-4xl mb-16">
        <span className="text-neon-blue uppercase tracking-widest text-sm font-space-grotesk mb-4 block">Intelligence Archive</span>
        <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight md:leading-[0.9] tracking-tighter">
          High-yield <span className="text-neon-blue">Digital Assets</span> engineered for Dominance.
        </h1>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl leading-relaxed">
          We don&apos;t just build websites; we deploy strategic weapon-grade digital infrastructure that redefines market standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projectsList.map((project, index) => (
          <motion.div 
            key={project.id || project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative flex flex-col bg-bg-surface border border-white/5 rounded-3xl overflow-hidden hover:border-neon-blue/40 transition-all shadow-2xl hover:bg-bg-surface/80"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-transparent to-transparent opacity-60" />
              
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 bg-bg-base/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-neon-blue">
                   {project.category}
                </span>
              </div>
            </div>

            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1 group-hover:text-neon-blue transition-colors font-space-grotesk">{project.title}</h2>
                  <div className="text-xs text-text-muted font-mono uppercase tracking-wide">Relational ID: {project.client.replace('https://', '').replace('www.', '')}</div>
                </div>
                <div className="flex gap-2">
                   <a 
                     href={project.client.includes('.') ? (project.client.startsWith('http') ? project.client : `https://${project.client}`) : '#'} 
                     target="_blank" 
                     rel="noreferrer"
                     className="p-2.5 bg-white/5 hover:bg-neon-blue/20 rounded-xl transition-all text-text-muted hover:text-neon-blue border border-white/5 hover:border-neon-blue/20"
                   >
                     <ExternalLink size={18} />
                   </a>
                </div>
              </div>
              
              <p className="text-text-muted text-sm leading-relaxed mb-8 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
                {project.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-bold text-text-muted uppercase tracking-tighter border border-white/5 group-hover:border-neon-blue/20 transition-colors">
                    <div className="w-1 h-1 rounded-full bg-neon-blue group-hover:animate-pulse" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 p-12 md:p-20 bg-gradient-to-br from-neon-blue/10 to-transparent border border-neon-blue/20 rounded-[40px] text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Have a visionary project in mind?</h2>
        <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">We are actively taking on new enterprise-level contracts and product development partnerships.</p>
        <Link to="/#contact" className="inline-flex items-center gap-3 px-10 py-5 bg-neon-blue text-bg-base font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl shadow-neon-blue/20">
          Book Execution <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
