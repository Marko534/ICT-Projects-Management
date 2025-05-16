import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout, isTeacher } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-primary-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">EduCards</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isTeacher ? (
            <>
              <NavLink to="/teacher/dashboard" className={({ isActive }) => 
                isActive ? "font-bold text-white" : "text-white/80 hover:text-white"
              }>
                Documents
              </NavLink>
              <NavLink to="/teacher/upload" className={({ isActive }) => 
                isActive ? "font-bold text-white" : "text-white/80 hover:text-white"
              }>
                Upload
              </NavLink>
              <NavLink to="/teacher/flashcards" className={({ isActive }) => 
                isActive ? "font-bold text-white" : "text-white/80 hover:text-white"
              }>
                Flashcards
              </NavLink>
              <NavLink to="/student/dashboard" className={({ isActive }) => 
                isActive ? "font-bold text-white" : "text-white/80 hover:text-white"
              }>
                Study Mode
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/student/dashboard" className={({ isActive }) => 
                isActive ? "font-bold text-white" : "text-white/80 hover:text-white"
              }>
                Study
              </NavLink>
              <NavLink to="/student/history" className={({ isActive }) => 
                isActive ? "font-bold text-white" : "text-white/80 hover:text-white"
              }>
                History
              </NavLink>
              <NavLink to="/student/leaderboard" className={({ isActive }) => 
                isActive ? "font-bold text-white" : "text-white/80 hover:text-white"
              }>
                Leaderboard
              </NavLink>
            </>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-white/80">
              {user?.username} ({isTeacher ? 'Teacher' : 'Student'})
            </span>
            <button 
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;