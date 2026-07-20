import { useState, useEffect, useCallback, useRef } from 'react';
import { createBlog, batchCreateBlogs, batchDeleteBlogs, updateBlog, getBlogs, uploadBlogImage, Blog as BlogType, isAdmin as checkAdminStatus } from '../services/blogService';
import { createProject, getProjects, updateProject, batchDeleteProjects, batchCreateProjects, uploadProjectImage, Project as ProjectType } from '../services/projectService';
import { generateBlogSeed } from '../services/aiService';
import { MOCK_PROJECTS } from '../constants';
import { auth, loginWithGoogle, loginWithEmail, logout } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Send, Loader2, CheckCircle, AlertCircle, LogIn, LogOut, Search, Type, Rocket, Trash2, CheckSquare, Square, Upload, Briefcase, LayoutGrid, Key, Mail, Database, Globe, HardDrive, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects'>('blogs');
  const [loginMethod, setLoginMethod] = useState<'google' | 'email'>('email');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const terminalId = useState(() => Math.random().toString(36).substring(7).toUpperCase())[0];

  // Blog Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'publish' | 'draft'>('draft');
  const [coverImage, setCoverImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  // Project Form State
  const [pTitle, setPTitle] = useState('');
  const [pClient, setPClient] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');
  const [pTags, setPTags] = useState('');

  const [loading, setLoading] = useState(false);
  const [coverImageMode, setCoverImageMode] = useState<'url' | 'upload' | 'drive'>('url');
  const [pImageMode, setPImageMode] = useState<'url' | 'upload' | 'drive'>('url');

  const extractDriveId = (url: string) => {
    const regExp = /[-\w]{25,}/;
    const match = url.match(regExp);
    return match ? match[0] : null;
  };

  const convertDriveLink = (url: string) => {
    const id = extractDriveId(url);
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
    return url;
  };

  const handleDriveLinkChange = (val: string, type: 'blog' | 'project') => {
    const converted = convertDriveLink(val);
    if (type === 'blog') setCoverImage(converted);
    else setPImage(converted);
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [seedLoading, setSeedLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[], type: 'blogs' | 'projects' } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const isFetchingRef = useRef(false);

  const loadData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setFetchingData(true);
    setMessage(null);
    try {
      console.log(`[Admin] Synchronizing archives for node: ${activeTab.toUpperCase()}`);
      if (activeTab === 'blogs') {
        const data = await getBlogs(false);
        console.log(`[Admin] Successfully retrieved ${data.length} blog nodes.`);
        setBlogs(data);
      } else {
        const data = await getProjects();
        console.log(`[Admin] Successfully retrieved ${data.length} portfolio assets.`);
        setProjects(data);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch data', err);
      setMessage({ type: 'error', text: 'Critical Error: Unable to synchronize with neural archives.' });
    } finally {
      setFetchingData(false);
      isFetchingRef.current = false;
    }
  }, [activeTab]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const adminStatus = await checkAdminStatus();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [activeTab, isAdmin, loadData]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug) {
      setSlug(newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (loginMethod === 'google') {
        await loginWithGoogle();
      } else {
        if (!loginEmail || !loginPassword) {
          setMessage({ type: 'error', text: 'Please enter both email and password.' });
          setLoading(false);
          return;
        }
        await loginWithEmail(loginEmail, loginPassword);
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      let errorMessage = err instanceof Error ? err.message : 'Authentication failed.';
      
      // Provide helpful guidance for common configuration errors
      if (errorMessage.includes('auth/operation-not-allowed')) {
        errorMessage = 'Configuration Error: Please enable "Email/Password" and "Google" sign-in methods in your Firebase Console.';
      } else if (errorMessage.includes('auth/unauthorized-domain')) {
        errorMessage = 'Security Error: This domain is not authorized. Please add it to "Authorized domains" in your Firebase Auth settings.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const blogData = {
        title,
        slug,
        excerpt,
        content,
        status: status === 'publish' ? 'published' : 'draft',
        coverImage,
        metaTitle,
        metaDescription,
        tags: []
      };

      if (editingId) {
        await updateBlog(editingId, blogData);
        setMessage({ type: 'success', text: 'Intelligence architecture updated successfully.' });
      } else {
        await createBlog(blogData);
        setMessage({ type: 'success', text: `Intelligence ${status === 'publish' ? 'transmitted' : 'stored as draft'} successfully.` });
      }
      
      resetBlogForm();
      loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transmission failure.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetBlogForm = () => {
    setEditingId(null);
    setTitle(''); setSlug(''); setExcerpt(''); setContent(''); setCoverImage(''); setMetaTitle(''); setMetaDescription('');
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const projectData = {
        title: pTitle,
        client: pClient,
        category: pCategory,
        description: pDescription,
        image: pImage,
        tags: pTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      if (editingId) {
        await updateProject(editingId, projectData);
        setMessage({ type: 'success', text: 'Strategic asset reconfigured successfully.' });
      } else {
        await createProject(projectData);
        setMessage({ type: 'success', text: 'Strategic asset deployed successfully.' });
      }
      
      resetProjectForm();
      loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Deployment failure.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetProjectForm = () => {
    setEditingId(null);
    setPTitle(''); setPClient(''); setPCategory(''); setPDescription(''); setPImage(''); setPTags('');
  };

  const handleEdit = (item: BlogType | ProjectType) => {
    setEditingId(item.id || null);
    if (activeTab === 'blogs') {
      const blog = item as BlogType;
      setTitle(blog.title);
      setSlug(blog.slug);
      setExcerpt(blog.excerpt);
      setContent(blog.content);
      setStatus(blog.status === 'published' ? 'publish' : 'draft');
      setCoverImage(blog.coverImage || '');
      setMetaTitle(blog.metaTitle || '');
      setMetaDescription(blog.metaDescription || '');
    } else {
      const project = item as ProjectType;
      setPTitle(project.title);
      setPClient(project.client);
      setPCategory(project.category);
      setPDescription(project.description);
      setPImage(project.image);
      setPTags(project.tags.join(', '));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeedSEO = async () => {
    if (!isAdmin || seedLoading) return;
    setSeedLoading(true);
    setMessage({ type: 'success', text: 'System: Initiating AI generation of SEO assets...' });
    try {
      const rawBlogs = await generateBlogSeed(5);
      const timestamp = Date.now().toString().slice(-4);
      const seededBlogs = (rawBlogs as Array<Partial<BlogType>>).map((blog) => ({
        ...blog,
        slug: `${blog.slug}-${timestamp}-${Math.floor(Math.random() * 1000)}`.toLowerCase().replace(/[^\w-]/g, '').slice(0, 100),
      })) as Omit<BlogType, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>[];
      await batchCreateBlogs(seededBlogs);
      setMessage({ type: 'success', text: `${seededBlogs.length} strategic assets successfully synchronized.` });
      await loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Batch transmission failure.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSeedLoading(false);
    }
  };

  const handleSeedPortfolio = async () => {
    if (!isAdmin || seedLoading) return;
    setSeedLoading(true);
    setMessage({ type: 'success', text: 'System: Synchronizing legacy portfolio architectures...' });
    try {
      await batchCreateProjects(MOCK_PROJECTS);
      setMessage({ type: 'success', text: `${MOCK_PROJECTS.length} strategic portfolio assets successfully synchronized.` });
      await loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Portfolio synchronization failure.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSeedLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'blog' | 'project') => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;
    try {
      const url = type === 'blog' ? await uploadBlogImage(file) : await uploadProjectImage(file);
      if (type === 'blog') setCoverImage(url);
      else setPImage(url);
      setMessage({ type: 'success', text: 'Asset synchronized successfully.' });
    } catch {
      setMessage({ type: 'error', text: 'Image synchronization failed.' });
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const items = activeTab === 'blogs' ? blogs : projects;
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id as string));
    }
  };

  const handleDeleteRequest = (targetIds?: string[]) => {
    const idsToDelete = targetIds || [...selectedItems];
    if (idsToDelete.length === 0) return;
    setConfirmDelete({ ids: idsToDelete, type: activeTab });
  };

  const executeDelete = async () => {
    if (!confirmDelete || deleteLoading) return;
    setDeleteLoading(true);
    const { ids, type } = confirmDelete;
    try {
      if (type === 'blogs') await batchDeleteBlogs(ids);
      else await batchDeleteProjects(ids);
      setMessage({ type: 'success', text: `${ids.length} assets successfully liquidated.` });
      setSelectedItems([]);
      await loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Liquidiation failure.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <Loader2 className="animate-spin text-neon-blue" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-[8%] min-h-screen flex flex-col items-center justify-center text-center">
        <div className="hero-spotlight" />
        <div className="max-w-md w-full p-6 md:p-10 bg-bg-surface border border-white/10 rounded-[32px] md:rounded-[40px] shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
             <LogIn className="text-neon-blue" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Secure Network Access</h1>
          <p className="text-text-muted mb-8 text-sm uppercase tracking-widest font-space-grotesk">Administrative Node Authorization</p>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-8">
            <button onClick={() => setLoginMethod('email')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${loginMethod === 'email' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>Credentials</button>
            <button onClick={() => setLoginMethod('google')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${loginMethod === 'google' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>Google Auth</button>
          </div>

          {loginMethod === 'email' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="email" 
                  placeholder="Network Identity" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-neon-blue/50 transition-all font-mono text-sm"
                />
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="password" 
                  placeholder="Security Token" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-neon-blue/50 transition-all font-mono text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-neon-blue text-bg-base font-bold uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-neon-blue/20 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={18} /> Initialize Session</>}
              </button>
            </form>
          ) : (
            <button onClick={() => handleLogin()} disabled={loading} className="w-full py-4 bg-white text-bg-base font-bold uppercase tracking-widest rounded-2xl hover:bg-neon-blue transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={18} /> Authenticate Google</>}
            </button>
          )}
          
          <p className="mt-8 text-[10px] text-text-muted uppercase tracking-tighter">Terminal ID: {terminalId}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-[8%] min-h-screen flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full p-6 md:p-10 bg-bg-surface border border-red-500/20 rounded-[32px] md:rounded-[40px] shadow-2xl">
          <AlertCircle className="text-red-500 mx-auto mb-6" size={48} />
          <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
          <p className="text-text-muted mb-8 italic">{user.email} is not cleared.</p>
          <button onClick={handleLogout} className="w-full py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5">Switch Account</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 md:px-[8%]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <span className="text-neon-blue uppercase tracking-widest text-xs font-space-grotesk mb-2 block">Authorized Session: {user.displayName}</span>
          <h1 className="text-4xl md:text-5xl font-bold">Network Console</h1>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
                  <button 
                    onClick={() => { setActiveTab('blogs'); setSelectedItems([]); setEditingId(null); }}
                    className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'blogs' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}
                  >
                    <Type size={14} /> Blog Nodes
                  </button>
                  <button 
                    onClick={() => { setActiveTab('projects'); setSelectedItems([]); setEditingId(null); }}
                    className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'projects' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}
                  >
                    <Briefcase size={14} /> Portfolio Assets
                  </button>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-all">
          <LogOut size={14} /> End Session
        </button>
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg-base/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-bg-surface border border-red-500/30 p-10 rounded-[40px] shadow-[0_0_100px_rgba(239,68,68,0.1)] text-center">
              <Trash2 className="text-red-500 mx-auto mb-8" size={48} />
              <h2 className="text-2xl font-bold mb-4 uppercase">Confirm Asset Liquidiation</h2>
              <p className="text-text-muted mb-10">Permanently delete {confirmDelete.ids.length} assets from core.</p>
              <div className="flex flex-col gap-4">
                <button onClick={executeDelete} className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all">Execute Liquidiation</button>
                <button onClick={() => setConfirmDelete(null)} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl">Abort Protocol</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`mb-10 p-6 rounded-[32px] border flex items-center gap-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-xl'}`}>
            {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <div className="flex-1 text-sm">{message.text}</div>
            <button onClick={() => setMessage(null)} className="opacity-50 hover:opacity-100">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'blogs' ? (
        <form onSubmit={handleBlogSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-bg-surface p-6 md:p-10 rounded-2xl md:rounded-[32px] border border-white/5 shadow-2xl space-y-6 md:space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Intelligence Headline</label>
                <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-neon-blue/50 text-xl md:text-2xl font-bold" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Slug Path</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-neon-blue font-mono text-sm outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Neural Content (Markdown)</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={15} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-neon-blue/50 resize-none font-mono text-sm" />
              </div>
            </div>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className="bg-bg-surface p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-white/5 shadow-xl space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Excerpt</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-text-muted outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Visual Asset Discovery</label>
                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-3">
                  <button type="button" onClick={() => setCoverImageMode('url')} className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all ${coverImageMode === 'url' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>
                    <Globe size={12} /> Neural Link
                  </button>
                  <button type="button" onClick={() => setCoverImageMode('upload')} className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all ${coverImageMode === 'upload' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>
                    <HardDrive size={12} /> Local Archive
                  </button>
                  <button type="button" onClick={() => setCoverImageMode('drive')} className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all ${coverImageMode === 'drive' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>
                    <Cloud size={12} /> Cloud Drive
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {coverImageMode === 'url' && (
                    <motion.div key="url" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-neon-blue/40" />
                    </motion.div>
                  )}
                  {coverImageMode === 'upload' && (
                    <motion.div key="upload" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <label className="w-full h-12 flex items-center justify-center gap-2 bg-neon-blue/5 border border-dashed border-neon-blue/30 rounded-xl cursor-pointer hover:bg-neon-blue/10 transition-all">
                        <Upload size={14} className="text-neon-blue" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neon-blue">Upload Local Asset</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'blog')} />
                      </label>
                    </motion.div>
                  )}
                  {coverImageMode === 'drive' && (
                    <motion.div key="drive" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <input 
                        type="text" 
                        placeholder="Paste Google Drive Shared Link..." 
                        onChange={(e) => handleDriveLinkChange(e.target.value, 'blog')}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-neon-blue/40" 
                      />
                      <p className="mt-2 text-[9px] text-text-muted italic px-1">Tip: Asset must be shared as "Anyone with link can view".</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {coverImage && <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-white/10"><img src={coverImage} className="w-full h-full object-cover" /></div>}
              </div>
                <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStatus('draft')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${status === 'draft' ? 'bg-white text-bg-base border-white' : 'bg-transparent text-text-muted border-white/10'}`}>Draft</button>
                    <button type="button" onClick={() => setStatus('publish')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${status === 'publish' ? 'bg-neon-blue text-bg-base border-neon-blue' : 'bg-transparent text-text-muted border-white/10'}`}>Publish</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button type="submit" disabled={loading} className="w-full py-5 bg-neon-blue text-bg-base font-bold uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-neon-blue/20 flex items-center justify-center gap-3">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> {editingId ? 'Update Post' : 'Transmit Post'}</>}
                    </button>
                    {editingId && (
                      <button type="button" onClick={resetBlogForm} className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
            </div>
            <div className="p-6 bg-neon-blue/5 border border-neon-blue/10 rounded-2xl">
               <button type="button" onClick={handleSeedSEO} disabled={seedLoading} className="w-full py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-neon-blue hover:text-bg-base transition-all flex items-center justify-center gap-2">
                 {seedLoading ? <Loader2 className="animate-spin" size={12} /> : <><Rocket size={12} /> AI Asset Generation</>}
               </button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-bg-surface p-6 md:p-10 rounded-2xl md:rounded-[32px] border border-white/5 shadow-2xl space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Asset Title</label>
                  <input type="text" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-neon-blue/50 font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Strategic Category</label>
                  <input type="text" value={pCategory} onChange={(e) => setPCategory(e.target.value)} required placeholder="e.g. Cloud Infrastructure" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Identifier (Client/Link)</label>
                <input type="text" value={pClient} onChange={(e) => setPClient(e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-neon-blue font-mono text-sm outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Technical Description</label>
                <textarea value={pDescription} onChange={(e) => setPDescription(e.target.value)} required rows={10} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-neon-blue/50 resize-none text-sm leading-relaxed" />
              </div>
            </div>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className="bg-bg-surface p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-white/5 shadow-xl space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Strategic Tags (Comma Separated)</label>
                <input type="text" value={pTags} onChange={(e) => setPTags(e.target.value)} placeholder="AI, Cloud, Secure" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-muted outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Display Asset Acquisition</label>
                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-3">
                  <button type="button" onClick={() => setPImageMode('url')} className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all ${pImageMode === 'url' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>
                    <Globe size={12} /> Neural Link
                  </button>
                  <button type="button" onClick={() => setPImageMode('upload')} className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all ${pImageMode === 'upload' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>
                    <HardDrive size={12} /> Local Archive
                  </button>
                  <button type="button" onClick={() => setPImageMode('drive')} className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter flex items-center justify-center gap-1.5 transition-all ${pImageMode === 'drive' ? 'bg-white text-bg-base' : 'text-text-muted hover:text-white'}`}>
                    <Cloud size={12} /> Cloud Drive
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {pImageMode === 'url' && (
                    <motion.div key="p-url" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <input type="url" value={pImage} onChange={(e) => setPImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-neon-blue/40" />
                    </motion.div>
                  )}
                  {pImageMode === 'upload' && (
                    <motion.div key="p-upload" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <label className="w-full h-12 flex items-center justify-center gap-2 bg-neon-blue/5 border border-dashed border-neon-blue/30 rounded-xl cursor-pointer hover:bg-neon-blue/10 transition-all">
                        <Upload size={14} className="text-neon-blue" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neon-blue">Upload Local Asset</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} />
                      </label>
                    </motion.div>
                  )}
                  {pImageMode === 'drive' && (
                    <motion.div key="p-drive" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <input 
                        type="text" 
                        placeholder="Paste Google Drive Shared Link..." 
                        onChange={(e) => handleDriveLinkChange(e.target.value, 'project')}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-neon-blue/40" 
                      />
                      <p className="mt-2 text-[9px] text-text-muted italic px-1">Tip: Asset must be shared as "Anyone with link can view".</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {pImage && <div className="aspect-video rounded-xl overflow-hidden border border-white/10 mt-4"><img src={pImage} className="w-full h-full object-cover" /></div>}
                <div className="flex flex-col gap-2">
                  <button type="submit" disabled={loading} className="w-full py-5 bg-neon-blue text-bg-base font-bold uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-neon-blue/20 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><LayoutGrid size={18} /> {editingId ? 'Update Asset' : 'Deploy Asset'}</>}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetProjectForm} className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                      Cancel Configuration
                    </button>
                  )}
                </div>
            </div>
            <div className="p-6 bg-neon-blue/5 border border-neon-blue/10 rounded-2xl">
               <button type="button" onClick={handleSeedPortfolio} disabled={seedLoading} className="w-full py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-neon-blue hover:text-bg-base transition-all flex items-center justify-center gap-2">
                 {seedLoading ? <Loader2 className="animate-spin" size={12} /> : <><Database size={12} /> Sync Legacy Portfolio</>}
               </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Neural Archive Management</h2>
            <p className="text-text-muted text-sm mt-1">Status: Node Active | Protocol: {activeTab.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            {selectedItems.length > 0 && <button onClick={() => handleDeleteRequest()} disabled={deleteLoading} className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase"><Trash2 size={14} /> Liquidate {selectedItems.length}</button>}
            <button onClick={toggleSelectAll} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase text-text-muted hover:text-white transition-all">
              {selectedItems.length === (activeTab === 'blogs' ? blogs.length : projects.length) && (activeTab === 'blogs' ? blogs.length : projects.length) > 0 ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        {fetchingData ? (
          <div className="py-20 flex flex-col items-center justify-center bg-bg-surface rounded-[32px] border border-white/5 border-dashed">
            <Loader2 className="animate-spin text-neon-blue mb-4" size={32} />
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Synchronizing Archives...</p>
          </div>
        ) : (activeTab === 'blogs' ? blogs.length : projects.length) === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-bg-surface rounded-[32px] border border-white/5 border-dashed text-text-muted">
            <Search size={40} className="mb-4 opacity-10" />
            <p className="text-sm font-medium">No active assets found in this node.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'blogs' ? blogs : projects).map((item) => (
              <motion.div 
                key={item.id}
                layout
                className={`relative group p-6 rounded-[32px] border transition-all cursor-pointer ${selectedItems.includes(item.id as string) ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-bg-surface border-white/5 hover:border-white/10'}`}
                onClick={() => toggleSelectItem(item.id as string)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedItems.includes(item.id as string) ? 'bg-neon-blue text-bg-base' : 'bg-white/5 text-text-muted'}`}>
                    {selectedItems.includes(item.id as string) ? <CheckSquare size={20} /> : <Square size={20} />}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(item); }} 
                      className="p-2 bg-neon-blue/10 text-neon-blue rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Type size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (item.id) handleDeleteRequest([item.id]); }} 
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-neon-blue text-xs italic mb-4">/{'slug' in item ? item.slug : item.client}</p>
                <div className="flex items-center gap-2 text-[9px] text-text-muted font-mono uppercase">
                  {activeTab === 'blogs' ? `Status: ${(item as BlogType).status}` : `Category: ${(item as ProjectType).category}`}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
