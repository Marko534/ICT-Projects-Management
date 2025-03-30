import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../contexts/MatchContext';
import { useAuth } from '../contexts/AuthContext';

const MatchResults: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    matchResults,
    isProfessor,
    students,
    isJoined,
    leaveMatch
  } = useMatch();
  
  // Redirect if no match data or not joined
  useEffect(() => {
    if (!matchResults && !isProfessor) {
      navigate('/dashboard');
    }
  }, [matchResults, isProfessor, navigate]);
  
  const handleBackToDashboard = () => {
    leaveMatch();
    navigate('/dashboard');
  };
  
  const handleCreateNewMatch = () => {
    leaveMatch();
    navigate('/match/create');
  };
  
  // If not joined a match, redirect
  if (!isJoined) {
    return null;
  }
  
  // For professors, show all student results
  if (isProfessor) {
    // Sort students by points (highest first)
    const sortedStudents = [...(students || [])].sort((a, b) => b.totalPoints - a.totalPoints);
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Match Results
            </h2>
            <p className="text-sm text-gray-500">
              The match has ended. Here are the final results.
            </p>
          </div>
          
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Final Leaderboard</h3>
            
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rank
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Correct Answers
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedStudents.map((student, index) => (
                    <tr key={student.studentUID} className={index < 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.totalCorrect}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {student.totalPoints}
                      </td>
                    </tr>
                  ))}
                  
                  {sortedStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        No student data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={handleCreateNewMatch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Match
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // For students, show their individual results
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Match Complete!
          </h2>
          <p className="text-sm text-gray-500">
            Here's how you did.
          </p>
        </div>
        
        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-4">
              <span className="text-3xl font-bold text-indigo-800">
                #{matchResults?.rank || '-'}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-1">
              {user?.firstName || 'Student'}
            </h3>
            <p className="text-gray-600">Your final position</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm mb-1">Points</p>
              <p className="text-2xl font-bold">{matchResults?.points || 0}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm mb-1">Correct Answers</p>
              <p className="text-2xl font-bold">{matchResults?.correctAnswers || 0}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Keep practicing to improve your score! Check out more flashcard sets to study.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-center">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;