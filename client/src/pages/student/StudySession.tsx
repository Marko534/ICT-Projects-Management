import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import { useParams, useNavigate } from 'react-router-dom';
import { flashcardAPI, studyAPI } from '../../services/api';
import axios from 'axios';

const StudySession: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [completed, setCompleted] = useState<boolean>(false);
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (documentId) {
      fetchFlashcards();
    }
  }, [documentId]);

  const fetchFlashcards = async (): Promise<void> => {
    if (!documentId) return;
    
    try {
      setLoading(true);
      const response = await flashcardAPI.getFlashcards(documentId);
      
      if (response.data.length === 0) {
        setLoading(false);
        return;
      }
      
      setFlashcards(response.data);
      
      // Start a study session
      const flashcardIds = response.data.map((card: Flashcard) => card.id);
      const sessionResponse = await studyAPI.startSession(flashcardIds);
      setSessionId(sessionResponse.data.session_id);
      setStartTime(Date.now());
      setLoading(false);
    } catch (error) {
      console.error('Error starting study session:', error);
      setLoading(false);
    }
  };

  const handleAnswer = async (isCorrect: boolean): Promise<void> => {
    if (!sessionId || currentIndex >= flashcards.length) return;
    
    const timeTaken = (Date.now() - startTime) / 1000; // convert to seconds
    const currentCard = flashcards[currentIndex];
    
    try {
      await studyAPI.recordAnswer(sessionId, currentCard.id, isCorrect, timeTaken);
      
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
        setStartTime(Date.now());
      } else {
        // End session when all cards are completed
        endSession();
      }
    } catch (error) {
      console.error('Error recording answer:', error);
      // Continue to next card even if there's an error
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
        setStartTime(Date.now());
      } else {
        endSession();
      }
    }
  };

  // Function to end session - properly matching the backend API expectations
  const endSession = async (): Promise<void> => {
    // Set completed state immediately for UI
    setCompleted(true);
    
    if (!sessionId) return;
    
    try {
      // Get the auth token
      const userStr = localStorage.getItem('educards_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user || !user.token) return;
      
      // Direct axios call with exact expected format
      await axios({
        method: 'post',
        url: `/api/study/${sessionId}/end/`,
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json'
        },
        // Empty body - the API doesn't expect any data
        data: {}
      });
      
      console.log("Session ended successfully");
    } catch (error) {
      // Log but don't block UI
      console.error("Background session end error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Study Session Complete!</h1>
          <p className="text-lg text-gray-600 mb-6">Great job! You've completed your study session.</p>
          <div className="flex justify-center space-x-4">
            <button 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-200"
              onClick={() => navigate('/student/leaderboard')}
            >
              View Leaderboard
            </button>
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
              onClick={() => navigate('/student/dashboard')}
            >
              Study Another Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>No flashcards available for this document.</p>
        <button 
          className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/student/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Study Session</h1>
        <div className="text-gray-600 font-medium">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>
      
      <div className="card-container">
        <div className={`card-flip ${flipped ? 'flipped' : ''}`}>
          <div className="card-front">
            <div className="bg-primary-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-medium">Question</h2>
            </div>
            <div className="p-6 flex-grow bg-white rounded-b-lg">
              {currentCard.question}
            </div>
            <div className="p-4 bg-white rounded-b-lg text-center">
              <button 
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition duration-200 transform hover:scale-105"
                onClick={() => setFlipped(true)}
              >
                Reveal Answer
              </button>
            </div>
          </div>
          
          <div className="card-back">
            <div className="bg-green-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-medium">Answer</h2>
            </div>
            <div className="p-6 flex-grow bg-white">
              {currentCard.answer}
            </div>
            <div className="bg-gray-100 p-4 rounded-b-lg">
              <p className="mb-4 text-center font-medium">How did you do?</p>
              <div className="flex justify-center space-x-4">
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 transform hover:scale-105"
                  onClick={() => handleAnswer(false)}
                >
                  Got it Wrong
                </button>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 transform hover:scale-105"
                  onClick={() => handleAnswer(true)}
                >
                  Got it Right
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          onClick={endSession}
        >
          End Session
        </button>
        <div className="text-gray-600 font-medium">
          Difficulty: <span className="font-semibold">{currentCard.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default StudySession;