import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, Blog as BlogType } from '../services/blogService';
import { Calendar, ArrowRight, Loader2, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export default function Blog() {
  const [posts, setPosts] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchPosts() {
      try {
        const data = await getBlogs();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="pt-24 pb-24 px-6 md:px-[8%]">
      <div className="max-w-4xl mb-16">
        <span className="text-neon-blue uppercase tracking-widest text-sm font-space-grotesk mb-4 block">Knowledge Base</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Insights & Engineering.</h1>
        <p className="text-text-muted text-base md:text-lg">Exploring the intersection of scalable architecture, high-performance design, and business growth.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-text-muted">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-space-grotesk tracking-widest uppercase text-xs">Accessing Neural Archives...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article 
              key={post.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden group hover:border-neon-blue/30 transition-all flex flex-col shadow-xl"
            >
              {post.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-[10px] text-text-muted uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                  </div>
                  {post.tags?.[0] && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-neon-blue uppercase tracking-tighter">
                      <Tag size={8} /> {post.tags[0]}
                    </span>
                  )}
                </div>
                <h2 
                  className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-neon-blue transition-colors"
                >
                  {post.title}
                </h2>
                <div 
                  className="text-text-muted text-sm line-clamp-3 mb-6 flex-grow"
                >
                  {post.excerpt}
                </div>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-neon-blue transition-colors mt-auto"
                >
                  Read Depth <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center text-text-muted border border-dashed border-white/10 rounded-3xl">
          <p className="text-xl font-bold uppercase tracking-widest mb-2">No Posts Found</p>
          <p>The neural network is quiet... check back later.</p>
        </div>
      )}
    </div>
  );
}
