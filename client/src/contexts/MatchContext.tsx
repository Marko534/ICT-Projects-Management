import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { matchQuestions, matchStudents } from '../mockData';
import { useAuth } from './AuthContext';

interface Question {
  question: string;
  correctIndex: number;
  answers: string[];
}

interface StudentSession {
  studentUID: string;
  studentName: string;
  totalCorrect: number;
  totalPoints: number;
  currentSubmissionIndex: number | null;
  currentSubmissionTime: number | null;
}

interface MatchResult {
  rank: number;
  points: number;
  correctAnswers: number;
}

interface MatchContextType {
  // Match state
  matchId: string | null;
  isMatchActive: boolean;
  isJoined: boolean;
  isProfessor: boolean;
  students: StudentSession[];
  
  // Question state
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionStartTime: number;
  selectedAnswer: number | null;
  correctAnswerIndex: number | null;
  timeRemaining: number;
  
  // Match results
  matchResults: MatchResult | null;
  
  // Actions
  joinMatch: (matchId: string) => void;
  startMatch: () => void;
  submitAnswer: (answerIndex: number) => void;
  leaveMatch: () => void;
}

const MatchContext = createContext<MatchContextType>({
  matchId: null,
  isMatchActive: false,
  isJoined: false,
  isProfessor: false,
  students: [],
  
  currentQuestion: null,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  questionStartTime: 0,
  selectedAnswer: null,
  correctAnswerIndex: null,
  timeRemaining: 0,
  
  matchResults: null,
  
  joinMatch: () => {},
  startMatch: () => {},
  submitAnswer: () => {},
  leaveMatch: () => {},
});

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Match state
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [students, setStudents] = useState<StudentSession[]>([]);
  
  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(10000); // 10 seconds
  
  // Match results
  const [matchResults, setMatchResults] = useState<MatchResult | null>(null);

  // Timer for question
  useEffect(() => {
    if (!isMatchActive || !currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 100);
        
        // When time runs out, reveal the correct answer
        if (newTime === 0) {
          setCorrectAnswerIndex(currentQuestion.correctIndex);
          
          // Move to next question after 3 seconds
          setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            
            if (nextIndex < totalQuestions) {
              setCurrentQuestionIndex(nextIndex);
              setCurrentQuestion(matchQuestions[nextIndex]);
              setSelectedAnswer(null);
              setCorrectAnswerIndex(null);
              setTimeRemaining(10000);
              setQuestionStartTime(Date.now());
            } else {
              // End of match
              setIsMatchActive(false);
              setMatchResults({
                rank: Math.floor(Math.random() * 3) + 1, // Random rank 1-3
                points: Math.floor(Math.random() * 300) + 200, // Random points 200-500
                correctAnswers: Math.floor(Math.random() * 4) + 2, // Random correct answers 2-5
              });
            }
          }, 3000);
        }
        
        return newTime;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [isMatchActive, currentQuestion, currentQuestionIndex, totalQuestions]);

  // Join a match
  const joinMatch = (id: string) => {
    setMatchId(id);
    setIsJoined(true);
    setIsProfessor(user?.role === 'professor');
    setStudents(matchStudents);
  };
  
  // Start the match
  const startMatch = () => {
    setIsMatchActive(true);
    setTotalQuestions(matchQuestions.length);
    setCurrentQuestionIndex(0);
    setCurrentQuestion(matchQuestions[0]);
    setQuestionStartTime(Date.now());
    setSelectedAnswer(null);
    setCorrectAnswerIndex(null);
    setTimeRemaining(10000);
    setMatchResults(null);
  };
  
  // Submit an answer
  const submitAnswer = (answerIndex: number) => {
    if (correctAnswerIndex !== null) return; // Can't change after reveal
    
    setSelectedAnswer(answerIndex);
    
    // For prototype, reveal correct answer after 1 second
    setTimeout(() => {
      if (currentQuestion) {
        setCorrectAnswerIndex(currentQuestion.correctIndex);
        
        // Move to next question after 3 seconds
        setTimeout(() => {
          const nextIndex = currentQuestionIndex + 1;
          
          if (nextIndex < totalQuestions) {
            setCurrentQuestionIndex(nextIndex);
            setCurrentQuestion(matchQuestions[nextIndex]);
            setSelectedAnswer(null);
            setCorrectAnswerIndex(null);
            setTimeRemaining(10000);
            setQuestionStartTime(Date.now());
          } else {
            // End of match
            setIsMatchActive(false);
            setMatchResults({
              rank: Math.floor(Math.random() * 3) + 1, // Random rank 1-3
              points: Math.floor(Math.random() * 300) + 200, // Random points 200-500
              correctAnswers: Math.floor(Math.random() * 4) + 2, // Random correct answers 2-5
            });
          }
        }, 3000);
      }
    }, 1000);
  };
  
  // Leave the match
  const leaveMatch = () => {
    setMatchId(null);
    setIsJoined(false);
    setIsMatchActive(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setCorrectAnswerIndex(null);
    setMatchResults(null);
  };
  
  return (
    <MatchContext.Provider
      value={{
        matchId,
        isMatchActive,
        isJoined,
        isProfessor,
        students,
        
        currentQuestion,
        currentQuestionIndex,
        totalQuestions,
        questionStartTime,
        selectedAnswer,
        correctAnswerIndex,
        timeRemaining,
        
        matchResults,
        
        joinMatch,
        startMatch,
        submitAnswer,
        leaveMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => useContext(MatchContext);