import React, {useState, useEffect} from 'react';
import NavBar from './NavBar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
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

export default function HomePage() {
  const currentUserId = '65fcc504b999225e008c71c5';
  const [countData, setCountData] = useState([]);
  const [chartData, setChartData] = useState([]);

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

  console.log(JSON.stringify(countData));

  useEffect(() => {
      const currentHour = new Date().getHours(); // Note: This gets the current hour in local time
      const labels = countData? countData.map((item) => (item.hour + currentHour) % 24): [];
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
      setChartData(d);
  }, [countData]);

  return (
  <div>
    <NavBar />
    <h1>Home Page</h1>
    <p>Welcome to our application!</p>
    {countData.length === 0 ? (<p>Loading...</p>) : (<Bar options={options} data={chartData} />)}
  </div>
  );
}
