import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { handleResponse, handleError } from './helpers';

function ReviewsPage({ userId }) {
  let navigate = useNavigate();
  function startReviewSession(graded=true) {
    navigate('/reviewSession', { state: { graded: graded } }); // Navigate to ReviewSession page
  }
  // State to store counts
  const [reviewsNowCount, setReviewsNowCount] = useState(0);
  const [reviews1HourCount, setReviews1HourCount] = useState(0);
  const [reviews24HoursCount, setReviews24HoursCount] = useState(0);

  const [reviewsNow, setReviewsNow] = useState([]);

  async function fetchReviewCounts(userId, hours, setFn) {
    try {
      fetch(`/api/items/${userId}/${hours}/count`)
        .then(handleResponse)
        .then(data => {
          setFn(data.adjustedCount);
        });
    } catch (error) {
      console.error('Error fetching review counts:', error);
      alert('Error fetching review counts: ' + error.message); // Displaying error message in alert
    }
  };

  useEffect(() => {
    // Fetch and set review counts for each time frame
    fetchReviewCounts(userId, 0, setReviewsNowCount);
    fetchReviewCounts(userId, 1, setReviews1HourCount);
    fetchReviewCounts(userId, 24, setReviews24HoursCount);
  }, [userId]); // Re-run when userId changes

  useEffect(() => {
    fetch(`/api/items/${userId}/0`)
      .then(handleResponse)
      .then(data => {
        setReviewsNow(data.itemsDueWithoutLessons); // Ensure this is an array
      })
      .catch(e => handleError(e, 'reviews'));

  }, [userId]); // Re-run when userId changes

  // Render the review counts
  return (
    <div>
      <NavBar />
      <h2>Review Counts for User {userId}</h2>
      <p>Due now: {reviewsNowCount} (minus lessons)</p>
      <p>Due in the next hour: {reviews1HourCount}</p>
      <p>Due in the next 24 hours: {reviews24HoursCount}</p>
      <button onClick={function() {startReviewSession(true)}}>Start Review Session</button>
      <button onClick={function() {startReviewSession(false)}}>Start Ungraded Session</button>
      <h2>Reviews due now</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Bird Call ID</th>
            <th>Level</th>
            <th>Last Reviewed</th>
            <th>Next Review</th>
          </tr>
        </thead>
        <tbody>
          {reviewsNow.map((r) => (
            <tr key={r._id}> {/* Ensure your data has a unique 'id' property */}
              <td>{r.userId}</td>
              <td>{r.birdCallId}</td>
              <td>{r.level}</td>
              <td>{r.lastReviewed}</td>
              <td>{r.nextReviewDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsPage;
