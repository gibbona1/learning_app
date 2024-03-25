import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ReviewSession() {
  const location = useLocation();
  const currentUserId = location.state.userId;
  const [mergedData, setMergedData] = useState([]);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  useEffect(() => {
    const fetchReviews = fetch(`/api/items/${currentUserId}/0`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data.itemsDueWithoutLessons; // Ensure this is an array
    })
    .catch (error => {
    console.error('Error fetching reviews:', error);
    });

    const fetchBirdCalls = fetch(`/api/birdcalls`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch (error => {
    console.error('Error fetching birdcalls:', error);
  });

  Promise.all([fetchReviews, fetchBirdCalls]).then(values => {
    const [reviews, birdCalls] = values;
    mergeData(reviews, birdCalls);
  });
  }, [currentUserId]);

  function mergeData(reviews, birdCalls) {
    const merged = reviews.map(review => {
      const birdCallData = birdCalls.find(birdCall => birdCall._id === review.birdCallId);
      return { ...review, birdCallData }; // Combine review with corresponding bird call data
    });
    setMergedData(merged);
  }

  function goToNextReview() {
    setCurrentReviewIndex(prevIndex => prevIndex + 1);
  }

  const currentReview = mergedData[currentReviewIndex];

  return (
    <div>
      {currentReview ? (
        <>
          <h3>{currentReview.birdCallData.name}</h3>
          <p>Class: {currentReview.birdCallData.class}</p>
          <p>Level: {currentReview.birdCallData.level}</p>
          <audio controls src={currentReview.birdCallData.audioUrl}>
            Your browser does not support the audio element.
          </audio>
          <button onClick={goToNextReview}>Next Review</button>
        </>
      ) : (
        <p>No more reviews.</p>
      )}
    </div>
  );
}

export default ReviewSession;
