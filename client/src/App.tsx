import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import UploadDocument from './pages/teacher/UploadDocument';
import ProcessDocument from './pages/teacher/ProcessDocument';
import ViewFlashcards from './pages/teacher/ViewFlashcards';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudySession from './pages/student/StudySession';
import StudyHistory from './pages/student/StudyHistory';
import Leaderboard from './pages/student/Leaderboard';

// Test components
import UploadTest from './components/UploadTest';

import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/login" replace />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowStudent={false}>
              <Layout>
                <TeacherDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/upload" element={
            <ProtectedRoute allowStudent={false}>
              <Layout>
                <UploadDocument />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/upload-test" element={
            <ProtectedRoute>
              <Layout>
                <UploadTest />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/process/:documentId" element={
            <ProtectedRoute allowStudent={false}>
              <Layout>
                <ProcessDocument />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/flashcards/:documentId" element={
            <ProtectedRoute allowStudent={false}>
              <Layout>
                <ViewFlashcards />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/study/:documentId" element={
            <ProtectedRoute>
              <Layout>
                <StudySession />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/history" element={
            <ProtectedRoute>
              <Layout>
                <StudyHistory />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/leaderboard" element={
            <ProtectedRoute>
              <Layout>
                <Leaderboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-12">
        {children}
      </main>
    </div>
  );
};

export default App;