import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import { documentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await documentAPI.getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFlashcards = (documentId: number): void => {
    navigate(`/teacher/flashcards/${documentId}`);
  };

  const handleGenerateFlashcards = (documentId: number): void => {
    navigate(`/teacher/process/${documentId}`);
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>
        <button 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-200 transform hover:scale-105"
          onClick={() => navigate('/teacher/upload')}
        >
          Upload New Document
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">No documents found. Upload your first document to get started!</p>
          <button 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            onClick={() => navigate('/teacher/upload')}
          >
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl transform hover:-translate-y-1">
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{doc.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-sm flex-grow"
                    onClick={() => handleViewFlashcards(doc.id)}
                  >
                    View Flashcards
                  </button>
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm flex-grow"
                    onClick={() => handleGenerateFlashcards(doc.id)}
                  >
                    Generate Flashcards
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;