import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowTeacher?: boolean;
  allowStudent?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowTeacher = true, 
  allowStudent = true 
}) => {
  const { isAuthenticated, isTeacher, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if ((isTeacher && !allowTeacher) || (!isTeacher && !allowStudent)) {
    return <Navigate to={isTeacher ? "/teacher/dashboard" : "/student/dashboard"} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;