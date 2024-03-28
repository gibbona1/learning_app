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
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

export default function HomePage() {
  const currentUserId = '65fcc504b999225e008c71c5';
  const [countData, setCountData] = useState("");
  const [chartData, setChartData] = useState({});

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
    if(!countData) {
      setChartData({});
    } else {
      const currentHour = new Date().getHours(); // Note: This gets the current hour in local time

      const labels = countData.map((item) => (item.hour + currentHour) % 24);
      const data   = countData.map((item) => item.count);

      const d = {
        labels: labels,
        datasets: [
          {
            label: 'Item Count',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      }
      setChartData(d);
    }
  }, [countData]);

  return (
  <div>
    <NavBar />
    <h1>Home Page</h1>
    <p>Welcome to our application!</p>
    {countData ? (<Bar options={options} data={chartData} />) : (<p>Loading...</p>)}
  </div>
  );
}
