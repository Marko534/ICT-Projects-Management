import React, { useState, useEffect } from 'react';
import { 
  Document, 
  DocumentFormData, 
  Flashcard, 
  FlashcardSet, 
  FlashcardSetFormData, 
  LeaderboardEntry, 
  NewFlashcardFormData, 
  ProcessingFormData, 
  StudySession, 
  User 
} from './types';
import { 
  API_URL,
  authAPI, 
  clearAxios, 
  documentAPI, 
  flashcardAPI, 
  leaderboardAPI, 
  setupAxios, 
  studyAPI 
} from './api';
import { LoginForm, RegisterForm } from './AuthComponents';
import { EmptyState, FlashMessage, Navbar } from './SharedComponents';
import { 
  CreateFlashcardSet, 
  EditFlashcardSet, 
  FlashcardSets, 
  ProcessDocument, 
  TeacherDashboard, 
  UploadDocument, 
  ViewFlashcards 
} from './TeacherComponents';
import { 
  LeaderboardComponent, 
  StudentDashboard, 
  StudyHistory, 
  StudyResults, 
  StudySessionComponent 
} from './StudentComponents';
import { animationStyles } from './styles';
import axios from 'axios';

function App() {
  // User and view state
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>('login');
  
  // Data states
  const [documents, setDocuments] = useState<Document[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<number | null>(null);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [currentFlashcardSet, setCurrentFlashcardSet] = useState<FlashcardSet | null>(null);
  
  // States for the study session
  const [flipped, setFlipped] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  
  // Form states
  const [documentForm, setDocumentForm] = useState<DocumentFormData>({ 
    title: '', 
    file: null,
    isPublic: true
  });
  
  const [processingForm, setProcessingForm] = useState<ProcessingFormData>({
    documentId: 0,
    numCards: 10,
    difficulty: 'medium'
  });
  
  const [flashcardSetForm, setFlashcardSetForm] = useState<FlashcardSetFormData>({
    title: '',
    description: '',
    documentId: null
  });
  
  const [newFlashcardForm, setNewFlashcardForm] = useState<NewFlashcardFormData>({
    question: '',
    answer: '',
    difficulty: 'medium'
  });
  
  const [editFlashcardForm, setEditFlashcardForm] = useState<EditFlashcardFormData>({
    id: 0,
    question: '',
    answer: '',
    difficulty: 'medium'
  });
  
  // Error and loading states
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<string>('');
  
  // Check for local storage token on load
  useEffect(() => {
    const storedUser = localStorage.getItem('educards_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setView(parsedUser.isTeacher ? 'teacherDashboard' : 'studentDashboard');
      
      // Set up axios header
      setupAxios(parsedUser.token);
      
      // Load initial data based on user role
      if (parsedUser.isTeacher) {
        fetchDocuments();
      } else {
        fetchAvailableDocuments();
      }
    }
  }, []);
  
  // Flash message helper
  const showFlashMessage = (message: string) => {
    setFlashMessage(message);
    setTimeout(() => setFlashMessage(''), 3000);
  };
  
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('educards_user');
    clearAxios();
    setUser(null);
    setView('login');
    
    // Reset all state
    setDocuments([]);
    setFlashcards([]);
    setLeaderboard([]);
    setStudySessions([]);
    setCurrentSession(null);
    setFlashcardSets([]);
    setCurrentFlashcardSet(null);
  };
  
  // Document functions
  const fetchDocuments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await documentAPI.getDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      showFlashMessage('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentForm.file) {
      setError('Please select a file to upload');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log("Uploading file:", documentForm.file.name);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', documentForm.file);
      formData.append('title', documentForm.title);
      formData.append('is_public', documentForm.isPublic.toString());
      
      // Add teacher ID from the user if available
      if (user && user.id) {
        formData.append('teacher', user.id.toString());
      }
      
      // Log the form data for debugging
      console.log("Form data entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Direct API call to debug the upload issue
      const response = await axios.post(`${API_URL}/documents/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Upload response:", response);
      
      showFlashMessage('Document uploaded successfully!');
      setDocumentForm({ title: '', file: null, isPublic: true });
      fetchDocuments();
      setView('teacherDashboard');
    } catch (err: any) {
      console.error('Error uploading document:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(`Failed to upload document: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Failed to upload document: Network error');
      }
    } finally {
      setLoading(false);
    }
  };


    // Update flashcard
  const updateFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFlashcardSet) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await flashcardAPI.updateFlashcard(editFlashcardForm.id, editFlashcardForm);
      
      // Update the current set with the updated card
      setCurrentFlashcardSet({
        ...currentFlashcardSet,
        cards: currentFlashcardSet.cards.map(card => 
          card.id === editFlashcardForm.id ? response.data : card
        )
      });
      
      // Reset form
      setEditFlashcardForm({
        id: 0,
        question: '',
        answer: '',
        difficulty: 'medium'
      });
      
      showFlashMessage('Flashcard updated successfully!');
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError('Failed to update flashcard');
    } finally {
      setLoading(false);
    }
  };// App.tsx - Main application component


  
  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    setLoading(true);
    try {
      await documentAPI.deleteDocument(documentId);
      fetchDocuments();
      showFlashMessage('Document deleted successfully');
    } catch (err) {
      console.error('Error deleting document:', err);
      showFlashMessage('Failed to delete document');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProcessDocument = (documentId: number) => {
    setProcessingForm({ ...processingForm, documentId });
    setView('processDocument');
  };
  
  const processDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await documentAPI.processDocument(processingForm.documentId, processingForm);
      showFlashMessage('Document processed successfully!');
      setView('teacherDashboard');
    } catch (err) {
      console.error('Error processing document:', err);
      setError('Failed to process document');
    } finally {
      setLoading(false);
    }
  };
  
  // Flashcard functions
  const fetchFlashcards = async (documentId: number) => {
    setLoading(true);
    try {
      const response = await flashcardAPI.getFlashcards(documentId);
      setFlashcards(response.data);
      setView('viewFlashcards');
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      showFlashMessage('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };
  
  // Flashcard set functions
  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardAPI.getFlashcardSets();
      setFlashcardSets(response.data);
    } catch (err) {
      console.error('Error fetching flashcard sets:', err);
      showFlashMessage('Failed to load flashcard sets');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFlashcardSet = async (setId: number) => {
    setLoading(true);
    try {
      const response = await flashcardAPI.getFlashcardSet(setId);
      setCurrentFlashcardSet(response.data);
      setView('editFlashcardSet');
    } catch (err) {
      console.error('Error fetching flashcard set:', err);
      showFlashMessage('Failed to load flashcard set');
    } finally {
      setLoading(false);
    }
  };
  
  const createFlashcardSet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await flashcardAPI.createFlashcardSet(flashcardSetForm);
      setCurrentFlashcardSet(response.data);
      setFlashcardSetForm({ title: '', description: '' });
      showFlashMessage('Flashcard set created successfully!');
      setView('editFlashcardSet');
    } catch (err) {
      console.error('Error creating flashcard set:', err);
      setError('Failed to create flashcard set');
    } finally {
      setLoading(false);
    }
  };
  
  const addFlashcardToSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFlashcardSet) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await flashcardAPI.addFlashcard(currentFlashcardSet.id, newFlashcardForm);
      
      // Update the current set with the new card
      setCurrentFlashcardSet({
        ...currentFlashcardSet,
        cards: [...currentFlashcardSet.cards, response.data]
      });
      
      setNewFlashcardForm({
        question: '',
        answer: '',
        difficulty: 'medium'
      });
      
      showFlashMessage('Flashcard added successfully!');
    } catch (err) {
      console.error('Error adding flashcard:', err);
      setError('Failed to add flashcard');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteFlashcard = async (cardId: number) => {
    if (!currentFlashcardSet || !confirm('Are you sure you want to delete this flashcard?')) return;
    
    setLoading(true);
    try {
      await flashcardAPI.deleteFlashcard(cardId);
      
      // Update the current set without the deleted card
      setCurrentFlashcardSet({
        ...currentFlashcardSet,
        cards: currentFlashcardSet.cards.filter(card => card.id !== cardId)
      });
      
      showFlashMessage('Flashcard deleted successfully!');
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      showFlashMessage('Failed to delete flashcard');
    } finally {
      setLoading(false);
    }
  };
  
  // Student functions
  const fetchAvailableDocuments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await documentAPI.getDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching available documents:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const startStudySession = async (documentId: number) => {
    setLoading(true);
    try {
      // First get the flashcards
      const flashcardsResponse = await flashcardAPI.getFlashcards(documentId);
      setFlashcards(flashcardsResponse.data);
      
      if (flashcardsResponse.data.length === 0) {
        showFlashMessage('No flashcards available for this document');
        setLoading(false);
        return;
      }
      
      // Start a study session
      const flashcardIds = flashcardsResponse.data.map(card => card.id);
      const sessionResponse = await studyAPI.startSession(flashcardIds);
      
      setCurrentSession(sessionResponse.data.id);
      setCurrentFlashcard(0);
      setFlipped(false);
      setStartTime(Date.now());
      setView('studySession');
    } catch (err) {
      console.error('Error starting study session:', err);
      showFlashMessage('Failed to start study session');
    } finally {
      setLoading(false);
    }
  };
  
  const recordAnswer = async (flashcardId: number, isCorrect: boolean, timeTaken: number) => {
    if (!currentSession) return;
    
    try {
      await studyAPI.recordAnswer(currentSession, flashcardId, isCorrect, timeTaken);
      
      // Move to next flashcard or end session
      if (currentFlashcard < flashcards.length - 1) {
        setCurrentFlashcard(currentFlashcard + 1);
        setStartTime(Date.now()); // Reset the timer for the next card
      } else {
        endStudySession();
      }
    } catch (err) {
      console.error('Error recording answer:', err);
    }
  };
  
  const endStudySession = async () => {
    if (!currentSession) return;
    
    setLoading(true);
    try {
      const response = await studyAPI.endSession(currentSession);
      
      if (response.status === 200 || response.status === 201) {
        showFlashMessage('Study session completed successfully!');
        setCurrentSession(null);
        fetchLeaderboard();
        fetchStudyHistory();
        setView('studyResults');
      } else {
        throw new Error('Failed to end study session');
      }
    } catch (err) {
      console.error('Error ending study session:', err);
      showFlashMessage('Failed to end study session. Try again.');
      // Even if there's an error, let's move to results
      setCurrentSession(null);
      setView('studyResults');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStudyHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await studyAPI.getHistory();
      setStudySessions(response.data);
    } catch (err) {
      console.error('Error fetching study history:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Leaderboard functions
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await leaderboardAPI.getLeaderboard();
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* CSS for animations */}
      <style>{animationStyles}</style>
      
      {/* Navbar */}
      {user && (
        <Navbar 
          user={user} 
          setView={setView} 
          handleLogout={handleLogout}
          fetchDocuments={fetchDocuments}
          fetchFlashcardSets={fetchFlashcardSets}
          fetchAvailableDocuments={fetchAvailableDocuments}
          fetchStudyHistory={fetchStudyHistory}
          fetchLeaderboard={fetchLeaderboard}
        />
      )}
      
      {/* Flash message */}
      <FlashMessage message={flashMessage} />
      
      <div className="pt-4">
        {/* Authentication Views */}
        {view === 'login' && (
          <LoginForm 
            setUser={setUser} 
            showFlashMessage={showFlashMessage} 
            setView={setView} 
          />
        )}
        
        {view === 'register' && (
          <RegisterForm 
            setUser={setUser} 
            showFlashMessage={showFlashMessage} 
            setView={setView} 
          />
        )}
        
        {/* Teacher Views */}
        {view === 'teacherDashboard' && (
          <TeacherDashboard 
            documents={documents}
            loading={loading}
            setView={setView}
            fetchFlashcards={fetchFlashcards}
            handleDeleteDocument={handleDeleteDocument}
            handleProcessDocument={handleProcessDocument}
          />
        )}
        
        {view === 'uploadDocument' && (
          <UploadDocument 
            documentForm={documentForm}
            setDocumentForm={setDocumentForm}
            handleUpload={handleDocumentUpload}
            loading={loading}
            error={error}
            setView={setView}
          />
        )}
        
        {view === 'processDocument' && (
          <ProcessDocument 
            processingForm={processingForm}
            setProcessingForm={setProcessingForm}
            handleProcess={processDocument}
            loading={loading}
            error={error}
            setView={setView}
          />
        )}
        
        {view === 'viewFlashcards' && (
          <ViewFlashcards 
            flashcards={flashcards}
            loading={loading}
            setView={setView}
          />
        )}
        
        {view === 'flashcardSets' && (
          <FlashcardSets 
            flashcardSets={flashcardSets}
            loading={loading}
            setView={setView}
            fetchFlashcardSet={fetchFlashcardSet}
            setFlashcards={setFlashcards}
            startStudySession={startStudySession}
          />
        )}
        
        {view === 'createFlashcardSet' && (
          <CreateFlashcardSet 
            flashcardSetForm={flashcardSetForm}
            setFlashcardSetForm={setFlashcardSetForm}
            createFlashcardSet={createFlashcardSet}
            loading={loading}
            error={error}
            setView={setView}
            documents={documents}
          />
        )}
        
        {view === 'editFlashcardSet' && (
          <EditFlashcardSet 
            currentFlashcardSet={currentFlashcardSet}
            newFlashcardForm={newFlashcardForm}
            setNewFlashcardForm={setNewFlashcardForm}
            editFlashcardForm={editFlashcardForm}
            setEditFlashcardForm={setEditFlashcardForm}
            addFlashcardToSet={addFlashcardToSet}
            updateFlashcard={updateFlashcard}
            deleteFlashcard={deleteFlashcard}
            loading={loading}
            error={error}
            setView={setView}
          />
        )}
        
        {/* Student Views */}
        {view === 'studentDashboard' && (
          <StudentDashboard 
            documents={documents}
            loading={loading}
            startStudySession={startStudySession}
          />
        )}
        
        {view === 'studySession' && (
          <StudySessionComponent 
            flashcards={flashcards}
            currentFlashcard={currentFlashcard}
            flipped={flipped}
            setFlipped={setFlipped}
            recordAnswer={recordAnswer}
            endStudySession={endStudySession}
            startTime={startTime}
            setView={setView}
          />
        )}
        
        {view === 'studyHistory' && (
          <StudyHistory 
            studySessions={studySessions}
            loading={loading}
          />
        )}
        
        {view === 'leaderboard' && (
          <LeaderboardComponent 
            leaderboard={leaderboard}
            loading={loading}
            username={user?.username}
          />
        )}
        
        {view === 'studyResults' && (
          <StudyResults 
            fetchLeaderboard={fetchLeaderboard}
            fetchAvailableDocuments={fetchAvailableDocuments}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
}

export default App;