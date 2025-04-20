// Mock data for frontend prototype

// User data
export const currentUser = {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'professor', // Change to 'student' to test student views
    profilePicture: 'https://via.placeholder.com/150',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z'
  };
  
  // Documents data
  export const documents = [
    {
      id: 'doc1',
      title: 'Introduction to Biology',
      description: 'Basic concepts of biology for beginners',
      uploadedBy: 'user1',
      fileUrl: '/mock-file.pdf',
      isPublic: true,
      processingStatus: 'completed',
      createdAt: '2023-03-10T14:30:00Z',
      updatedAt: '2023-03-10T14:30:00Z'
    },
    {
      id: 'doc2',
      title: 'Advanced Mathematics',
      description: 'Complex mathematical problems and solutions',
      uploadedBy: 'user1',
      fileUrl: '/mock-file.pdf',
      isPublic: true,
      processingStatus: 'completed',
      createdAt: '2023-02-15T11:45:00Z',
      updatedAt: '2023-02-15T11:45:00Z'
    },
    {
      id: 'doc3',
      title: 'World History Overview',
      description: 'Key events in world history',
      uploadedBy: 'user1',
      fileUrl: '/mock-file.pdf',
      isPublic: false,
      processingStatus: 'completed',
      createdAt: '2023-01-20T09:15:00Z',
      updatedAt: '2023-01-20T09:15:00Z'
    }
  ];
  
  // Flashcards data
  export const flashcards = [
    {
      id: 'card1',
      question: 'What is photosynthesis?',
      answer: 'The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.',
      documentId: 'doc1',
      isAIGenerated: true,
      difficulty: 'medium',
      createdAt: '2023-03-10T15:30:00Z',
      updatedAt: '2023-03-10T15:30:00Z'
    },
    {
      id: 'card2',
      question: 'What is the Pythagorean theorem?',
      answer: 'In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.',
      documentId: 'doc2',
      isAIGenerated: true,
      difficulty: 'easy',
      createdAt: '2023-02-15T12:45:00Z',
      updatedAt: '2023-02-15T12:45:00Z'
    },
    {
      id: 'card3',
      question: 'When did World War II end?',
      answer: 'World War II ended in 1945.',
      documentId: 'doc3',
      isAIGenerated: true,
      difficulty: 'easy',
      createdAt: '2023-01-20T10:15:00Z',
      updatedAt: '2023-01-20T10:15:00Z'
    },
    {
      id: 'card4',
      question: 'What is cellular respiration?',
      answer: 'The process by which cells break down glucose and other food molecules to produce energy in the form of ATP.',
      documentId: 'doc1',
      isAIGenerated: true,
      difficulty: 'hard',
      createdAt: '2023-03-11T09:30:00Z',
      updatedAt: '2023-03-11T09:30:00Z'
    },
    {
      id: 'card5',
      question: 'What is the quadratic formula?',
      answer: 'x = (-b ± √(b² - 4ac)) / 2a, where ax² + bx + c = 0',
      documentId: 'doc2',
      isAIGenerated: true,
      difficulty: 'medium',
      createdAt: '2023-02-16T14:20:00Z',
      updatedAt: '2023-02-16T14:20:00Z'
    }
  ];
  
  // Flashcard sets data
  export const flashcardSets = [
    {
      id: 'set1',
      name: 'Biology Basics',
      description: 'Essential biology concepts',
      createdBy: 'user1',
      flashcards: [flashcards[0], flashcards[3]],
      createdAt: '2023-03-15T14:00:00Z',
      updatedAt: '2023-03-15T14:00:00Z'
    },
    {
      id: 'set2',
      name: 'Math Fundamentals',
      description: 'Core mathematical principles',
      createdBy: 'user1',
      flashcards: [flashcards[1], flashcards[4]],
      createdAt: '2023-02-20T11:30:00Z',
      updatedAt: '2023-02-20T11:30:00Z'
    },
    {
      id: 'set3',
      name: 'History Facts',
      description: 'Important historical events',
      createdBy: 'user1',
      flashcards: [flashcards[2]],
      createdAt: '2023-01-25T10:00:00Z',
      updatedAt: '2023-01-25T10:00:00Z'
    }
  ];
  
  // Match questions data
  export const matchQuestions = [
    {
      question: 'What is photosynthesis?',
      correctIndex: 2,
      answers: [
        'Breaking down of food to release energy',
        'Process of water movement in plants',
        'Process by which plants make food using sunlight',
        'Exchange of gases in plants'
      ]
    },
    {
      question: 'What is the Pythagorean theorem?',
      correctIndex: 1,
      answers: [
        'The sum of all angles in a triangle is 180 degrees',
        'In a right-angled triangle, a² + b² = c²',
        'The area of a triangle is half the product of its base and height',
        'Two triangles are similar if their corresponding angles are equal'
      ]
    },
    {
      question: 'When did World War II end?',
      correctIndex: 0,
      answers: [
        '1945',
        '1939',
        '1950',
        '1918'
      ]
    },
    {
      question: 'What is cellular respiration?',
      correctIndex: 3,
      answers: [
        'The process of cell division',
        'The movement of water through a cell membrane',
        'The production of proteins in a cell',
        'The process by which cells produce energy from glucose'
      ]
    },
    {
      question: 'What is the quadratic formula?',
      correctIndex: 1,
      answers: [
        'y = mx + b',
        'x = (-b ± √(b² - 4ac)) / 2a',
        'E = mc²',
        'a² + b² = c²'
      ]
    }
  ];
  
  // Student data for match
  export const matchStudents = [
    {
      studentUID: 'student1',
      studentName: 'Alice Johnson',
      totalCorrect: 3,
      totalPoints: 280,
      currentSubmissionIndex: null,
      currentSubmissionTime: null
    },
    {
      studentUID: 'student2',
      studentName: 'Bob Smith',
      totalCorrect: 4,
      totalPoints: 350,
      currentSubmissionIndex: null,
      currentSubmissionTime: null
    },
    {
      studentUID: 'student3',
      studentName: 'Carol Williams',
      totalCorrect: 2,
      totalPoints: 180,
      currentSubmissionIndex: null,
      currentSubmissionTime: null
    },
    {
      studentUID: 'student4',
      studentName: 'Dave Brown',
      totalCorrect: 5,
      totalPoints: 420,
      currentSubmissionIndex: null,
      currentSubmissionTime: null
    },
    {
      studentUID: 'student5',
      studentName: 'Eve Davis',
      totalCorrect: 4,
      totalPoints: 300,
      currentSubmissionIndex: null,
      currentSubmissionTime: null
    }
  ];
  
  // Study sessions data
  export const studySessions = [
    {
      id: 'session1',
      userId: 'user1',
      flashcardSetId: 'set1',
      startTime: '2023-03-20T13:00:00Z',
      endTime: '2023-03-20T13:30:00Z',
      score: 85,
      totalCorrect: 17,
      totalAnswered: 20,
      createdAt: '2023-03-20T13:00:00Z',
      updatedAt: '2023-03-20T13:30:00Z'
    },
    {
      id: 'session2',
      userId: 'user1',
      flashcardSetId: 'set2',
      startTime: '2023-03-18T16:00:00Z',
      endTime: '2023-03-18T16:45:00Z',
      score: 90,
      totalCorrect: 18,
      totalAnswered: 20,
      createdAt: '2023-03-18T16:00:00Z',
      updatedAt: '2023-03-18T16:45:00Z'
    }
  ];
  
  // Leaderboard data
  export const leaderboardData = [
    {
      userId: 'student1',
      userName: 'Alice Johnson',
      profilePicture: 'https://via.placeholder.com/50',
      score: 920,
      correctAnswers: 45,
      totalQuestions: 50
    },
    {
      userId: 'student2',
      userName: 'Bob Smith',
      profilePicture: 'https://via.placeholder.com/50',
      score: 880,
      correctAnswers: 44,
      totalQuestions: 50
    },
    {
      userId: 'student3',
      userName: 'Carol Williams',
      profilePicture: 'https://via.placeholder.com/50',
      score: 840,
      correctAnswers: 42,
      totalQuestions: 50
    },
    {
      userId: 'student4',
      userName: 'Dave Brown',
      profilePicture: 'https://via.placeholder.com/50',
      score: 800,
      correctAnswers: 40,
      totalQuestions: 50
    },
    {
      userId: 'student5',
      userName: 'Eve Davis',
      profilePicture: 'https://via.placeholder.com/50',
      score: 760,
      correctAnswers: 38,
      totalQuestions: 50
    }
  ];