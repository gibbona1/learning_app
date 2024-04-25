import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse, handleError } from './helpers';

function UserLevelsPage() {
  const [userLevels, setUserLevels] = useState([]);

  useEffect(() => {
    fetch('api/userlevels')
      .then(handleResponse)
      .then(setUserLevels)
      .catch(e => handleError(e, 'user levels'));
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