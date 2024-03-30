// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/birdcalls">Bird Calls</Link></li>
        <li><Link to="/userlevels">User Levels</Link></li>
        <li><Link to="/lessons">Lessons</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
        <li><Link to="/stats">Stats</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
