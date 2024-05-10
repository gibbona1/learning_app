import React from 'react';
import NavBar from './NavBar';
import { handleResponse } from './helpers';

export default function HomePage({ isAuth, setAuth, userId, setUserId, userRole, setUserRole, userLevel, setUserLevel, sessionId, setSessionId}) {
  const logout = () => {
    setAuth(false);
    setUserId(null);
    setUserRole(null);
    setUserLevel(null);
    fetch(`api/sessions/${sessionId}/finish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setSessionId(null);
  };

  function startLevelUp() {
    fetch(`api/users/${userId}/levelUp`, {
      method: 'PUT'
    })
    .then(handleResponse)
    .then(data => {
      alert('LevelUp completed successfully:', data);
      // reload page
      setUserLevel(userLevel + 1);
      window.location.reload();
    })
    .catch(error => {
      alert('Error starting levelup:', error);
    });
  };

  return (
    <div>
      <NavBar />
      {isAuth && <button onClick={logout}>Logout</button>}
      {isAuth && <p>Logged in as user: <b>{userId}</b>. role: <b>{userRole}</b></p>}
      {isAuth && <p>Level: <b>{userLevel}</b></p>}
      {isAuth && userLevel === 0 && <button onClick={startLevelUp}>Unlock Level 1</button>}
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}
