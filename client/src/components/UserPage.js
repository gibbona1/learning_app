import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse, handleError } from './helpers';

function UserPage({ userId, userRole }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('api/users', { accept: "application/json" }) // Adjust URL as needed
      .then(handleResponse)
      .then(data => {
        if (userRole === 'admin') {
          return data;  
        } else if (userRole === 'teacher') {
          return data.filter(user => user.role === 'learner');
        } else {
          return data.filter(user => user._id === userId);
        }
      })
      .then(setUsers)
      .catch(e => handleError(e, 'users'));
  }, []);


  return (
    <div>
      <NavBar />
      <h2>User Page</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Registration Date</th>
            <th>level</th>
          </tr>
        </thead>
        <tbody>
          {users.map((call) => (
            <tr key={call._id}> {/* Ensure your data has a unique 'id' property */}
              <td>{call.username}</td>
              <td>{call.role}</td>
              <td>{call.registrationDate}</td>
              <td>{call.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default UserPage;