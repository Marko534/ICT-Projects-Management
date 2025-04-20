import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatch } from '../contexts/MatchContext';

const JoinMatch: React.FC = () => {
  const navigate = useNavigate();
  const { matchId: urlMatchId } = useParams<{ matchId?: string }>();
  const { joinMatch, isJoined } = useMatch();
  
  const [matchCode, setMatchCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // If a match ID is provided in the URL, join that match
  useEffect(() => {
    if (urlMatchId) {
      handleJoinMatch(urlMatchId);
    }
  }, [urlMatchId]);
  
  // Redirect if already joined a match
  useEffect(() => {
    if (isJoined) {
      navigate('/match/session');
    }
  }, [isJoined, navigate]);
  
  const handleJoinMatch = async (matchIdToJoin: string) => {
    setIsJoining(true);
    setError(null);
    
    try {
      // For prototype, we'll always succeed
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      joinMatch(matchIdToJoin);
    } catch (err) {
      console.error(err);
      setError('Failed to join match. The match may have ended or does not exist.');
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matchCode.trim()) {
      setError('Please enter a match code');
      return;
    }
    
    handleJoinMatch(matchCode);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Join a Match
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Enter a match code or scan a QR code to join a real-time match.
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
              <label htmlFor="match-code" className="block text-sm font-medium text-gray-700">
                Match Code
              </label>
              <input
                type="text"
                id="match-code"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={matchCode}
                onChange={(e) => setMatchCode(e.target.value)}
                placeholder="Enter match code"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the code provided by your professor.
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isJoining}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isJoining ? 'Joining...' : 'Join Match'}
              </button>
            </div>
          </form>
          
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Or scan a QR code
            </h4>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-500 text-center">
                QR scanner would be implemented here
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Scan QR Code
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinMatch;