// TeacherComponents.tsx - Teacher specific components

import React, { useState } from 'react';
import { 
  Document, 
  DocumentFormData, 
  Flashcard, 
  FlashcardSet,
  FlashcardSetFormData,
  NewFlashcardFormData,
  ProcessingFormData
} from './types';
import { documentAPI, flashcardAPI } from './api';
import { buttonStyles, cardStyles, formStyles } from './styles';
import { EmptyState, LoadingSpinner } from './SharedComponents';

interface TeacherDashboardProps {
  documents: Document[];
  loading: boolean;
  setView: (view: string) => void;
  fetchFlashcards: (documentId: number) => void;
  handleDeleteDocument: (documentId: number) => void;
  handleProcessDocument: (documentId: number) => void;
}

// Teacher Dashboard Component
export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  documents, 
  loading, 
  setView,
  fetchFlashcards,
  handleDeleteDocument,
  handleProcessDocument
}) => {
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">My Documents</h1>
      <div className="mb-4 flex justify-end">
        <button 
          className={buttonStyles.primary}
          onClick={() => setView('uploadDocument')}
        >
          Upload New Document
        </button>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading documents..." />
      ) : documents.length === 0 ? (
        <EmptyState 
          message="No documents found. Upload your first document to get started!"
          buttonText="Upload Document"
          buttonAction={() => setView('uploadDocument')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div key={doc.id} className={`${cardStyles.container} hover:-translate-y-1`}>
              <h3 className={cardStyles.header}>{doc.title}</h3>
              <p className={cardStyles.meta}>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
              <p className="text-sm mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${doc.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {doc.isPublic ? 'Public' : 'Private'}
                </span>
              </p>
              <div className="flex space-x-2 mt-4">
                <button 
                  className={`${buttonStyles.primary} ${buttonStyles.small}`}
                  onClick={() => fetchFlashcards(doc.id)}
                >
                  View Flashcards
                </button>
                <button 
                  className={`bg-purple-500 hover:bg-purple-600 text-white ${buttonStyles.small}`}
                  onClick={() => handleProcessDocument(doc.id)}
                >
                  Generate Flashcards
                </button>
                <button 
                  className={`${buttonStyles.danger} ${buttonStyles.small}`}
                  onClick={() => handleDeleteDocument(doc.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface UploadDocumentProps {
  documentForm: DocumentFormData;
  setDocumentForm: React.Dispatch<React.SetStateAction<DocumentFormData>>;
  handleUpload: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string;
  setView: (view: string) => void;
}

// Upload Document Component
export const UploadDocument: React.FC<UploadDocumentProps> = ({ 
  documentForm, 
  setDocumentForm, 
  handleUpload, 
  loading, 
  error,
  setView
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files && files.length > 0) {
      console.log("File selected:", files[0].name);
      const file = files[0];
      setDocumentForm({ ...documentForm, file });
    } else if (type === 'checkbox') {
      setDocumentForm({ ...documentForm, [name]: checked });
    } else {
      setDocumentForm({ ...documentForm, [name]: value });
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Upload Document</h1>
      {error && <div className={formStyles.error}>{error}</div>}
      <form onSubmit={handleUpload} className={formStyles.container}>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Document Title</label>
          <input 
            type="text" 
            name="title"
            className={formStyles.input}
            value={documentForm.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Upload PDF</label>
          <input 
            type="file" 
            name="file"
            accept=".pdf"
            className={formStyles.input}
            onChange={handleChange}
            required
          />
          <p className="text-sm text-gray-500 mt-1">Only PDF files are supported (max 20MB)</p>
        </div>
        <div className="mb-4 flex items-center">
          <input 
            type="checkbox" 
            name="isPublic"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={documentForm.isPublic}
            onChange={handleChange}
          />
          <label className="ml-2 block text-gray-700">Make this document available to all students</label>
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setView('teacherDashboard')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={buttonStyles.primary}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface ProcessDocumentProps {
  processingForm: ProcessingFormData;
  setProcessingForm: React.Dispatch<React.SetStateAction<ProcessingFormData>>;
  handleProcess: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string;
  setView: (view: string) => void;
}

// Process Document Component
export const ProcessDocument: React.FC<ProcessDocumentProps> = ({ 
  processingForm, 
  setProcessingForm,
  handleProcess,
  loading,
  error,
  setView
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'numCards') {
      setProcessingForm({ ...processingForm, numCards: parseInt(value) });
    } else {
      setProcessingForm({ ...processingForm, [name]: value });
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Generate Flashcards</h1>
      {error && <div className={formStyles.error}>{error}</div>}
      <form onSubmit={handleProcess} className={formStyles.container}>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Number of Flashcards</label>
          <input 
            type="number" 
            name="numCards"
            min="1"
            max="50"
            className={formStyles.input}
            value={processingForm.numCards}
            onChange={handleChange}
            required
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Difficulty Level</label>
          <select 
            name="difficulty"
            className={formStyles.input}
            value={processingForm.difficulty}
            onChange={handleChange}
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          This will use AI to generate flashcards from your document. The process may take up to 30 seconds.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setView('teacherDashboard')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={buttonStyles.primary}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Generate Flashcards'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface ViewFlashcardsProps {
  flashcards: Flashcard[];
  loading: boolean;
  setView: (view: string) => void;
}

// View Flashcards Component
export const ViewFlashcards: React.FC<ViewFlashcardsProps> = ({ flashcards, loading, setView }) => {
  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <button 
          className={buttonStyles.primary}
          onClick={() => setView('teacherDashboard')}
        >
          Back to Documents
        </button>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading flashcards..." />
      ) : flashcards.length === 0 ? (
        <EmptyState message="No flashcards found for this document." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="bg-indigo-600 text-white p-3">
                <h3 className="font-medium">Question</h3>
              </div>
              <div className="p-4 border-b">
                <p>{card.question}</p>
              </div>
              <div className="bg-green-600 text-white p-3">
                <h3 className="font-medium">Answer</h3>
              </div>
              <div className="p-4">
                <p>{card.answer}</p>
              </div>
              <div className="bg-gray-100 p-2 text-sm text-gray-600">
                Difficulty: <span className="font-medium">{card.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface FlashcardSetsProps {
  flashcardSets: FlashcardSet[];
  loading: boolean;
  setView: (view: string) => void;
  fetchFlashcardSet: (setId: number) => Promise<void>;
  setFlashcards: (flashcards: Flashcard[]) => void;
  startStudySession: (id: number) => Promise<void>;
}

  // Flashcard Sets Component
export const FlashcardSets: React.FC<FlashcardSetsProps> = ({ 
  flashcardSets, 
  loading, 
  setView,
  fetchFlashcardSet,
  setFlashcards,
  startStudySession
}) => {
  return (
    <div className="container mx-auto p-4 animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Flashcard Sets</h1>
        <button 
          className={buttonStyles.primary}
          onClick={() => setView('createFlashcardSet')}
        >
          Create New Set
        </button>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading flashcard sets..." />
      ) : flashcardSets.length === 0 ? (
        <EmptyState 
          message="No flashcard sets found. Create your first set to get started!"
          buttonText="Create Flashcard Set"
          buttonAction={() => setView('createFlashcardSet')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map(set => (
            <div key={set.id} className={`${cardStyles.container} hover:-translate-y-1`}>
              <h3 className={cardStyles.header}>{set.title}</h3>
              <p className={cardStyles.meta}>{set.description}</p>
              <p className="text-sm mb-3">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {set.cards.length} cards
                </span>
              </p>
              <div className="flex space-x-2 mt-4">
                <button 
                  className={`${buttonStyles.primary} ${buttonStyles.small}`}
                  onClick={() => fetchFlashcardSet(set.id)}
                >
                  Edit Set
                </button>
                {set.cards.length > 0 && (
                  <button 
                    className={`${buttonStyles.success} ${buttonStyles.small}`}
                    onClick={() => {
                      setFlashcards(set.cards);
                      startStudySession(set.id);
                    }}
                  >
                    Study
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface CreateFlashcardSetProps {
  flashcardSetForm: FlashcardSetFormData;
  setFlashcardSetForm: React.Dispatch<React.SetStateAction<FlashcardSetFormData>>;
  createFlashcardSet: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string;
  setView: (view: string) => void;
  documents: Document[];
}

// Create Flashcard Set Component
export const CreateFlashcardSet: React.FC<CreateFlashcardSetProps> = ({ 
  flashcardSetForm, 
  setFlashcardSetForm,
  createFlashcardSet,
  loading,
  error,
  setView,
  documents
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'documentId') {
      setFlashcardSetForm({ ...flashcardSetForm, documentId: value ? parseInt(value) : null });
    } else {
      setFlashcardSetForm({ ...flashcardSetForm, [name]: value });
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Create Flashcard Set</h1>
      {error && <div className={formStyles.error}>{error}</div>}
      <form onSubmit={createFlashcardSet} className={formStyles.container}>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Set Title</label>
          <input 
            type="text" 
            name="title"
            className={formStyles.input}
            value={flashcardSetForm.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Description</label>
          <textarea 
            name="description"
            className={formStyles.input}
            value={flashcardSetForm.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Generate from Document (Optional)</label>
          <select
            name="documentId"
            className={formStyles.input}
            value={flashcardSetForm.documentId?.toString() || ''}
            onChange={handleChange}
          >
            <option value="">None (Create Empty Set)</option>
            {documents.map(doc => (
              <option key={doc.id} value={doc.id.toString()}>
                {doc.title}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            If you select a document, flashcards will be automatically generated from it.
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setView('flashcardSets')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={buttonStyles.primary}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Set'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface EditFlashcardSetProps {
  currentFlashcardSet: FlashcardSet | null;
  newFlashcardForm: NewFlashcardFormData;
  setNewFlashcardForm: React.Dispatch<React.SetStateAction<NewFlashcardFormData>>;
  editFlashcardForm: EditFlashcardFormData;
  setEditFlashcardForm: React.Dispatch<React.SetStateAction<EditFlashcardFormData>>;
  addFlashcardToSet: (e: React.FormEvent) => Promise<void>;
  updateFlashcard: (e: React.FormEvent) => Promise<void>;
  deleteFlashcard: (cardId: number) => Promise<void>;
  loading: boolean;
  error: string;
  setView: (view: string) => void;
}

// Edit Flashcard Set Component
export const EditFlashcardSet: React.FC<EditFlashcardSetProps> = ({ 
  currentFlashcardSet,
  newFlashcardForm,
  setNewFlashcardForm,
  editFlashcardForm,
  setEditFlashcardForm,
  addFlashcardToSet,
  updateFlashcard,
  deleteFlashcard,
  loading,
  error,
  setView
}) => {
  if (!currentFlashcardSet) return null;
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const handleNewFlashcardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFlashcardForm({ ...newFlashcardForm, [name]: value });
  };
  
  const handleEditFlashcardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFlashcardForm({ ...editFlashcardForm, [name]: value });
  };
  
  const startEditing = (card: Flashcard) => {
    setEditFlashcardForm({
      id: card.id,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty
    });
    setIsEditing(true);
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditFlashcardForm({
      id: 0,
      question: '',
      answer: '',
      difficulty: 'medium'
    });
  };
  
  const handleUpdateFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    updateFlashcard(e).then(() => {
      setIsEditing(false);
    });
  };
  
  return (
    <div className="container mx-auto p-4 animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit: {currentFlashcardSet.title}</h1>
        <button 
          className={buttonStyles.primary}
          onClick={() => setView('flashcardSets')}
        >
          Back to Sets
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Add new flashcard */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Add New Flashcard</h2>
          {error && <div className={formStyles.error}>{error}</div>}
          <form onSubmit={addFlashcardToSet}>
            <div className={formStyles.inputGroup}>
              <label className={formStyles.label}>Question</label>
              <textarea 
                name="question"
                className={formStyles.input}
                value={newFlashcardForm.question}
                onChange={handleNewFlashcardChange}
                rows={3}
                required
              />
            </div>
            <div className={formStyles.inputGroup}>
              <label className={formStyles.label}>Answer</label>
              <textarea 
                name="answer"
                className={formStyles.input}
                value={newFlashcardForm.answer}
                onChange={handleNewFlashcardChange}
                rows={3}
                required
              />
            </div>
            <div className={formStyles.inputGroup}>
              <label className={formStyles.label}>Difficulty</label>
              <select 
                name="difficulty"
                className={formStyles.input}
                value={newFlashcardForm.difficulty}
                onChange={handleNewFlashcardChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button 
              type="submit" 
              className={`w-full ${buttonStyles.success}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Flashcard'}
            </button>
          </form>
        </div>
        
        {/* Right column - Existing flashcards */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Current Flashcards</h2>
          {currentFlashcardSet.cards.length === 0 ? (
            <EmptyState message="No flashcards yet. Add your first one!" />
          ) : (
            <div className="space-y-4">
              {isEditing ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-4">
                  <h3 className="font-medium mb-4">Edit Flashcard</h3>
                  <form onSubmit={handleUpdateFlashcard}>
                    <div className={formStyles.inputGroup}>
                      <label className={formStyles.label}>Question</label>
                      <textarea 
                        name="question"
                        className={formStyles.input}
                        value={editFlashcardForm.question}
                        onChange={handleEditFlashcardChange}
                        rows={3}
                        required
                      />
                    </div>
                    <div className={formStyles.inputGroup}>
                      <label className={formStyles.label}>Answer</label>
                      <textarea 
                        name="answer"
                        className={formStyles.input}
                        value={editFlashcardForm.answer}
                        onChange={handleEditFlashcardChange}
                        rows={3}
                        required
                      />
                    </div>
                    <div className={formStyles.inputGroup}>
                      <label className={formStyles.label}>Difficulty</label>
                      <select 
                        name="difficulty"
                        className={formStyles.input}
                        value={editFlashcardForm.difficulty}
                        onChange={handleEditFlashcardChange}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        type="button" 
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className={buttonStyles.primary}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Flashcard'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                currentFlashcardSet.cards.map((card, index) => (
                  <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
                    <div className="bg-indigo-100 p-3 flex justify-between items-center">
                      <h3 className="font-medium">Card #{index + 1}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        card.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {card.difficulty}
                      </span>
                    </div>
                    <div className="p-4 border-b">
                      <div className="font-semibold mb-1">Question:</div>
                      <p>{card.question}</p>
                    </div>
                    <div className="p-4">
                      <div className="font-semibold mb-1">Answer:</div>
                      <p>{card.answer}</p>
                    </div>
                    <div className="bg-gray-50 p-2 flex justify-end space-x-2">
                      <button 
                        className={`${buttonStyles.primary} ${buttonStyles.small}`}
                        onClick={() => startEditing(card)}
                      >
                        Edit
                      </button>
                      <button 
                        className={`${buttonStyles.danger} ${buttonStyles.small}`}
                        onClick={() => deleteFlashcard(card.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};