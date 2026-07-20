import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import Admin from './pages/Admin';
import SEO from './pages/services/SEO';
import DigitalMarketing from './pages/services/DigitalMarketing';
import WebDevelopment from './pages/services/WebDevelopment';
import GraphicDesign from './pages/services/GraphicDesign';
import GoogleAds from './pages/services/GoogleAds';
import AIAgents from './pages/services/AIAgents';
import AiSalesAgent from './components/AiSalesAgent';

interface CustomWindow extends Window {
  gtag?: (command: string, ...args: unknown[]) => void;
}

export default function App() {
  const { pathname, hash } = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Connection test removed to prevent redundant mounting requests
  }, []);

  // Dynamic Google Analytics 4 Pageview Tracking
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-H7Z26S9D5F'; // Fallback / premium GA tracking ID
    if (!gaId || typeof window === 'undefined') return;

    const customWindow = window as CustomWindow;

    if (!customWindow.gtag) {
      // Inject Gtag scripts
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${gaId}', { page_path: window.location.pathname });
      `;
      document.head.appendChild(script2);
    } else {
      // Fire pageview event on route updates
      customWindow.gtag('config', gaId, {
        page_path: pathname,
        page_title: document.title || 'Whales Solution'
      });
    }
  }, [pathname]);

  // Handle scrolling: top for new pages, or to hash if present
  useEffect(() => {
    if (hash) {
      // If it's the initial load, scroll to top and skip hash scrolling
      if (isInitialMount.current) {
        window.scrollTo(0, 0);
        isInitialMount.current = false;
        return;
      }

      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure page content is rendered
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo(0, 0);
      isInitialMount.current = false;
    }
  }, [pathname, hash]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin" element={<Admin />} />
        
        {/* Service Pages */}
        <Route path="/seo" element={<SEO />} />
        <Route path="/digital-marketing" element={<DigitalMarketing />} />
        <Route path="/web-development" element={<WebDevelopment />} />
        <Route path="/graphic-design" element={<GraphicDesign />} />
        <Route path="/google-ads" element={<GoogleAds />} />
        <Route path="/ai-agents" element={<AIAgents />} />
      </Routes>
      <AiSalesAgent />
    </Layout>
  );
}
