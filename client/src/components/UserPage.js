import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse, handleError, handleFetch } from './helpers';

function UserPage({ userId, userRole }) {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    handleFetch('api/classrooms', setClasses, 'classes');
  }, []);

  useEffect(() => {
    fetch('api/users')
      .then(handleResponse)
      .then(data => {
        if (userRole === 'admin') {
          return data;  
        } else if (userRole === 'teacher') {
          const dsub = data.filter(u => u.role === 'learner' && classes.some(c => c.teacher === userId && c.learners.includes(u._id)));
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
            <tr key={call._id}>
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