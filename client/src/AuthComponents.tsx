// AuthComponents.tsx - Authentication related components

import React, { useState } from 'react';
import { 
  LoginFormData, 
  RegisterFormData, 
  User 
} from './types';
import { authAPI, setupAxios } from './api';
import { buttonStyles, formStyles } from './styles';

interface AuthProps {
  setUser: (user: User | null) => void;
  showFlashMessage: (message: string) => void;
  setView: (view: string) => void;
}

// Login Form Component
export const LoginForm: React.FC<AuthProps> = ({ setUser, showFlashMessage, setView }) => {
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(formData.username, formData.password);
      
      const userData: User = {
        id: response.data.user_id,
        username: response.data.username,
        isTeacher: response.data.is_teacher,
        token: response.data.token
      };
      
      // Save to local storage
      localStorage.setItem('educards_user', JSON.stringify(userData));
      
      // Set up axios header
      setupAxios(userData.token);
      
      // Update state
      setUser(userData);
      console.log('User data:', userData);
      setView(userData.isTeacher ? 'teacherDashboard' : 'studentDashboard');
      
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to EduCards</h2>
      {error && <div className={formStyles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Username</label>
          <input 
            type="text" 
            name="username"
            className={formStyles.input}
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Password</label>
          <input 
            type="password" 
            name="password"
            className={formStyles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button 
            type="submit" 
            className={`w-full ${buttonStyles.primary}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button 
            className="text-indigo-600 hover:text-indigo-800"
            onClick={() => setView('register')}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

// Register Form Component
export const RegisterForm: React.FC<AuthProps> = ({ setUser, showFlashMessage, setView }) => {
  const [formData, setFormData] = useState<RegisterFormData>({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    isTeacher: false 
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const response = await authAPI.register(formData);
      
      const userData: User = {
        id: response.data.user_id,
        username: response.data.username,
        isTeacher: response.data.is_teacher,
        token: response.data.token
      };
      
      // Save to local storage
      localStorage.setItem('educards_user', JSON.stringify(userData));
      
      // Set up axios header
      setupAxios(userData.token);
      
      // Update state
      setUser(userData);
      setView(userData.isTeacher ? 'teacherDashboard' : 'studentDashboard');
      showFlashMessage('Registration successful!');
      
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register for EduCards</h2>
      {error && <div className={formStyles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Username</label>
          <input 
            type="text" 
            name="username"
            className={formStyles.input}
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Email</label>
          <input 
            type="email" 
            name="email"
            className={formStyles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Password</label>
          <input 
            type="password" 
            name="password"
            className={formStyles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={formStyles.inputGroup}>
          <label className={formStyles.label}>Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword"
            className={formStyles.input}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            name="isTeacher"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={formData.isTeacher}
            onChange={handleChange}
          />
          <label className="ml-2 block text-gray-700">Register as a Teacher</label>
        </div>
        <div>
          <button 
            type="submit" 
            className={`w-full ${buttonStyles.primary}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            className="text-indigo-600 hover:text-indigo-800"
            onClick={() => setView('login')}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};