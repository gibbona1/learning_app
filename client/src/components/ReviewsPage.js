import React, { useEffect, useState } from 'react';

function ReviewsPage() {
  // State to store counts
  const userId = '65fcc504b999225e008c71c5';
  const [reviewsNow, setReviewsNow] = useState(0);
  const [reviewsInOneHour, setReviews1Hour] = useState(0);
  const [reviewsInTwentyFourHours, setReviews24Hours] = useState(0);

  async function fetchReviewCounts(userId, hours, setFn) {
    try {
      fetch(`/api/items/${userId}/${hours}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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
    fetchReviewCounts(userId, 0, setReviewsNow);
    fetchReviewCounts(userId, 1, setReviews1Hour);
    fetchReviewCounts(userId, 24, setReviews24Hours);
    }, [userId]); // Re-run when userId changes

  // Render the review counts
  return (
    <div>
      <h2>Review Counts for User {userId}</h2>
      <p>Due now: {reviewsNow}</p>
      <p>Due in the next hour: {reviewsInOneHour}</p>
      <p>Due in the next 24 hours: {reviewsInTwentyFourHours}</p>
    </div>
  );
};

export default ReviewsPage;
