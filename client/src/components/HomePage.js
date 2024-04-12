import React from 'react';
import NavBar from './NavBar';

export default function HomePage({ isAuth, setAuth, userId, setUserId, userRole, setUserRole, sessionId, setSessionId}) {
  const logout = () => {
    setAuth(false);
    setUserId(null);
    setUserRole(null);
    fetch(`api/sessions/${sessionId}/finish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setSessionId(null);
  };
  return (
    <div>
      <NavBar />
      {isAuth && <button onClick={logout}>Logout</button>}
      {isAuth && <p>Logged in as user: <b>{userId}</b>. role: <b>{userRole}</b></p>}
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}
