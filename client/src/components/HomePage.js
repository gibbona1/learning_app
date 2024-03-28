import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
      {/* Navigation Bar */}
      <nav>
        <ul>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/birdcalls">Bird Calls</Link></li>
          <li><Link to="/userlevels">User Levels</Link></li>
          <li><Link to="/lessons">Lessons</Link></li>
          <li><Link to="/lessonSession">Lesson Session</Link></li>
          <li><Link to="/reviews">Reviews</Link></li>
          <li><Link to="/reviewSession">Review Session</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;
