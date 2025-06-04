import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from './client';
import type { UserProfile, Role, StudyMaterial } from '@/types';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Get User Profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return userDocSnap.data() as UserProfile;
  }
  return null;
};

// Update User Profile in Firestore
export const updateUserProfileDocument = async (uid: string, data: Partial<Omit<UserProfile, 'uid' | 'email'>>) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, { ...data, updatedAt: serverTimestamp() });
};

// Upload file to Firebase Storage and save metadata to Firestore
export const uploadMaterial = async (userId: string, file: File, metadata: Omit<StudyMaterial, 'id' | 'uploaderUid' | 'createdAt' | 'url' | 'filePath'>): Promise<StudyMaterial> => {
  const filePath = `users/${userId}/materials/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  const materialData: Omit<StudyMaterial, 'id'> = {
    ...metadata,
    uploaderUid: userId,
    url: downloadURL,
    filePath: filePath,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'materials'), materialData);
  return { id: docRef.id, ...materialData };
};

// Get user's materials
export const getUserMaterials = async (userId: string): Promise<StudyMaterial[]> => {
  const materialsCol = collection(db, 'materials');
  const q = query(materialsCol, where('uploaderUid', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyMaterial));
};

// Delete material (from Firestore and Storage)
export const deleteMaterial = async (material: StudyMaterial): Promise<void> => {
  if (material.filePath) {
    const storageRef = ref(storage, material.filePath);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.warn("Error deleting file from storage, it might not exist:", error);
      // Potentially ignore if file not found, or handle specific errors
    }
  }
  const materialDocRef = doc(db, 'materials', material.id);
  await deleteDoc(materialDocRef);
};


// Example for fetching summaries (adapt as needed)
export const getUserSummaries = async (userId: string) => {
  const summariesCol = collection(db, 'summaries');
  const q = query(summariesCol, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Example for saving a summary
export const saveSummary = async (userId: string, originalContentId: string, summaryText: string, title?: string) => {
  const summariesCol = collection(db, 'summaries');
  await addDoc(summariesCol, {
    userId,
    originalContentId, // ID of the material summarized
    title: title || "Summary",
    summary: summaryText,
    createdAt: serverTimestamp(),
  });
}

// Add more Firestore service functions here for quizzes, study plans, etc.
