import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse, handleError } from './helpers';

function UserPage({ userId, userRole }) {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch('api/classrooms') 
      .then(handleResponse)
      .then(setClasses)
      .catch(e => handleError(e, 'classes'));
  }, []);

  useEffect(() => {
    fetch('api/users', { accept: "application/json" }) // Adjust URL as needed
      .then(handleResponse)
      .then(data => {
        if (userRole === 'admin') {
          return data;  
        } else if (userRole === 'teacher') {
          const dsub = data.filter(user => user.role === 'learner' && classes.some(c => c.teacher === userId && c.learners.includes(user._id)));
          const dteacher = data.filter(user => user._id === userId);
          return dteacher.concat(dsub);
        } else {
          return data.filter(user => user._id === userId);
        }
      })
      .then(setUsers)
      .catch(e => handleError(e, 'users'));
  }, [classes, userId, userRole]);


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