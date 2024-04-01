import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { handleResponse } from './helpers';

function ReviewsPage() {
  const userId = '65fcc504b999225e008c71c5';
  
  let navigate = useNavigate();
  function startLessonSession() {
    navigate('/lessonSession' , { state: {userId: userId} }); // Navigate to ReviewSession page
  }
  // State to store counts
  const [LessonsCount, setLessonsCount] = useState(0);

  async function fetchCounts(userId) {
    try {
      fetch(`/api/lessons`)
      .then(handleResponse)
      .then(data => {
        const dsub = data.filter(item => item.userId === userId);
        setLessonsCount(dsub.length);
      });
    } catch (error) {
      console.error('Error fetching lesson counts:', error);
      alert('Error fetching lesson counts: ' + error.message); // Displaying error message in alert
    }
  };

  useEffect(() => {
    // Fetch and set review counts for each time frame
    fetchCounts(userId);
    }, [userId]); // Re-run when userId changes

  // Render the review counts
  return (
    <div>
      <NavBar />
      <h2>Lesson Counts for User {userId}</h2>
        <p>Lessons: {LessonsCount}</p>
      <button onClick={startLessonSession}>Start Lessons</button>
    </div>
  );
};

export default ReviewsPage;
