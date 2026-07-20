import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export interface Project {
  id?: string;
  title: string;
  client: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

const PROJECTS_COLLECTION = 'projects';

export const getProjects = async () => {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION));
    const snapshot = await getDocs(q);
    console.log(`[ProjectService] Raw fetch yielded ${snapshot.size} documents.`);
    const projects = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Project[];
    
    console.log(`[ProjectService] First 3 IDs:`, projects.slice(0, 3).map(p => p.id));
    
    // Sort in memory
    return projects.sort((a, b) => {
      const dateA = (a.createdAt as { seconds?: number })?.seconds || 0;
      const dateB = (b.createdAt as { seconds?: number })?.seconds || 0;
      return dateB - dateA;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
    return [];
  }
};

export const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const projectId = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const path = `${PROJECTS_COLLECTION}/${projectId}`;
  
  try {
    const newProject: Project = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, PROJECTS_COLLECTION, projectId), newProject);
    return { id: projectId, ...newProject };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const path = `${PROJECTS_COLLECTION}/${id}`;
  try {
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(db, PROJECTS_COLLECTION, id), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteProject = async (id: string) => {
  const path = `${PROJECTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const batchDeleteProjects = async (ids: string[]) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const results: Array<{ id: string, status: string, error?: unknown }> = [];
  for (const id of ids) {
    if (!id) continue;
    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
      results.push({ id, status: 'success' });
    } catch (error) {
      results.push({ id, status: 'error', error });
    }
  }
  
  const failures = results.filter(r => r.status === 'error');
  if (failures.length > 0) {
    const firstError = failures[0].error;
    handleFirestoreError(firstError, OperationType.DELETE, PROJECTS_COLLECTION);
  }
};

export const batchCreateProjects = async (projects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[]) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const batch = writeBatch(db);
  const results: Project[] = [];
  
  for (const data of projects) {
    const projectId = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(7);
    const newProject: Project = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    batch.set(doc(db, PROJECTS_COLLECTION, projectId), newProject);
    results.push({ id: projectId, ...newProject });
  }
  
  try {
    await batch.commit();
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PROJECTS_COLLECTION);
    return [];
  }
};

export const uploadProjectImage = async (file: File): Promise<string> => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const timestamp = Date.now();
  const storageRef = ref(storage, `projects/${timestamp}_${file.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Project Image Upload Error:', error);
    throw error;
  }
};
