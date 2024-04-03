import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import BirdCallsPage from './components/BirdCallsPage';
import UserLevelsPage from './components/UserLevelsPage';
import LessonsPage from './components/LessonsPage';
import LessonSessionPage from './components/LessonSessionPage';
import ReviewPage from './components/ReviewsPage';
import ReviewSessionPage from './components/ReviewSessionPage';
import StatsPage from './components/StatsPage';
import Login from './components/Login';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username, password) => {
    // Perform authentication here.
    // If successful, set isAuthenticated to true.
    setIsAuthenticated(true);
  };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={login} />}/>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
        {isAuthenticated ? (
          <>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/birdcalls" element={<BirdCallsPage />} />
          <Route path="/userlevels" element={<UserLevelsPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessonSession" element={<LessonSessionPage />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/reviewSession" element={<ReviewSessionPage />} />
          <Route path="/stats" element={<StatsPage />} />
          </>
          ) : (
            <></>
          )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}