import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, setupAxios, clearAxios } from '../services/api';
import { LoginFormData, RegisterFormData, User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  register: (formData: RegisterFormData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('educards_user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setupAxios(parsedUser.token);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    try {
      const response = await authAPI.login(username, password);
      const userData: User = {
        id: response.data.user_id,
        username: response.data.username,
        isTeacher: response.data.is_teacher,
        isStudent: response.data.is_student,
        token: response.data.token
      };
      
      localStorage.setItem('educards_user', JSON.stringify(userData));
      setupAxios(userData.token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData: RegisterFormData): Promise<User> => {
    try {
      const response = await authAPI.register(formData);
      const userData: User = {
        id: response.data.user_id,
        username: response.data.username,
        isTeacher: response.data.is_teacher,
        isStudent: response.data.is_student,
        token: response.data.token
      };
      
      localStorage.setItem('educards_user', JSON.stringify(userData));
      setupAxios(userData.token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('educards_user');
    clearAxios();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user,
        isTeacher: user?.isTeacher || false,
        isStudent: !user?.isTeacher || false,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};