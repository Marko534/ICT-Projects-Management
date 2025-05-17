export interface User {
  id: number;
  username: string;
  isTeacher: boolean;
  isStudent: boolean;
  token: string;
}

export interface Document {
  id: number;
  title: string;
  upload_date: string;
  file_path?: string;
  teacher?: number;
  teacher_name?: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  document: number;
}

export interface StudySession {
  id: number;
  start_time: string;
  end_time: string | null;
  score: number;
  correct_count: number;
  total_count: number;
}

export interface LeaderboardEntry {
  id: number;
  student: number;
  student_name: string;
  total_score: number;
  total_sessions: number;
  rank: number;
  last_updated: string;
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

export interface ProcessingFormData {
  numCards: number;
  difficulty: string;
}