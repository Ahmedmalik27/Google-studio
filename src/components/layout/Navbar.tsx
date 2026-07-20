import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdmin as checkAdminStatus } from '../../services/blogService';
import { ChevronDown, Menu, X, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const status = await checkAdminStatus();
        setIsAdmin(status);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const services = [
    { name: 'SEO Optimization', path: '/seo' },
    { name: 'Digital Marketing', path: '/digital-marketing' },
    { name: 'Web Development', path: '/web-development' },
    { name: 'Graphic Design', path: '/graphic-design' },
    { name: 'Google Ads', path: '/google-ads' },
    { name: 'AI Agents', path: '/ai-agents' },
  ];

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-bg-base/15 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
      
      <div className="flex justify-between items-center pl-4 pr-2.5 md:px-[5%] py-3.5 md:py-4.5 relative max-w-[1920px] mx-auto z-50">
        {/* Left Side: Logo & Mobile Toggle */}
        <motion.div 
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-1 items-center gap-1.5 md:gap-3 shrink-0"
        >
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-text-muted hover:text-white transition-all p-1.5 bg-white/5 rounded-lg border border-white/10 active:scale-90 relative z-[60]"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
 
          <Link to="/" className="group flex items-center gap-1.5 md:gap-2">
            <div className="text-xl md:text-2xl font-black font-space-grotesk tracking-tighter uppercase whitespace-nowrap">
              <span className="text-white group-hover:text-cyan-400 transition-colors duration-300 font-bold">WHALES</span>
              <span className="text-cyan-400 ml-1.5 md:ml-2 group-hover:brightness-125 transition-all font-bold">SOLUTION</span>
            </div>
          </Link>
        </motion.div>
        
        {/* Middle: Desktop Navigation (Centered) */}
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="hidden md:flex flex-1 justify-center items-center"
        >
          <ul className="flex gap-8 lg:gap-12 items-center list-none p-0 m-0">
            <li className="relative group">
              <Link to="/" className="text-[14px] lg:text-[15px] font-medium text-text-muted hover:text-white transition-all py-1 block hover:scale-105 transform">Home</Link>
              <div className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></div>
            </li>
 
            {/* Capabilities Dropdown (Desktop) */}
            <li 
              className="relative group"
              onMouseEnter={() => setIsCapabilitiesOpen(true)}
              onMouseLeave={() => setIsCapabilitiesOpen(false)}
            >
              <button 
                className="flex items-center gap-1.5 text-[14px] lg:text-[15px] font-medium text-text-muted hover:text-white transition-all outline-none py-1 group-hover:scale-105 transform"
                onClick={() => setIsCapabilitiesOpen(!isCapabilitiesOpen)}
              >
                Capabilities
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCapabilitiesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isCapabilitiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-bg-surface/80 border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-3xl p-2 z-[60]"
                  >
                    {services.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        onClick={() => setIsCapabilitiesOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/30 group-hover:bg-cyan-400"></div>
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
 
            <li>
              <Link to="/projects" className="text-[14px] lg:text-[15px] font-medium text-text-muted hover:text-white transition-all py-1 block hover:scale-105 transform">Projects</Link>
            </li>
            <li>
              <Link to="/blog" className="text-[14px] lg:text-[15px] font-medium text-text-muted hover:text-white transition-all py-1 block hover:scale-105 transform">Blog</Link>
            </li>
          </ul>
          
          {isAdmin && (
            <Link to="/admin" className="ml-6 p-2 text-text-muted hover:text-cyan-400 transition-colors relative border border-white/5 rounded-full hover:border-cyan-400/20" title="Admin">
              <Key className="w-3.5 h-3.5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.5)]"></span>
            </Link>
          )}
        </motion.div>
 
        {/* Right Side: Action Button */}
        <motion.div 
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-1 justify-end items-center gap-4 shrink-0"
        >
          <Link 
            to="/#contact" 
            className="px-4 py-1.5 md:px-5 md:py-2 bg-white text-bg-base rounded-md text-[13px] font-bold hover:bg-cyan-400 hover:text-white transition-all shadow-lg shadow-white/5 whitespace-nowrap active:scale-95 hover:scale-105 transform"
          >
            Start Project
          </Link>
        </motion.div>
      </div>


      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 64px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[64px] left-0 w-full bg-bg-base/90 backdrop-blur-3xl z-40 md:hidden overflow-y-auto border-t border-white/5"
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-col p-8 gap-8 flex-grow">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold text-text-muted hover:text-white transition-colors border-b border-white/5 pb-4"
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-neon-blue uppercase tracking-[0.3em] opacity-50">Capabilities</p>
                  <div className="grid grid-cols-1 gap-6">
                    {services.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-text-muted hover:text-neon-blue transition-colors flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-neon-blue/20" />
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/40 mt-auto">
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mb-4 flex items-center justify-center gap-3 w-full py-5 text-sm font-bold text-neon-blue uppercase border border-neon-blue/20 rounded-xl bg-neon-blue/5"
                  >
                    <Key className="w-5 h-5" />
                    Admin Console
                  </Link>
                )}

                <Link 
                  to="/#contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-5 bg-white text-bg-base rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-neon-blue transition-colors"
                >
                  Start A Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
