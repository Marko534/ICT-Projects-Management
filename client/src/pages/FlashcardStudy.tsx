import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flashcardSets } from '../mockData';

const FlashcardStudy: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  
  const [flashcardSet, setFlashcardSet] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Load flashcard set
  useEffect(() => {
    if (setId) {
      const set = flashcardSets.find(set => set.id === setId);
      if (set) {
        setFlashcardSet(set);
      } else {
        navigate('/dashboard');
      }
    }
  }, [setId, navigate]);
  
  const currentCard = flashcardSet?.flashcards[currentIndex];
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNext = () => {
    if (currentIndex < flashcardSet.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };
  
  const handleCorrect = () => {
    setCorrectCount(correctCount + 1);
    handleNext();
  };
  
  const handleIncorrect = () => {
    setIncorrectCount(incorrectCount + 1);
    handleNext();
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsCompleted(false);
  };
  
  if (!flashcardSet) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading flashcards...</p>
      </div>
    );
  }
  
  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Study Session Complete!
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              You've completed studying "{flashcardSet.name}".
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h4 className="text-lg font-medium text-green-800 mb-2">Correct</h4>
                <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <h4 className="text-lg font-medium text-red-800 mb-2">Incorrect</h4>
                <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Your Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${(correctCount / flashcardSet.flashcards.length) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                You got {correctCount} out of {flashcardSet.flashcards.length} cards correct.
                ({Math.round((correctCount / flashcardSet.flashcards.length) * 100)}%)
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleRestart}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Study Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{flashcardSet.name}</h1>
        <div className="text-sm text-gray-500">
          Card {currentIndex + 1} of {flashcardSet.flashcards.length}
        </div>
      </div>
      
      <div 
        className={`bg-white shadow overflow-hidden sm:rounded-lg cursor-pointer transition-all duration-300 transform ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ minHeight: '300px' }}
        onClick={handleFlip}
      >
        <div className="px-4 py-5 sm:p-6 h-full flex flex-col justify-center">
          <div className="text-center">
            {!isFlipped ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Question</h3>
                <p className="text-xl">{currentCard.question}</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Answer</h3>
                <p className="text-xl">{currentCard.answer}</p>
              </>
            )}
            <p className="mt-4 text-sm text-gray-500">Click the card to flip</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Previous
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={handleIncorrect}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Incorrect
          </button>
          <button
            onClick={handleCorrect}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Correct
          </button>
        </div>
        
        <button
          onClick={handleNext}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
      
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${((currentIndex + 1) / flashcardSet.flashcards.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudy;