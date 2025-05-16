import React, { useState } from 'react';
import axios from 'axios';

// Test component to debug file upload
const UploadTest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    
    if (!file) return;
    
    const formData = new FormData();
    formData.append('title', 'Test Document');
    formData.append('file_path', file);
    
    // Log form data entries for debugging
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    try {
      const response = await axios.post('/api/documents/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${localStorage.getItem('token') || ''}`
        }
      });
      
      setResponse(response.data);
    } catch (err: any) {
      setError(JSON.stringify(err.response?.data || err.message));
      console.error('Upload error:', err.response?.data || err);
    }
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Upload Test</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="mb-4 block" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Test Upload
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <pre>{error}</pre>
        </div>
      )}
      
      {response && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadTest;