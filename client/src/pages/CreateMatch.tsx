import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../contexts/MatchContext';
import { flashcardSets } from '../mockData';

const CreateMatch: React.FC = () => {
  const navigate = useNavigate();
  const { joinMatch } = useMatch();
  
  const [name, setName] = useState('');
  const [selectedSetId, setSelectedSetId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a match name');
      return;
    }
    
    if (!selectedSetId) {
      setError('Please select a flashcard set');
      return;
    }
    
    setIsCreating(true);
    setError(null);
    
    try {
      // In the prototype, we'll generate a random ID
      const matchId = 'match_' + Math.random().toString(36).substr(2, 9);
      
      // Join the match as professor
      joinMatch(matchId);
      
      // Navigate to match session
      navigate('/match/session');
    } catch (err) {
      setError('Failed to create match. Please try again.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create Real-Time Match
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Create a real-time match session for your students to join and compete.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Match Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Give your match a descriptive name that students will recognize.
              </p>
            </div>
            
            <div>
              <label htmlFor="flashcard-set" className="block text-sm font-medium text-gray-700">
                Flashcard Set
              </label>
              <select
                id="flashcard-set"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
                required
              >
                <option value="">Select a flashcard set</option>
                {flashcardSets.map(set => (
                  <option key={set.id} value={set.id}>
                    {set.name} ({set.flashcards.length} cards)
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select the flashcard set to use for this match.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isCreating ? 'Creating...' : 'Create Match'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMatch;