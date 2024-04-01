import React, {useState, useEffect} from 'react';
import NavBar from './NavBar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { handleResponse, handleError } from './helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const countOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Review Counts by Hour',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0, // Ensure y-axis values are integers
      },
    }
  }
};

export const levelOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Levelup Times',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label +=  calc_dhm(context.raw);
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0, // Ensure y-axis values are integers
      },
      title: { // Correct way to set Y-axis title in Chart.js version 3+
        display: true,
        text: 'Days',
      },
    },
  }
};

export function calc_dhm(durationInDays){
  const days = Math.floor(durationInDays);
  const hours = Math.floor((durationInDays - days) * 24);
  const minutes = Math.round(((durationInDays - days) * 24 - hours) * 60);

  return `${days} days, ${hours} hours, ${minutes} mins`;
}

export default function HomePage() {
  const currentUserId = '66080d78dd6882236da18623';
  const [countData, setCountData] = useState([]);
  const [countChartData, setCountChartData] = useState([]);
  const [levelData, setLevelData] = useState([]);
  const [LevelChartData, setLevelChartData] = useState([]);
  const [averageDuration, setAverageDuration] = useState([]);
  const [projectNextLevel, setProjectNextLevel] = useState("Calculating projection...");
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    fetch(`/api/itemsgetbyhour/${currentUserId}`)
    .then(handleResponse)
    .then(setCountData)
    .catch(e => handleError(e, 'reviews'));

  }, [currentUserId]);

  useEffect(() => {
    fetch(`api/users/${currentUserId}`)
    .then(handleResponse)
    .then(user => {
      const now = new Date(); // Current date/time
      const n = user.levelData.length;
      const data = user.levelData.map(level => ({
        level: level.level,
        // Use endDate if it exists; otherwise, use current date/time
        duration: (new Date(level.endDate || now) - new Date(level.startDate)) / (1000 * 60 * 60 * 24) // Convert to days
      }));

      let avg;
      if(typeof(user.levelData[user.level].endDate) !== 'undefined'){
        avg = Array(n).fill(data.reduce((sum, current) => sum + current.duration, 0) / n);
      } else {
        avg = Array(n).fill(data.slice(0, -1).reduce((sum, current) => sum + current.duration, 0) / (n-1));
      }
      setLevelData(data);
      setAverageDuration(avg);
    })
    .catch(e => handleError(e, 'user'));
  }, [currentUserId]);

  useEffect(() => {
   fetch(`api/users/${currentUserId}/projectlevelup`)
    .then(handleResponse)
    .then(data => {
      if(data.projection){
        setProjectNextLevel(`Next levelup in: ${calc_dhm(data.projection)}`);
      } else if(data.message){
        setProjectNextLevel(data.message);
      } else {
        setProjectNextLevel("");
      }
    })
    .catch(e => handleError(e, 'levelup projection'));

  }, [currentUserId]);

  useEffect(() => {
    fetch('api/items/')
    .then(handleResponse)
    .then(data => {
      const dsub = data
      .filter(item => item.userId === currentUserId)
      .filter(item => item.activity.length > 0);
      const activity = dsub.map((item) => ({id: item._id, ...item.activity}));
      setActivityData(activity);
    })
  }, [currentUserId]);

  useEffect(() => {
    const currentHour = new Date().getHours(); // Note: This gets the current hour in local time
    const labels = countData? countData.map((item) => `${(item.hour + currentHour) % 24}:00`): [];
    const data = countData? countData.map((item) => item.count): [];
    const d = {
      labels: labels,
      datasets: [
        {
          label: 'Item Count',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    }
    setCountChartData(d);
  }, [countData]);

  useEffect(() => {
    const data   = levelData? levelData.map((item) => (item.duration)): [];
    const labels = levelData? levelData.map((item) => (`Level ${item.level}`)): [];

    const d = {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Item Count',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          type: 'line',
          label: 'Average Duration',
          data: averageDuration,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    }
    setLevelChartData(d);
  }, [levelData, averageDuration]);

  useEffect(() => {
    const now = new Date();

    // Calculate the time 24 hours ago
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Initialize an object to store counts for each type
    let typeCounts = {};

    // Iterate through each item
    activityData.forEach(item => {
        // Iterate through each activity
        Object.values(item)
        .filter(obj => typeof obj === 'object')
        .filter(obj => new Date(obj.date) >= yesterday)
        .forEach(activityObj => {
          // Check if the date is within the last 24 hours
          
          const type = activityObj.type;
          if (typeCounts[type]) {
              typeCounts[type]++;
          } else {
              typeCounts[type] = 1;
          }
        });
    });
  }, [activityData]);

  return (
  <div>
    <NavBar />
    <h1>Stats Page</h1>
    {countData.length === 0 ? (<p>Loading...</p>) : (<Bar options={countOptions} data={countChartData} />)}
    <hr />
    {levelData.length === 0 ? (<p>Loading...</p>) : (<Line options={levelOptions} data={LevelChartData} />)}
    <hr />
    {averageDuration.length === 0 ? (<p>Loading...</p>) : (`Average duration: ${calc_dhm(averageDuration[0])}`)}
    <br />
    {projectNextLevel}
  </div>
  );
}
