import React from 'react';
import NavBar from './NavBar';
import { handleResponse } from './helpers';

export default function HomePage({ isAuth, setAuth, userData, setUserData }) {
  const logout = () => {
    setAuth(false);
    fetch(`api/sessions/${userData.sessionId}/finish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setUserData({...userData, id: null, role: null, level: null, sessionId: null});
  };

  function startLevelUp() {
    fetch(`api/users/${userData.id}/levelUp`, {
      method: 'PUT'
    })
    .then(handleResponse)
    .then(data => {
      alert('LevelUp completed successfully:', data);
      // reload page
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
      {isAuth && <p>Logged in as user: <b>{userData.id}</b>. role: <b>{userData.role}</b></p>}
      {isAuth && <p>Level: <b>{userData.level}</b></p>}
      {isAuth && userData.level === 0 && <button onClick={startLevelUp}>Unlock Level 1</button>}
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}
