// StudentComponents.tsx - Student specific components

import React from 'react';
import { 
  Document, 
  Flashcard, 
  LeaderboardEntry, 
  StudySession 
} from './types';
import { buttonStyles, cardStyles } from './styles';
import { EmptyState, LoadingSpinner } from './SharedComponents';

interface StudentDashboardProps {
  documents: Document[];
  loading: boolean;
  startStudySession: (documentId: number) => Promise<void>;
}

// Student Dashboard Component
export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  documents, 
  loading, 
  startStudySession 
}) => {
  const title = "Available Study Materials";
  
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      {loading ? (
        <LoadingSpinner message="Loading documents..." />
      ) : documents.length === 0 ? (
        <EmptyState message="No documents available yet. Check back later!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div key={doc.id} className={`${cardStyles.container} hover:-translate-y-1`}>
              <h3 className={cardStyles.header}>{doc.title}</h3>
              <p className={cardStyles.meta}>Added: {new Date(doc.uploadDate).toLocaleDateString()}</p>
              <div className="mt-4">
                <button 
                  className={`w-full ${buttonStyles.success}`}
                  onClick={() => startStudySession(doc.id)}
                >
                  Start Studying
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface StudySessionProps {
  flashcards: Flashcard[];
  currentFlashcard: number;
  flipped: boolean;
  setFlipped: (flipped: boolean) => void;
  recordAnswer: (flashcardId: number, isCorrect: boolean, timeTaken: number) => void;
  endStudySession: () => void;
  startTime: number;
  setView: (view: string) => void;
}

// Study Session Component
export const StudySessionComponent: React.FC<StudySessionProps> = ({ 
  flashcards, 
  currentFlashcard, 
  flipped, 
  setFlipped,
  recordAnswer,
  endStudySession,
  startTime,
  setView
}) => {
  if (flashcards.length === 0 || currentFlashcard >= flashcards.length) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <p>No flashcards available or study session complete.</p>
        <button 
          className={`mt-4 ${buttonStyles.primary}`}
          onClick={() => setView('studentDashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const card = flashcards[currentFlashcard];
  
  const handleAnswer = (correct: boolean) => {
    const timeTaken = (Date.now() - startTime) / 1000; // convert to seconds
    recordAnswer(card.id, correct, timeTaken);
    setFlipped(false);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Session</h1>
        <div className="text-gray-600">
          Card {currentFlashcard + 1} of {flashcards.length}
        </div>
      </div>
      
      <div className="card-container">
        <div className={`card-flip ${flipped ? 'flipped' : ''}`}>
          <div className="card-front">
            <div className="bg-indigo-600 text-white p-4">
              <h2 className="text-xl font-medium">Question</h2>
            </div>
            <div className="p-6 text-lg flex-grow overflow-auto">
              {card.question}
            </div>
            <div className="p-4 flex justify-center bg-white">
              <button 
                className={`${buttonStyles.primary} transform hover:scale-105`}
                onClick={() => setFlipped(true)}
              >
                Reveal Answer
              </button>
            </div>
          </div>
          
          <div className="card-back">
            <div className="bg-green-600 text-white p-4">
              <h2 className="text-xl font-medium">Answer</h2>
            </div>
            <div className="p-6 text-lg flex-grow overflow-auto">
              {card.answer}
            </div>
            <div className="bg-gray-100 p-4">
              <p className="mb-4 text-center">How did you do?</p>
              <div className="flex justify-center space-x-4">
                <button 
                  className={`${buttonStyles.danger} transform hover:scale-105`}
                  onClick={() => handleAnswer(false)}
                >
                  Got it Wrong
                </button>
                <button 
                  className={`${buttonStyles.success} transform hover:scale-105`}
                  onClick={() => handleAnswer(true)}
                >
                  Got it Right
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => endStudySession()}
        >
          End Session
        </button>
        <div className="text-gray-600">
          Difficulty: <span className="font-medium">{card.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

interface StudyHistoryProps {
  studySessions: StudySession[];
  loading: boolean;
}

// Study History Component
export const StudyHistory: React.FC<StudyHistoryProps> = ({ studySessions, loading }) => {
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Study History</h1>
      
      {loading ? (
        <LoadingSpinner message="Loading history..." />
      ) : studySessions.length === 0 ? (
        <EmptyState message="No study sessions yet. Start studying to see your progress!" />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studySessions.map(session => {
                const startTime = new Date(session.startTime);
                const endTime = session.endTime ? new Date(session.endTime) : null;
                const duration = endTime 
                  ? ((endTime.getTime() - startTime.getTime()) / 60000).toFixed(1) 
                  : 'In Progress';
                
                return (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{startTime.toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{duration} min</td>
                    <td className="px-6 py-4 whitespace-nowrap">{session.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  username: string | undefined;
}

// Leaderboard Component
export const LeaderboardComponent: React.FC<LeaderboardProps> = ({ leaderboard, loading, username }) => {
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      
      {loading ? (
        <LoadingSpinner message="Loading leaderboard..." />
      ) : leaderboard.length === 0 ? (
        <EmptyState message="No leaderboard data yet. Be the first to make the list!" />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map(entry => (
                <tr 
                  key={entry.id} 
                  className={`${entry.username === username ? 'bg-indigo-50' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.rank === 1 && <span className="text-yellow-500">🏆</span>}
                    {entry.rank === 2 && <span className="text-gray-400">🥈</span>}
                    {entry.rank === 3 && <span className="text-amber-600">🥉</span>}
                    {entry.rank > 3 && entry.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {entry.username} {entry.username === username && '(You)'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

interface StudyResultsProps {
  fetchLeaderboard: () => void;
  fetchAvailableDocuments: () => void;
  setView: (view: string) => void;
}

// Study Results Component
export const StudyResults: React.FC<StudyResultsProps> = ({ 
  fetchLeaderboard, 
  fetchAvailableDocuments, 
  setView 
}) => {
  return (
    <div className="container mx-auto p-4 max-w-2xl animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Study Session Complete!</h1>
        <p className="text-lg mb-6">Great job! You've completed your study session.</p>
        
        <div className="flex justify-center space-x-4">
          <button 
            className={buttonStyles.primary}
            onClick={() => {
              fetchLeaderboard();
              setView('leaderboard');
            }}
          >
            View Leaderboard
          </button>
          <button 
            className={buttonStyles.success}
            onClick={() => {
              fetchAvailableDocuments();
              setView('studentDashboard');
            }}
          >
            Study Another Topic
          </button>
        </div>
      </div>
    </div>
  );
};