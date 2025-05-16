// SharedComponents.tsx - Components used by both teachers and students

import React from 'react';
import { User } from './types';
import { buttonStyles } from './styles';

interface NavbarProps {
  user: User;
  setView: (view: string) => void;
  handleLogout: () => void;
  fetchDocuments: () => void;
  fetchFlashcardSets: () => void;
  fetchAvailableDocuments: () => void;
  fetchStudyHistory: () => void;
  fetchLeaderboard: () => void;
}

// Navbar Component
export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  setView, 
  handleLogout,
  fetchDocuments,
  fetchFlashcardSets,
  fetchAvailableDocuments,
  fetchStudyHistory,
  fetchLeaderboard
}) => {
  return (
    <nav className="bg-indigo-700 text-white p-4 shadow-md transition-all">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">EduCards</div>
        <div className="flex space-x-4 items-center">
          {user.isTeacher ? (
            <>
              <button 
                className="hover:text-indigo-200 transition-colors"
                onClick={() => {
                  fetchDocuments();
                  setView('teacherDashboard');
                }}
              >
                Documents
              </button>
              <button 
                className="hover:text-indigo-200 transition-colors"
                onClick={() => setView('uploadDocument')}
              >
                Upload
              </button>
              <button 
                className="hover:text-indigo-200 transition-colors"
                onClick={() => {
                  fetchFlashcardSets();
                  setView('flashcardSets');
                }}
              >
                Flashcard Sets
              </button>
              <button 
                className="hover:text-indigo-200 transition-colors"
                onClick={() => {
                  fetchAvailableDocuments();
                  setView('studentDashboard');
                }}
              >
                Study Mode
              </button>
            </>
          ) : (
            <>
              <button 
                className="hover:text-indigo-200 transition-colors"
                onClick={() => {
                  fetchAvailableDocuments();
                  setView('studentDashboard');
                }}
              >
                Study
              </button>
              <button 
                className="hover:text-indigo-200 transition-colors"
                onClick={() => {
                  fetchStudyHistory();
                  setView('studyHistory');
                }}
              >
                History
              </button>
              <button 
                className="hover:text-indigo-200 transition-colors"
                onClick={() => {
                  fetchLeaderboard();
                  setView('leaderboard');
                }}
              >
                Leaderboard
              </button>
            </>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-indigo-200">
              {user.username} ({user.isTeacher ? 'Teacher' : 'Student'})
            </span>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface LoadingSpinnerProps {
  message?: string;
}

// Loading Spinner Component
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-3"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

interface EmptyStateProps {
  message: string;
  buttonText?: string;
  buttonAction?: () => void;
}

// Empty State Component
export const EmptyState: React.FC<EmptyStateProps> = ({ message, buttonText, buttonAction }) => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg animate-fade-in">
      <p className="text-gray-500 mb-4">{message}</p>
      {buttonText && buttonAction && (
        <button 
          className={buttonStyles.primary}
          onClick={buttonAction}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

interface FlashMessageProps {
  message: string;
}

// Flash Message Component
export const FlashMessage: React.FC<FlashMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md animate-fade-in-out z-50">
      {message}
    </div>
  );
};