import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { handleResponse, handleError } from './helpers';
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

export default function ReviewSession() {
  const location = useLocation();
  const currentUserId = location.state.userId;
  const [mergedData, setMergedData] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [specUrl, setSpecUrl] = useState("");
  const [inputValue, setInputValue] = useState('');
  const [validationState, setValidationState] = useState(''); // 'correct', 'incorrect', or ''
  const [submitState, setSubmitState] = useState(''); // 'submitted' or ''

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setValidationState(''); // Reset validation state on input change
  };

  const handleCheck = () => {
    // TODO: Implement your "close enough" logic here if needed
    if (inputValue.trim().toLowerCase() === currentReview.birdCallData.class.toLowerCase()) {
      setValidationState('correct');
    } else {
      setValidationState('incorrect');
    }
  };

  const handleSubmit = () => {
    setSubmitState('submitted');
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchReviews = fetch(`/api/items/${currentUserId}/0`)
      .then(handleResponse)
      .then(data => {
        return data.itemsDueWithoutLessons; // Ensure this is an array
      })
      .catch(e => handleError(e, 'reviews'));


    const fetchBirdCalls = fetch(`/api/birdcalls`)
      .then(handleResponse)
      .catch(e => handleError(e, 'bird calls'));


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
    setCurrentIndex(prevIndex => prevIndex + 1);
  }

  function goToPreviousReview() {
    setCurrentIndex(prevIndex => prevIndex - 1);
  }

  const currentReview = mergedData[currentIndex];

  useEffect(() => {
    async function makeSignedUrl(bucketName, objectKey, setFn) {
      try {
        const client = new S3Client({
          region: process.env.REACT_APP_AWS_DEFAULT_REGION,
          credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
          }
        });
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
        });
        const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
        setFn(signedUrl);
      } catch (err) {
        alert("Error downloading file from S3 Bucket:", err);
        return '';
      }
    }
    if (currentReview) {
      makeSignedUrl("my-audio-bucket-2024", currentReview.birdCallData.name, setAudioUrl);
      makeSignedUrl("my-audio-bucket-2024", `spectrograms/${currentReview.birdCallData.name.slice(0, -4)}.png`, setSpecUrl);
    }
  }, [currentReview]);

  useEffect(() => {
    if (submitState === '') {
      return;
    }
    if (validationState === 'correct') {
      fetch(`/api/items/${currentReview._id}/levelup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        params: { 'action': 'increment' }
      })
        .then(handleResponse)
        .then(data => {
          console.log('Successfully incremented item:', data);
          setSubmitState('');
          window.location.reload();
        })
        .catch(error => {
          console.log('Error updating item:', error);
        });
    } else if (validationState === 'incorrect') {
      fetch(`/api/items/${currentReview._id}/levelup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'decrement' })
      })
        .then(handleResponse)
        .then(data => {
          console.log('Successfully decremented item:', data);
          setSubmitState('');
          window.location.reload();
        })
        .catch(error => {
          console.log('Error updating item:', error);
        });
    }
  }, [currentReview, validationState, submitState]);

  return (
    <div>
      {currentReview ? (
        <>
          <NavBar />
          <h3>{currentReview.birdCallData.name}  ({currentIndex + 1}/{mergedData.length})</h3>
          <p>ID: {currentReview._id}</p>
          <p>Class: {currentReview.birdCallData.class}</p>
          <p>Level: {currentReview.birdCallData.level}</p>
          <img src={specUrl} alt="Spectrogram" /><br />
          <button onClick={goToPreviousReview} disabled={currentIndex === 0 || validationState === ''}>Previous Review</button>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
          <button onClick={goToNextReview} disabled={currentIndex === mergedData.length - 1 || validationState === ''}>Next Review</button>
          <br />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(); }}
            style={{ backgroundColor: validationState === 'correct' ? 'rgba(0, 255, 0, .2)' : validationState === 'incorrect' ? 'rgba(255, 0, 0, .2)' : '' }}
          />
          <button onClick={handleSubmit} disabled={validationState === ''}>Submit</button>
        </>
      ) : (
        <p>No more reviews.</p>
      )}
    </div>
  );
}