import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import { useParams, useNavigate } from 'react-router-dom';
import { flashcardAPI } from '../../services/api';

const ViewFlashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
        <button 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/teacher/dashboard')}
        >
          Back to Documents
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : flashcards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No flashcards found for this document.</p>
          {documentId && (
            <button 
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
              onClick={() => navigate(`/teacher/process/${documentId}`)}
            >
              Generate Flashcards
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl">
              <div className="bg-primary-600 text-white p-3">
                <h3 className="font-medium">Question</h3>
              </div>
              <div className="p-4 border-b min-h-[100px]">
                <p>{card.question}</p>
              </div>
              <div className="bg-green-600 text-white p-3">
                <h3 className="font-medium">Answer</h3>
              </div>
              <div className="p-4 min-h-[100px]">
                <p>{card.answer}</p>
              </div>
              <div className="bg-gray-100 p-3 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${difficultyColor(card.difficulty)}`}>
                  {card.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFlashcards;