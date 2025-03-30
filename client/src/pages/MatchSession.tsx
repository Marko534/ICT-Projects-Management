import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../contexts/MatchContext';

const MatchSession: React.FC = () => {
  const navigate = useNavigate();
  const {
    matchId,
    isJoined,
    isProfessor,
    isMatchActive,
    students,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    correctAnswerIndex,
    timeRemaining,
    startMatch,
    submitAnswer,
    leaveMatch,
    matchResults
  } = useMatch();
  
  // Redirect if not joined a match
  useEffect(() => {
    if (!isJoined) {
      navigate('/dashboard');
    }
  }, [isJoined, navigate]);
  
  // Redirect to results when match ends and results are available
  useEffect(() => {
    if (matchResults) {
      navigate('/match/results');
    }
  }, [matchResults, navigate]);
  
  const handleLeaveMatch = () => {
    leaveMatch();
    navigate('/dashboard');
  };
  
  const handleSelectAnswer = (answerIndex: number) => {
    if (correctAnswerIndex !== null) return; // Don't allow changes after answer is revealed
    submitAnswer(answerIndex);
  };
  
  // Format time remaining
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${seconds}.${tenths}`;
  };
  
  // Professor view before match starts
  if (isProfessor && !isMatchActive) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Waiting for Students</h2>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Match ID: {matchId}
                </span>
                <button
                  onClick={handleLeaveMatch}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="text-center mb-6">
              <div className="bg-gray-100 p-6 rounded-lg inline-block">
                {/* This would be a QR code in a real implementation */}
                <div className="w-40 h-40 bg-gray-300 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-800">Scan to join</p>
                <p className="text-sm text-gray-600">or use code: {matchId}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Students Joined ({students.length})</h3>
              <div className="bg-white border rounded-md divide-y max-h-60 overflow-y-auto">
                {students.length > 0 ? (
                  students.map(student => (
                    <div key={student.studentUID} className="py-3 px-4">
                      {student.studentName}
                    </div>
                  ))
                ) : (
                  <div className="py-4 px-4 text-center text-gray-500">
                    No students have joined yet
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={startMatch}
                disabled={students.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Match
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Student view while waiting for professor to start
  if (!isProfessor && !isMatchActive) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Waiting for Professor</h2>
              <button
                onClick={handleLeaveMatch}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Leave
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 text-center">
            <div className="flex flex-col items-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">You've joined the match!</h3>
              <p className="text-gray-500">
                The match will begin once the professor starts it. Get ready!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Professor's view during active match
  if (isProfessor && isMatchActive) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Match in Progress
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <button
                  onClick={handleLeaveMatch}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  End Match
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Current Question:</h3>
                <p className="text-lg">{currentQuestion?.question}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion?.answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      correctAnswerIndex === index
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-white border border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 mr-2 font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Live Leaderboard</h3>
              <div className="bg-white border rounded-md divide-y max-h-80 overflow-y-auto">
                {students.sort((a, b) => b.totalPoints - a.totalPoints).map((student, index) => (
                  <div
                    key={student.studentUID}
                    className="py-3 px-4 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 mr-2 font-medium">
                        {index + 1}
                      </span>
                      <span>{student.studentName}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-green-600">{student.totalCorrect} correct</span>
                      <span className="font-bold">{student.totalPoints} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Student's view during active match
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-sm text-gray-500">
                of {totalQuestions}
              </p>
            </div>
            <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-800 font-medium">
              {formatTime(timeRemaining)}s
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-6">
            <p className="text-lg font-medium mb-4">{currentQuestion?.question}</p>
            
            <div className="space-y-3">
              {currentQuestion?.answers.map((answer, index) => {
                let bgColor = 'bg-white';
                let borderColor = 'border-gray-300';
                
                // Styling for selected answer
                if (selectedAnswer === index) {
                  if (correctAnswerIndex === null) {
                    // When answer is selected but not yet revealed
                    bgColor = 'bg-indigo-100';
                    borderColor = 'border-indigo-400';
                  } else if (index === correctAnswerIndex) {
                    // Correct answer
                    bgColor = 'bg-green-100';
                    borderColor = 'border-green-400';
                  } else {
                    // Incorrect selected answer
                    bgColor = 'bg-red-100';
                    borderColor = 'border-red-400';
                  }
                } else if (correctAnswerIndex !== null && index === correctAnswerIndex) {
                  // Show correct answer when revealed
                  bgColor = 'bg-green-100';
                  borderColor = 'border-green-400';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={correctAnswerIndex !== null}
                    className={`w-full p-4 rounded-lg border ${bgColor} ${borderColor} text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-90`}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 mr-3 font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{answer}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {correctAnswerIndex !== null && (
            <div className={`p-4 rounded-lg ${selectedAnswer === correctAnswerIndex ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-medium">
                {selectedAnswer === correctAnswerIndex
                  ? 'Correct! Well done.'
                  : `Incorrect. The correct answer is ${String.fromCharCode(65 + correctAnswerIndex)}.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchSession;