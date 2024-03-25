import React, { useEffect, useState } from 'react';

function BirdCallsPage() {
  const [birdCalls, setBirdCalls] = useState([]);

  useEffect(() => {
    fetch('api/birdcalls', {accept: "application/json"}) // Adjust URL as needed
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(data => {
        // Use JSON.stringify to convert the JSON object to a string for the alert.
        //alert(JSON.stringify(data, null, 2)); // null, 2 for pretty-printing
  
        // Then set your state as normal (assuming you add setBirdCalls back in)
        setBirdCalls(data);
      })
      //.then(data => setBirdCalls(data))
      .catch(error => {
        console.error('Error fetching bird calls:', error);
        alert('Error fetching bird calls: ' + error.message); // Alerting the error message
      });
  }, []);


  return (
    <div>
      <h2>Bird Calls</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Level</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {birdCalls.map((call) => (
            <tr key={call._id}> {/* Ensure your data has a unique 'id' property */}
              <td>{call.name}</td>
              <td>{call.class}</td>
              <td>{call.level}</td>
              <td>{call.audioUrl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BirdCallsPage;
