import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

export default function ReviewSession() {
  const location = useLocation();
  const currentUserId = location.state.userId;
  const [mergedData, setMergedData] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [specUrl, setSpecUrl] = useState("");

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
  
  return (
    <div>
      {currentReview ? (
        <>
          <h3>{currentReview.birdCallData.name}</h3>
          <p>Class: {currentReview.birdCallData.class}</p>
          <p>Level: {currentReview.birdCallData.level}</p>
          <img src={specUrl} alt="Spectrogram"/>
          <audio controls src={audioUrl}>
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