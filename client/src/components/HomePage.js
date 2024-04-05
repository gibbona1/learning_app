import React from 'react';
import NavBar from './NavBar';

export default function HomePage({ isAuth, setAuth, userId, setUserId }) {
  const logout = () => {
    setAuth(false);
    setUserId(null);
  };
  return (
    <div>
      <NavBar />
      {isAuth && <button onClick={logout}>Logout</button>}
      {isAuth && <p>Logged in as user {userId}</p>}
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}
