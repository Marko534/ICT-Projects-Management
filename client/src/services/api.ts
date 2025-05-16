import axios, { AxiosResponse } from 'axios';
import { 
  Document, 
  LoginFormData, 
  ProcessingFormData, 
  RegisterFormData,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Set up axios with auth token
export const setupAxios = (token: string): void => {
  axios.defaults.headers.common['Authorization'] = `Token ${token}`;
};

// Clear axios auth token
export const clearAxios = (): void => {
  delete axios.defaults.headers.common['Authorization'];
};

// Auth API calls
export const authAPI = {
  login: async (username: string, password: string): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}/accounts/login-custom/`, { username, password });
  },
  
  register: async (data: RegisterFormData): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}/accounts/register/`, {
      username: data.username,
      email: data.email,
      password: data.password,
      password_confirm: data.confirmPassword,
      is_teacher: data.isTeacher
    });
  },
  
  getProfile: async (): Promise<AxiosResponse> => {
    return axios.get(`${API_URL}/accounts/profile/`);
  }
};

// Document API calls
export const documentAPI = {
  getDocuments: async (): Promise<AxiosResponse<Document[]>> => {
    return axios.get(`${API_URL}/documents/`);
  },
  
  uploadDocument: async (formData: FormData): Promise<AxiosResponse<Document>> => {
    return axios.post(`${API_URL}/documents/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  processDocument: async (documentId: string, data: ProcessingFormData): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}/documents/${documentId}/process/`, {
      num_cards: data.numCards,
      difficulty: data.difficulty
    });
  }
};

// Flashcard API calls
export const flashcardAPI = {
  getFlashcards: async (documentId: string): Promise<AxiosResponse> => {
    return axios.get(`${API_URL}/flashcards/document/${documentId}/`);
  }
};

// Study API calls
export const studyAPI = {
  startSession: async (flashcardIds: number[]): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}/study/start/`, {
      flashcard_ids: flashcardIds
    });
  },
  
  recordAnswer: async (sessionId: number, flashcardId: number, isCorrect: boolean, timeTaken: number): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}/study/${sessionId}/answer/`, {
      flashcard_id: flashcardId,
      is_correct: isCorrect,
      time_taken: timeTaken
    });
  },
  
  endSession: async (sessionId: number): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}/study/${sessionId}/end/`);
  },
  
  getHistory: async (): Promise<AxiosResponse> => {
    return axios.get(`${API_URL}/study/history/`);
  }
};

// Leaderboard API calls
export const leaderboardAPI = {
  getLeaderboard: async (): Promise<AxiosResponse> => {
    return axios.get(`${API_URL}/leaderboard/`);
  }
};