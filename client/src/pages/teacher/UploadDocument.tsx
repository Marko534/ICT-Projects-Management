import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadDocument: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file) {
      setError('Please select a file to upload');
      setLoading(false);
      return;
    }

    try {
      // Get user info from localStorage
      const userStr = localStorage.getItem('educards_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user || !user.id) {
        setError('User information not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Create FormData and add all required fields
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file_path', file);
      formData.append('teacher', user.id.toString());
      
      // Log what's in the FormData
      console.log("FormData contents:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
      // Direct axios call to better see the error
      const response = await axios.post('/api/documents/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${user.token}`
        }
      });
      
      console.log("Upload success:", response.data);
      navigate('/teacher/dashboard');
    } catch (error: any) {
      console.error('Error uploading document:', error);
      console.error('Server response:', error.response?.data);
      setError(`Failed to upload document: ${JSON.stringify(error.response?.data || {})}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Document</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Document Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="file">
              Upload PDF
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf"
              className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              onChange={handleFileChange}
              required
            />
            <p className="text-sm text-gray-500 mt-1">Only PDF files are supported (max 20MB)</p>
          </div>
          
          <div className="flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label className="ml-2 block text-gray-700" htmlFor="isPublic">
              Make this document available to all students
            </label>
          </div>
          
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
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocument;