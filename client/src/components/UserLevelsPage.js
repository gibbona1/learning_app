import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse } from './helpers';

function UserLevelsPage() {
  const [userLevels, setUserLevels] = useState([]);

  useEffect(() => {
    fetch('api/userlevels', {accept: "application/json"}) // Adjust URL as needed
      .then(handleResponse)
      .then(setUserLevels)
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('Error fetching users: ' + error.message); // Alerting the error message
      });
  }, []);


  return (
    <div>
      <NavBar />
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