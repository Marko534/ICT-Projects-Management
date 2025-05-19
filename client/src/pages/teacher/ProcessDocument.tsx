import React, { useState, FormEvent, ChangeEvent } from 'react';
import { ProcessingFormData } from '../../types';
import { documentAPI } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const ProcessDocument: React.FC = () => {
  const [formData, setFormData] = useState<ProcessingFormData>({
    numCards: 10,
    difficulty: 'medium'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'numCards' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!documentId) {
      setError('Document ID is missing');
      setLoading(false);
      return;
    }

    try {
      await documentAPI.processDocument(documentId, formData);
      navigate(`/teacher/flashcards/${documentId}`);
    } catch (error) {
      console.error('Error processing document:', error);
      setError('Failed to process document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Generate Flashcards</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="numCards">
              Number of Flashcards
            </label>
            <input
              id="numCards"
              name="numCards"
              type="number"
              min="1"
              max="50"
              className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={formData.numCards}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="difficulty">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <p className="text-sm text-gray-500">
            This will use AI to generate flashcards from your document. The process may take up to 30 seconds.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-200"
              disabled={loading}
            >
              {loading ? 
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                  <span>Processing...</span>
                </div> : 
                'Generate Flashcards'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessDocument;