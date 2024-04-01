import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse } from './helpers';

function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('api/users', {accept: "application/json"}) // Adjust URL as needed
      .then(handleResponse)
      .then(data => {
        // Use JSON.stringify to convert the JSON object to a string for the alert.
        //alert(JSON.stringify(data, null, 2)); // null, 2 for pretty-printing
        // Then set your state as normal (assuming you add setBirdCalls back in)
        setUsers(data);
      })
      //.then(data => setBirdCalls(data))
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