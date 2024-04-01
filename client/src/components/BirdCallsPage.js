import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';

function BirdCallsPage() {
  const userId = '65fcc504b999225e008c71c5';

  const [birdCalls, setBirdCalls] = useState([]);
  const [items, setItems] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetch(`api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json()
    })
    .then(data => {
      setUser(data);
    })
    //.then(data => setBirdCalls(data))
    .catch(error => {
      console.error('Error fetching bird calls:', error);
      alert('Error fetching bird calls: ' + error.message); // Alerting the error message
    });
  }, [userId]);

  useEffect(() => {
    fetch('api/birdcalls', {accept: "application/json"}) // Adjust URL as needed
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(data => {
        setBirdCalls(data);
      })
      //.then(data => setBirdCalls(data))
      .catch(error => {
        console.error('Error fetching bird calls:', error);
        alert('Error fetching bird calls: ' + error.message); // Alerting the error message
      });
  }, []);

  useEffect(() => {
    fetch('api/items') // Adjust URL as needed
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(data => {
        // Use JSON.stringify to convert the JSON object to a string for the alert.
        //alert(JSON.stringify(data, null, 2)); // null, 2 for pretty-printing
        const dsub = data.filter(item => item.userId === userId);
        // Then set your state as normal (assuming you add setItems back in)
        setItems(dsub);
      })
      //.then(data => setItems(data))
      .catch(error => {
        console.error('Error fetching items:', error);
        alert('Error fetching items: ' + error.message); // Alerting the error message
      });
  }, [userId]);

  useEffect(() => {
    Promise.all([items, birdCalls]).then(values => {
      const [items, birdCalls] = values;
      mergeData(items, birdCalls, user);
    });
    }, [items, birdCalls, user]);
  
  function mergeData(items, birdCalls, user) {
    const merged = items.map(item => {
      const birdCallData = birdCalls.find(birdCall => birdCall._id === item.birdCallId);
      // if item level is zero, set next review date to blank
      if (item.level === 0) {
        item.nextReviewDate = '';
        if(item.level > user.level) {
          item.level = 'Locked';
        } else {
          item.level = 'Unlocked';
        }
      } else if(new Date(item.nextReviewDate) < new Date()) {
        item.nextReviewDate = 'Now';
      }
      return { ...item, birdCallData }; // Combine review with corresponding bird call data
    });
    setMergedData(merged);
  }

  return (
    <div>
      <NavBar />
      <h2>Bird Calls</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Unlock Level</th>
            <th>Item Level</th>
            <th>Next review</th>
          </tr>
        </thead>
        <tbody>
          {mergedData.map((item) => (
            <tr key={item._id}> {/* Ensure your data has a unique 'id' property */}
              <td>{item.birdCallData.name}</td>
              <td>{item.birdCallData.class}</td>
              <td>{item.birdCallData.level}</td>
              <td>{item.level}</td>
              <td>{item.nextReviewDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BirdCallsPage;
