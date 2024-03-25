import React, { useEffect, useState } from 'react';

function UserLevelsPage() {
  const [userLevels, setUserLevels] = useState([]);

  useEffect(() => {
    fetch('api/userlevels', {accept: "application/json"}) // Adjust URL as needed
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
        setUserLevels(data);
      })
      //.then(data => setBirdCalls(data))
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('Error fetching users: ' + error.message); // Alerting the error message
      });
  }, []);


  return (
    <div>
      <h2>User Page</h2>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {userLevels.map((call) => (
            <tr key={call._id}> {/* Ensure your data has a unique 'id' property */}
              <td>{call.levelNumber}</td>
              <td>{call.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default UserLevelsPage;