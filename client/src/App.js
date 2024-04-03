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

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Handle successful authentication
        console.log('Login successful:', data);
        // E.g., storing auth tokens returned from the server in local storage or context
        setIsAuthenticated(true);
        // Optionally redirect the user or perform other actions upon successful login
      } else {
        // Handle failed authentication
        setIsAuthenticated(false);
        alert('Login failed: Invalid credentials.');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Login error:', error);
      alert('Login error.');
      setIsAuthenticated(false);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={login} />}/>
        <Route path="/" element={isAuthenticated ? <HomePage isAuth= {true} setAuth = {setIsAuthenticated}/> : <Navigate to="/login" replace />} />
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