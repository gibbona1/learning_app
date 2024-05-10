import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse, handleError, handleFetch } from './helpers';

function UserPage({ userData }) {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    handleFetch('api/classrooms', setClasses, 'classes');
  }, []);

  useEffect(() => {
    fetch('api/users')
      .then(handleResponse)
      .then(data => {
        if (userData.role === 'admin') {
          return data;  
        } else if (userData.role === 'teacher') {
          const dsub = data.filter(u => u.role === 'learner' && classes.some(c => c.teacher === userData.id && c.learners.includes(u._id)));
          const dteacher = data.filter(user => user._id === userData.id);
          return dteacher.concat(dsub);
        } else {
          return data.filter(user => user._id === userData.id);
        }
      })
      .then(setUsers)
      .catch(e => handleError(e, 'users'));
  }, [classes, userData]);


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