import React, { useEffect, useState } from 'react';

function BirdCallsPage() {
  const [birdCalls, setBirdCalls] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/birdcalls') // Adjust URL as needed
      .then(response => response.json())
      .then(data => setBirdCalls(data))
      .catch(error => console.error('Error fetching bird calls:', error));
  }, []);

  return (
    <div>
      <h2>Bird Calls</h2>
      <ul>
        {birdCalls.map((call) => (
          <li key={call.id}>{call.name} - Level: {call.level}</li>
        ))}
      </ul>
    </div>
  );
}

export default BirdCallsPage;
