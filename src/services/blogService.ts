import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  createdAt: unknown;
  updatedAt: unknown;
  status: 'draft' | 'published';
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}

// CRITICAL: Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

const BLOGS_COLLECTION = 'blogs';

export const getBlogs = async (onlyPublished = true) => {
  try {
    let q = query(collection(db, BLOGS_COLLECTION));
    
    if (onlyPublished) {
      q = query(q, where('status', '==', 'published'));
    }
    
    const snapshot = await getDocs(q);
    const blogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Blog[];
    
    // Sort in memory to avoid composite index requirements
    return blogs.sort((a, b) => {
      const dateA = (a.createdAt as { seconds?: number })?.seconds || 0;
      const dateB = (b.createdAt as { seconds?: number })?.seconds || 0;
      return dateB - dateA;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, BLOGS_COLLECTION);
    return [];
  }
};

export const getBlogBySlug = async (slug: string) => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, slug);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const blog = { id: docSnap.id, ...docSnap.data() } as Blog;
    
    // Safety check for published status if not admin
    if (blog.status !== 'published') {
      const isUserAdmin = await isAdmin();
      if (!isUserAdmin) return null;
    }
    
    return blog;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${BLOGS_COLLECTION}/${slug}`);
    return null;
  }
};

export const createBlog = async (data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const blogId = data.slug; // Using slug as ID for cleaner URLs or generate one
  const path = `${BLOGS_COLLECTION}/${blogId}`;
  
  try {
    const newBlog: Blog = {
      ...data,
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || 'Whales Admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, BLOGS_COLLECTION, blogId), newBlog);
    return { id: blogId, ...newBlog };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateBlog = async (id: string, data: Partial<Blog>) => {
  const path = `${BLOGS_COLLECTION}/${id}`;
  try {
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(db, BLOGS_COLLECTION, id), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteBlog = async (id: string) => {
  const path = `${BLOGS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, BLOGS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const batchCreateBlogs = async (blogs: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>[]) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const batch = writeBatch(db);
  const results: Blog[] = [];
  
  for (const blogData of blogs) {
    const blogId = blogData.slug;
    const newBlog: Blog = {
      ...blogData,
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || 'Whales Admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    batch.set(doc(db, BLOGS_COLLECTION, blogId), newBlog);
    results.push({ id: blogId, ...newBlog });
  }
  
  try {
    await batch.commit();
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, BLOGS_COLLECTION);
    return [];
  }
};

export const batchDeleteBlogs = async (ids: string[]) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  console.log('Initiating sequential delete for IDs:', ids);
  
  const results = [];
  for (const id of ids) {
    if (!id) continue;
    try {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      console.log(`DELETING_DOC: ${BLOGS_COLLECTION}/${id}`);
      await deleteDoc(docRef);
      results.push({ id, status: 'success' });
    } catch (error) {
      console.error(`DELETE_ERROR for doc ${id}:`, error);
      results.push({ id, status: 'error', error });
    }
  }
  
  const failures = results.filter(r => r.status === 'error');
  if (failures.length > 0) {
    // If all failed, throw the first error. If some succeeded, we might want to just log it.
    // For now, throw if any failed to trigger the catch block in the UI.
    const firstError = failures[0].error;
    handleFirestoreError(firstError, OperationType.DELETE, BLOGS_COLLECTION);
  }
  
  console.log('Delete sequence complete. Results:', results);
};

export const uploadBlogImage = async (file: File): Promise<string> => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const timestamp = Date.now();
  const storageRef = ref(storage, `blogs/${timestamp}_${file.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Migration Upload Error:', error);
    throw error;
  }
};

export const isAdmin = async () => {
    if (!auth.currentUser) return false;
    
    // Check if user is the hardcoded super admin
    if (auth.currentUser.email === 'pkbazaar26@gmail.com') {
        return true;
    }

    try {
        const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
        return adminDoc.exists();
    } catch (err: unknown) {
        console.error('Admin check error:', err);
        return false;
    }
};
