import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="px-6 md:px-[8%] py-12 md:py-20 border-t border-white/10 text-text-muted text-sm bg-bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 border-b border-white/5 pb-16 mb-12">
        <div className="space-y-6">
          <div className="text-xl font-bold font-space-grotesk tracking-tighter uppercase">
            WHALES <span className="text-neon-blue">Solution</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Engineering high-scale digital infrastructure and premium brand ecosystems for tomorrow's industry leaders.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white">Capabilities</h4>
          <ul className="space-y-3">
            <li><Link to="/web-development" className="hover:text-neon-blue transition-colors">Web Development</Link></li>
            <li><Link to="/seo" className="hover:text-neon-blue transition-colors">SEO Optimization</Link></li>
            <li><Link to="/ai-agents" className="hover:text-neon-blue transition-colors">AI & Automation</Link></li>
            <li><Link to="/digital-marketing" className="hover:text-neon-blue transition-colors">Digital Marketing</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white">Archives</h4>
          <ul className="space-y-3">
            <li><Link to="/blog" className="hover:text-neon-blue transition-colors">Blog</Link></li>
            <li><Link to="/projects" className="hover:text-neon-blue transition-colors">Projects</Link></li>
            <li><Link to="/admin" className="hover:text-neon-blue transition-colors">Admin Console</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white">Initialize</h4>
          <Link to="/#contact" className="inline-block px-6 py-3 bg-white text-bg-base text-xs font-bold uppercase tracking-widest hover:bg-neon-blue rounded-sm transition-all text-center">
            Start A Project
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Whales Solution.</span>
          <span className="text-[10px] opacity-20 uppercase tracking-tighter">Enterprise Grade Architecture</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-neon-blue transition-colors">Privacy</a>
          <a href="#" className="hover:text-neon-blue transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
