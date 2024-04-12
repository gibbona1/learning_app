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
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const updateLastActive = () => {
    if (!sessionId) {
      return;
    }
    fetch(`/api/sessions/${sessionId}/lastActive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => console.log('Last active updated'))
    .catch(error => console.error('Error updating last active:', error));
  };
  
  // Update last active every 5 minutes
  setInterval(updateLastActive, 5*60*1000); // 300000 milliseconds = 5 minutes

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
        console.log('Login successful:');
        // E.g., storing auth tokens returned from the server in local storage or context
        setIsAuthenticated(true);
        setUserId(data.id);
        setUserRole(data.role);
        setSessionId(data.sessionId);
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
        <Route path="/" element={isAuthenticated ? <HomePage isAuth= {true} setAuth = {setIsAuthenticated} 
                                                             userId = {userId} setUserId = {setUserId}
                                                             userRole = {userRole} setUserRole = {setUserRole}
                                                             sessionId = {sessionId} setSessionId = {setSessionId}/> : <Navigate to="/login" replace />} />
        {isAuthenticated ? (
          <>
          <Route path="/users" element={<UserPage userId = {userId} userRole = {userRole}/>} />
          <Route path="/birdcalls" element={<BirdCallsPage userId = {userId}/>} />
          <Route path="/userlevels" element={<UserLevelsPage />} />
          <Route path="/lessons" element={<LessonsPage userId = {userId}/>} />
          <Route path="/lessonSession" element={<LessonSessionPage userId = {userId}/>} />
          <Route path="/reviews" element={<ReviewPage userId = {userId}/>} />
          <Route path="/reviewSession" element={<ReviewSessionPage userId = {userId}/>} />
          <Route path="/stats" element={<StatsPage userId = {userId}/>} />
          </>
          ) : (
            <></>
          )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}