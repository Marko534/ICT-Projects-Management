import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FlashcardStudy from './pages/FlashcardStudy';
import CreateMatch from './pages/CreateMatch';
import JoinMatch from './pages/JoinMatch';
import MatchSession from './pages/MatchSession';
import MatchResults from './pages/MatchResults';

// Layout
import MainLayout from './components/MainLayout';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode,
  requiredRole?: 'student' | 'professor' 
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    } else if (requiredRole && user?.role !== requiredRole) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, requiredRole, navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/study/:setId" element={
          <ProtectedRoute>
            <FlashcardStudy />
          </ProtectedRoute>
        } />
        
        <Route path="/match/create" element={
          <ProtectedRoute requiredRole="professor">
            <CreateMatch />
          </ProtectedRoute>
        } />
        
        <Route path="/match/join" element={
          <ProtectedRoute>
            <JoinMatch />
          </ProtectedRoute>
        } />
        
        <Route path="/match/join/:matchId" element={
          <ProtectedRoute>
            <JoinMatch />
          </ProtectedRoute>
        } />
        
        <Route path="/match/session" element={
          <ProtectedRoute>
            <MatchSession />
          </ProtectedRoute>
        } />
        
        <Route path="/match/results" element={
          <ProtectedRoute>
            <MatchResults />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;