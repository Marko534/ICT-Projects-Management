export interface User {
  id: number;
  username: string;
  isTeacher: boolean;
  token: string;
}

export interface Document {
  id: number;
  title: string;
  uploadDate: string;
  isPublic: boolean;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  documentId: number;
}

export interface StudySession {
  id: number;
  startTime: string;
  endTime: string | null;
  score: number;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  totalScore: number;
  rank: number;
}

export interface FlashcardSet {
  id: number;
  title: string;
  description: string;
  cards: Flashcard[];
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isTeacher: boolean;
}

export interface DocumentFormData {
  title: string;
  file: File | null;
  isPublic: boolean;
}

export interface ProcessingFormData {
  documentId: number;
  numCards: number;
  difficulty: string;
}

export interface FlashcardSetFormData {
  title: string;
  description: string;
}

export interface NewFlashcardFormData {
  question: string;
  answer: string;
  difficulty: string;
}