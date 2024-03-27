import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FetchHttpHandler } from "@smithy/fetch-http-handler";
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

export default function ReviewSession() {
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

  function getObject () {
    return new Promise(async (resolve, reject) => {

      const client = new S3Client({region: process.env.REACT_APP_AWS_DEFAULT_REGION,
        credentials: {accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
         },
        requestHandler: new FetchHttpHandler({ keepAlive: false })});

      try {
        const response = await client.send(new GetObjectCommand({ 
                                            Bucket: "my-audio-bucket-2024", 
                                            Key: "CARNSOREMET_20220707_080200_93_96.wav" }));
        const buffer = Buffer.from(await response.Body.transformToByteArray())
        
        return buffer;
      } catch (err) {
        // Handle the error or throw
        reject(err);
      } 
    })
  }

  async function fetchObject() {
    try {
      const result = await getObject();
      alert(result); // Handle the resolved value
    } catch (error) {
      alert(error); // Handle any errors
    }
  }

  if(currentReview) {
    //alert("currentReview: " + JSON.stringify(currentReview));
    const audio = fetchObject();
    alert(JSON.stringify(audio));
  } else {
    console.log("No current review");
  }
  
  return (
    <div>
      {currentReview ? (
        <>
          <h3>{currentReview.birdCallData.name}</h3>
          <p>Class: {currentReview.birdCallData.class}</p>
          <p>Level: {currentReview.birdCallData.level}</p>
          <audio controls src={currentReview.birdCallData.audioUrl + '.wav'}>
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