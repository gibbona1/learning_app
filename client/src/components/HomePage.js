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
          const durationInDays = context.raw; // Assuming the raw value is the duration in days
          const days = Math.floor(durationInDays);
          const hours = Math.floor((durationInDays - days) * 24);
          const minutes = Math.round(((durationInDays - days) * 24 - hours) * 60);

          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += `${days} days, ${hours} hours, ${minutes} mins`;
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

export default function HomePage() {
  const currentUserId = '66080d78dd6882236da18623';
  const [countData, setCountData] = useState([]);
  const [countChartData, setCountChartData] = useState([]);
  const [levelData, setLevelData] = useState([]);
  const [LevelChartData, setLevelChartData] = useState([]);

  useEffect(() => {
    fetch(`/api/itemsgetbyhour/${currentUserId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setCountData(data); // Ensure this is an array
      return data; // Ensure this is an array
    })
    .catch (error => {
    console.error('Error fetching reviews:', error);
    });
  }, [currentUserId]);

  useEffect(() => {
    fetch(`api/users/${currentUserId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(user => {
      const now = new Date(); // Current date/time
      const levelDurations = user.levelData.map(level => ({
        level: level.level,
        // Use endDate if it exists; otherwise, use current date/time
        duration: (new Date(level.endDate || now) - new Date(level.startDate)) / (1000 * 60 * 60 * 24) // Convert to days
      }));
  
      setLevelData(levelDurations);
    })
    .catch (error => {
    console.error('Error fetching user:', error);
    });
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
    const averageDuration = levelData? Array(data.length).fill(data.reduce((sum, current) => sum + current, 0) / data.length): [];

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
  }, [levelData]);

  return (
  <div>
    <NavBar />
    <h1>Home Page</h1>
    <p>Welcome to our application!</p>
    {countData.length === 0 ? (<p>Loading...</p>) : (<Bar options={countOptions} data={countChartData} />)}
    <hr />
    {levelData.length === 0 ? (<p>Loading...</p>) : (<Line options={levelOptions} data={LevelChartData} />)}
  </div>
  );
}
