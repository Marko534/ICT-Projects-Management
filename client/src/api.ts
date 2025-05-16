// api.ts - Centralized API functions

import axios from 'axios';
import { 
  DocumentFormData, 
  FlashcardSetFormData, 
  NewFlashcardFormData, 
  ProcessingFormData, 
  User 
} from './types';

// API URL
export const API_URL = 'http://localhost:8000/api';

// Setup axios with auth token
export const setupAxios = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Token ${token}`;
};

// Clear axios auth token
export const clearAxios = () => {
  delete axios.defaults.headers.common['Authorization'];
};

// Auth API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    return axios.post(`${API_URL}/accounts/login-custom/`, { username, password });
  },
  
  register: async (data: RegisterFormData) => {
    return axios.post(`${API_URL}/accounts/register/`, {
      username: data.username,
      email: data.email,
      password: data.password,
      password_confirm: data.confirmPassword,
      is_teacher: data.isTeacher
    });
  },
  
  getProfile: async () => {
    return axios.get(`${API_URL}/accounts/profile/`);
  }
};

// Document API calls
export const documentAPI = {
  getDocuments: async () => {
    return axios.get(`${API_URL}/documents/`);
  },
  
  uploadDocument: async (data: DocumentFormData, userId: number) => {
    const formData = new FormData();
    if (data.file) {
      formData.append('file', data.file);
    }
    formData.append('title', data.title);
    formData.append('is_public', data.isPublic.toString());
    formData.append('teacher', userId.toString());
    
    return axios.post(`${API_URL}/documents/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteDocument: async (documentId: number) => {
    return axios.delete(`${API_URL}/documents/${documentId}/delete/`);
  },
  
  processDocument: async (documentId: number, data: ProcessingFormData) => {
    return axios.post(`${API_URL}/documents/${documentId}/process/`, {
      num_cards: data.numCards,
      difficulty: data.difficulty
    });
  }
};

// Flashcard API calls
export const flashcardAPI = {
  getFlashcards: async (documentId: number) => {
    return axios.get(`${API_URL}/flashcards/document/${documentId}/`);
  },
  
  getFlashcardSets: async () => {
    return axios.get(`${API_URL}/flashcards/sets/`);
  },
  
  getFlashcardSet: async (setId: number) => {
    return axios.get(`${API_URL}/flashcards/sets/${setId}/`);
  },
  
  createFlashcardSet: async (data: FlashcardSetFormData) => {
    const payload: any = {
      title: data.title,
      description: data.description
    };
    
    if (data.documentId) {
      payload.document_id = data.documentId;
    }
    
    return axios.post(`${API_URL}/flashcards/sets/create/`, payload);
  },
  
  addFlashcard: async (setId: number, data: NewFlashcardFormData) => {
    return axios.post(`${API_URL}/flashcards/create/`, {
      question: data.question,
      answer: data.answer,
      difficulty: data.difficulty,
      set_id: setId
    });
  },
  
  updateFlashcard: async (cardId: number, data: EditFlashcardFormData) => {
    return axios.put(`${API_URL}/flashcards/${cardId}/update/`, {
      question: data.question,
      answer: data.answer,
      difficulty: data.difficulty
    });
  },
  
  deleteFlashcard: async (cardId: number) => {
    return axios.delete(`${API_URL}/flashcards/${cardId}/delete/`);
  }
};

// Study API calls
export const studyAPI = {
  startSession: async (flashcardIds: number[]) => {
    return axios.post(`${API_URL}/study/start/`, {
      flashcard_ids: flashcardIds
    });
  },
  
  recordAnswer: async (sessionId: number, flashcardId: number, isCorrect: boolean, timeTaken: number) => {
    return axios.post(`${API_URL}/study/${sessionId}/answer/`, {
      flashcard_id: flashcardId,
      is_correct: isCorrect,
      time_taken: timeTaken
    });
  },
  
  endSession: async (sessionId: number) => {
    return axios.post(`${API_URL}/study/${sessionId}/end/`);
  },
  
  getHistory: async () => {
    return axios.get(`${API_URL}/study/history/`);
  }
};

// Leaderboard API calls
export const leaderboardAPI = {
  getLeaderboard: async () => {
    return axios.get(`${API_URL}/leaderboard/`);
  },
  
  exportLeaderboard: async () => {
    return axios.get(`${API_URL}/leaderboard/export/`);
  }
};