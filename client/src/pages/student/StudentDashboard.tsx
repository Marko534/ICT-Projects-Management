import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import { documentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
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

  const handleStartStudy = (documentId: number): void => {
    navigate(`/student/study/${documentId}`);
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Study Materials</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No documents available yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl transform hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{doc.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Added: {new Date(doc.upload_date).toLocaleDateString()}
                </p>
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-200 transform hover:scale-105"
                  onClick={() => handleStartStudy(doc.id)}
                >
                  Start Studying
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;