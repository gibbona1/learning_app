import React from 'react';
import NavBar from './NavBar';

export default function HomePage({ isAuth, setAuth }) {
  const logout = () => {
    setAuth(false);
  };
  return (
    <div>
      <NavBar />
      {isAuth && <button onClick={logout}>Logout</button>}
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}
