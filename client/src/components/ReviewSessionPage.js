import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FetchHttpHandler } from "@smithy/fetch-http-handler";
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { writeFileSync } = require('fs');

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

  const client = new S3Client({region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    credentials: {accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
     }});
  async function downloadObject(bucketName, objectKey, outputPath) {
      try {
          const response = await client.send(new GetObjectCommand({
              Bucket: bucketName,
              Key: objectKey,
          }));
          alert("here");
          const bodyContent = await streamToBuffer(response.Body);
          writeFileSync(outputPath, bodyContent);
          alert(`File downloaded successfully to ${outputPath}`);
      } catch (err) {
          alert("Error downloading file:", err);
      }
  }

  function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
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
      //alert(result); // Handle the resolved value
    } catch (error) {
      alert(error); // Handle any errors
    }
  }

  if(currentReview) {
    //alert("currentReview: " + JSON.stringify(currentReview));
    //let signed_url = 
    //downloadObject("my-audio-bucket-2024", "CARNSOREMET_20220707_080200_93_96.wav", "public/downloaded_file.wav");
    //alert("got audio");
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
          <audio controls src={"https://my-audio-bucket-2024.s3.eu-north-1.amazonaws.com/CARNSOREMET_20220707_080200_93_96.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAU6GDUXRVNJ2SNGVI%2F20240327%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20240327T204653Z&X-Amz-Expires=3600&X-Amz-Signature=417f011ec66d28e8a3a4dcdcc56b6708863e4d3132dd890d764693473431c3b7&X-Amz-SignedHeaders=host&x-id=GetObject"}>
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