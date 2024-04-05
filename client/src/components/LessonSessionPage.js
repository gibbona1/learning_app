import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse, handleError } from './helpers';
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

export default function LessonSession({ userId }) {
  const [mergedData, setMergedData] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [specUrl, setSpecUrl] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchLessons = fetch(`/api/lessons`)
      .then(handleResponse)
      .then(data => {
        const dsub = data.filter(lesson => lesson.userId === userId);
        return dsub; // Ensure this is an array
      })
      .catch(e => handleError(e, 'lessons'));


    const fetchItems = fetch(`/api/items`)
      .then(handleResponse)
      .then(data => {
        const dsub = data.filter(item => item.userId === userId);
        return dsub; // Ensure this is an array
      })
      .catch(e => handleError(e, 'items'));

    const fetchBirdCalls = fetch(`/api/birdcalls`)
      .then(handleResponse)
      .catch(e => handleError(e, 'bird calls'));

    Promise.all([fetchLessons, fetchItems, fetchBirdCalls]).then(values => {
      const [lessons, fetchItems, birdCalls] = values;
      mergeData(lessons, fetchItems, birdCalls);
    });
  }, [userId]);

  function mergeData(lessons, items, birdCalls) {
    const merged = lessons.map(lesson => {
      const itemData = items.find(item => item._id === lesson.itemId);
      const birdCallData = birdCalls.find(birdCall => birdCall._id === itemData.birdCallId);
      return { ...lesson, itemData, birdCallData }; // Combine review with corresponding bird call data
    });
    setMergedData(merged);
  }

  function goToNextLesson() {
    setCurrentIndex(prevIndex => prevIndex + 1);
  }

  function goToPreviousLesson() {
    setCurrentIndex(prevIndex => prevIndex - 1);
  }

  function finishedLesson() {
    if (!currentLesson._id) {
      alert('Lesson ID is not available.');
      return;
    }
    fetch(`api/lessons/${currentLesson._id}/lessonCompleted`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(handleResponse)
      .then(data => {
        alert('Lesson completed successfully:', data);
        // reload page
        window.location.reload();
      })
      .catch(error => {
        alert('Error deleting lesson:', error);
      });
  }

  const currentLesson = mergedData[currentIndex];

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
    if (currentLesson) {
      makeSignedUrl("my-audio-bucket-2024", currentLesson.birdCallData.name, setAudioUrl);
      makeSignedUrl("my-audio-bucket-2024", `spectrograms/${currentLesson.birdCallData.name.slice(0, -4)}.png`, setSpecUrl);
    }
  }, [currentLesson]);

  return (
    <div>
      {currentLesson ? (
        <>
          <NavBar />
          <h3>{currentLesson.birdCallData.name} ({currentIndex + 1}/{mergedData.length})</h3>
          <p>ID: {currentLesson._id}</p>
          <p>Class: {currentLesson.birdCallData.class}</p>
          <p>Level: {currentLesson.birdCallData.level}</p>
          <img src={specUrl} alt="Spectrogram" /><br />
          <button onClick={goToPreviousLesson} disabled={currentIndex === 0}>Previous Lesson</button>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
          <button onClick={goToNextLesson} disabled={currentIndex === mergedData.length - 1}>Next Lesson</button>
          <br />
          <button onClick={finishedLesson}>Mark Done</button>
        </>
      ) : (
        <p>No more lessons.</p>
      )}
    </div>
  );
}