import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { handleResponse, handleError } from './helpers';

function BirdCallsPage({ userId }) {
  const [birdCalls, setBirdCalls] = useState([]);
  const [items, setItems] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [user, setUser] = useState([]);
  const [itemStats, setItemStats] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);

  useEffect(() => {
    fetch(`api/users/${userId}`)
      .then(handleResponse)
      .then(setUser)
      .catch(e => handleError(e, 'user'));
    
    fetch(`api/items/?userId=${userId}`)
      .then(handleResponse)
      .then(setItems)
      .catch(e => handleError(e, 'items'));
    
    fetch(`api/itemstats/${userId}`)
      .then(handleResponse)
      .then(setItemStats)
      .catch(e => handleError(e, 'item stats'));
  }, [userId]);

  useEffect(() => {
    fetch('api/birdcalls')
      .then(handleResponse)
      .then(setBirdCalls)
      .catch(e => handleError(e, 'bird calls'));
  }, []);

  useEffect(() => {
    Promise.all([items, birdCalls, itemStats]).then(values => {
      const [items, birdCalls, itemStats] = values;
      mergeData(items, birdCalls, user, itemStats);
    });
  }, [items, birdCalls, user, itemStats]);

  function mergeData(items, birdCalls, user, itemStats) {
    const merged = items.map(item => {
      const birdCallData = birdCalls.find(birdCall => birdCall._id === item.birdCallId);
      const itemStatData = itemStats.find(itemStat => itemStat.id === item._id);
      // if item level is zero, set next review date to blank
      if (item.level === 0) {
        item.nextReviewDate = '';
        if (birdCallData?.level > user.level) {
          item.level = 'Locked';
        } else {
          item.level = 'Unlocked';
        }
      } else if (new Date(item.nextReviewDate) < new Date()) {
        item.nextReviewDate = 'Now';
      }
      return { ...item, birdCallData, itemStatData }; // Combine review with corresponding bird call data
    });
    setMergedData(merged);
  }

  useEffect(() => {
    //find items in merged data with itemStats.counts levelup/levelup+leveldown < 0.7
    const critData = mergedData.filter(item => {
      const counts = item.itemStatData.counts;
      return counts && counts['lesson-complete'] > 0 && counts['level-up'] && counts['level-down'] && counts['level-up'] / (counts['level-up'] + counts['level-down']) < 0.7;
    });

    const criticalItems = critData.map(item => {
      const res = {
        id: item._id,
        name: item.birdCallData.name,
        accuracy: item.itemStatData.counts['level-up'] / (item.itemStatData.counts['level-up'] + item.itemStatData.counts['level-down'])
      }
      return res;
    });
    setCriticalItems(criticalItems);
  }, [mergedData]);

  alert(JSON.stringify(criticalItems));

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
            <th>Stats</th>
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
              <td>
              {
                item.itemStatData?.counts?.['lesson-complete'] > 0
                  ? JSON.stringify(item.itemStatData.counts)
                  : ''
              }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Critical Items</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>% Correct</th>
          </tr>
        </thead>
        <tbody>
          {criticalItems.map((item) => (
            <tr key={item._id}> {/* Ensure your data has a unique 'id' property */}
              <td>{item.name}</td>
              <td>{(item.accuracy * 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BirdCallsPage;
