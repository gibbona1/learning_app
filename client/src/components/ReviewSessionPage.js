import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
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

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setValidationState(''); // Reset validation state on input change
  };

  const handleCheck = () => {
    // Implement your "close enough" logic here if needed
    //alert(inputValue.trim().toLowerCase() + "-" + currentReview.birdCallData.class.toLowerCase());
    if (inputValue.trim().toLowerCase() === currentReview.birdCallData.class.toLowerCase()) {
      setValidationState('correct');
    } else {
      setValidationState('incorrect');
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
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
    setCurrentIndex(prevIndex => prevIndex + 1);
  }

  function goToPreviousReview() {
    setCurrentIndex(prevIndex => prevIndex - 1);
  }

  const currentReview = mergedData[currentIndex];

  useEffect(() => {
    async function makeSignedUrl(bucketName, objectKey, setFn) {
      try {
          const client = new S3Client({region: process.env.REACT_APP_AWS_DEFAULT_REGION,
            credentials: {accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
            }});
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
    if (currentReview){
      makeSignedUrl("my-audio-bucket-2024", currentReview.birdCallData.name, setAudioUrl);
      makeSignedUrl("my-audio-bucket-2024", `spectrograms/${currentReview.birdCallData.name.slice(0, -4)}.png`, setSpecUrl);
    }
  }, [currentReview]);

  useEffect(() => {
    if(validationState === 'correct'){
      fetch(`/api/items/${currentReview._id}/levelup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {'action': 'increment'}
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Successfully decremented item:', data);
      })
      .catch(error => {
        console.log('Error updating item:', error);
      });
    } else if(validationState === 'incorrect'){
      fetch(`/api/items/${currentReview._id}/levelup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {'action': 'decrement'}
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Successfully decremented item:', data);
      })
      .catch(error => {
        console.log('Error updating item:', error);
      });
    }
  }, [currentReview, validationState]);
  
  return (
    <div>
      {currentReview ? (
        <>
          <NavBar />
          <h3>{currentReview.birdCallData.name}</h3>
          <p>Class: {currentReview.birdCallData.class}</p>
          <p>Level: {currentReview.birdCallData.level}</p>
          <img src={specUrl} alt="Spectrogram"/><br/>
          <button onClick={goToPreviousReview} disabled={currentIndex === 0 || validationState === ''}>Previous Review</button>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
          <button onClick={goToNextReview} disabled={currentIndex === mergedData.length - 1 || validationState === ''}>Next Review</button>
          <br/>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            style={{ borderColor: validationState === 'correct' ? 'green' : validationState === 'incorrect' ? 'red' : '' }}
          />
          <button onClick={handleCheck}>Enter</button>
        </>
      ) : (
        <p>No more reviews.</p>
      )}
    </div>
  );
}