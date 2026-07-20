import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug, Blog as BlogType } from '../services/blogService';
import { Calendar, ArrowLeft, Loader2, Share2, Info } from 'lucide-react';
// motion removed as it was unused

import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (slug) {
        try {
          const data = await getBlogBySlug(slug);
          setPost(data);
        } catch (err) {
          console.error('Error fetching blog post:', err);
        }
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-text-muted">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-space-grotesk tracking-widest uppercase">Fetching Post Content...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-text-muted px-4">
        <h1 className="text-4xl font-bold mb-4">404 - Transmission Lost</h1>
        <p className="mb-8">The requested intelligence could not be retrieved.</p>
        <Link to="/blog" className="px-6 py-3 bg-neon-blue text-bg-base font-bold uppercase tracking-widest rounded-lg">
          Back to Archives
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-[10px] text-neon-blue uppercase tracking-widest mb-6">
            <span className="flex items-center gap-1"><Calendar size={12} /> {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="flex items-center gap-1"><Info size={12} /> Optimized Intelligence</span>
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold leading-tight mb-8"
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-text-muted font-medium mb-4 italic border-l-2 border-neon-blue pl-6">
                {post.excerpt}
            </p>
          )}
        </header>

        {post.coverImage && (
          <div className="rounded-3xl overflow-hidden border border-white/10 mb-16 shadow-2xl">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="prose prose-invert prose-neon max-w-none text-text-muted leading-relaxed">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-16 pt-16 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center text-neon-blue font-bold">W</div>
               <div>
                 <div className="text-sm font-bold">Whales Engineering</div>
                 <div className="text-xs text-text-muted">Enterprise Solutions Team</div>
               </div>
            </div>
            <button className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
              <Share2 size={18} />
            </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .prose h2 { color: white; font-size: 1.8rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .prose h3 { color: white; font-size: 1.4rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .prose p { margin-bottom: 1.5rem; }
        .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; }
        .prose a { color: #00d4ff; text-decoration: underline; text-underline-offset: 4px; }
        .prose blockquote { border-left: 4px solid #00d4ff; padding-left: 1.5rem; font-style: italic; margin: 2rem 0; opacity: 0.8; }
      `}} />
    </article>
  );
}
