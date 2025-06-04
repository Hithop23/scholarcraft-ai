import type { User as FirebaseUser } from 'firebase/auth';

export type Role = 'student' | 'teacher' | 'admin';

export interface UserProfile extends FirebaseUser {
  role: Role;
  firstName?: string;
  lastName?: string;
  // Add other profile fields like progress, schedules, stats as needed
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface StudyMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'document';
  url?: string; // For links or storage URLs
  filePath?: string; // For files in Firebase Storage
  uploaderUid: string;
  createdAt: Date;
  topic?: string;
}
