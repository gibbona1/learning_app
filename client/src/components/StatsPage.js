import React, { useState, useEffect } from 'react';
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
import ReactToolTip from 'react-tooltip';
import CalendarHeatmap from 'react-calendar-heatmap';
import { handleResponse, handleError, handleFetch } from './helpers';

import 'react-calendar-heatmap/dist/styles.css';

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

const today = new Date();

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

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
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += calc_dhm(context.raw);
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

export const activityOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Activity Counts in the Last 24 Hours',
    },
  },
  scales: {
    x: { stacked: true },
    y: { stacked: true }
  }
};

export const activityHourOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Activity Per Hour in lifetime',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      y: { stacked: true },
      ticks: {
        precision: 0, // Ensure y-axis values are integers
      },
    }
  }
};

export function calc_dhm(durationInDays) {
  const days = Math.floor(durationInDays);
  const hours = Math.floor((durationInDays - days) * 24);
  const minutes = Math.round(((durationInDays - days) * 24 - hours) * 60);

  return `${days} days, ${hours} hours, ${minutes} mins`;
}

export function secondsToDHM(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

export const getTooltipDataAttrs = (value) => {
  // Temporary hack around null value.date issue
  if (Object.values(value).some(val => val === null || val === undefined)) {
    return null;
  }
  // Configuration for react-tooltip
  return {
    'data-tooltip-id': "my-tooltip",
    'data-tooltip-content': `${value.date.toISOString().slice(0, 10)} has count: ${value.count}`,
  };
};

export const handleClick = (value) => {
  alert(`You clicked on ${value.date.toISOString().slice(0, 10)} with count: ${value.count}`);
};

export default function StatsPage({ userId }) {
  const [countData, setCountData] = useState([]);
  const [countChartData, setCountChartData] = useState([]);
  const [levelData, setLevelData] = useState([]);
  const [LevelChartData, setLevelChartData] = useState([]);
  const [averageDuration, setAverageDuration] = useState([]);
  const [projectNextLevel, setProjectNextLevel] = useState("Calculating projection...");
  const [activityData, setActivityData] = useState([]);
  const [activityChartData, setActivityChartData] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [userStats24Hours, setUserStats24Hours] = useState([]);
  const [activityHourData, setActivityHourData] = useState([]);
  const [activityHourChartData, setActivityHourChartData] = useState([]);
  const [timeOnApp, setTimeOnApp] = useState(0);
  const [streak, setStreak] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [lastYearActivity, setLastYearActivity] = useState([]);
  const [numItemsMaxLevel, setNumItemsMaxLevel] = useState(0);

  useEffect(() => {
    handleFetch(`/api/itemsgetbyhour/${userId}`, setCountData, 'reviews');

    fetch(`api/users/${userId}`)
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
        if (user.levelData[user.level]?.endDate) {
          avg = Array(n).fill(data.reduce((sum, current) => sum + current.duration, 0) / n);
        } else {
          avg = Array(n).fill(data.slice(0, -1).reduce((sum, current) => sum + current.duration, 0) / (n - 1));
        }
        setLevelData(data);
        setAverageDuration(avg);
        setStartDate(new Date(user.registrationDate).toISOString().split('T')[0])
      })
      .catch(e => handleError(e, 'user'));

    fetch(`api/users/${userId}/projectlevelup`)
      .then(handleResponse)
      .then(data => {
        if (data?.projection) {
          setProjectNextLevel(`Time on level: ${data.duration}.\nNext levelup in: ${calc_dhm(data.projection)}`);
        } else if (data?.message) {
          setProjectNextLevel(`Level-up projection: ${data.message}`);
        } else {
          setProjectNextLevel("");
        }
      })
      .catch(e => handleError(e, 'levelup projection'));

    handleFetch(`api/useractivity24Hour/${userId}`, setActivityData, 'activity 24 hour');
    
    handleFetch(`api/userstats/${userId}`, setUserStats, 'user stats');
    
    handleFetch(`api/userstats/${userId}/?recentActivity=true`, setUserStats24Hours, 'user stats (last 24 hours)');
    
    handleFetch(`api/useractivityPerHour/${userId}`, setActivityHourData, 'activity per hour');

    handleFetch(`api/sessions/${userId}/timeOnApp`, setTimeOnApp, 'time on app');
    
    handleFetch(`api/sessions/${userId}/streak`, setStreak, 'streak');

    fetch(`api/sessions/${userId}/lastYearActivity`)
      .then(handleResponse)
      .then(data => {
        const d = data.sessionCounts.map(item => ({ date: new Date(item._id.year, item._id.month - 1, item._id.day), count: item.count }));
        return d;
      })
      .then(setLastYearActivity)
      .catch(e => handleError(e, 'last year activity'));

    handleFetch(`api/itemsmaxlevel/${userId}`, setNumItemsMaxLevel, 'max level');
  }, [userId]);

  useEffect(() => {
    const currentHour = new Date().getHours(); // Note: This gets the current hour in local time
    const labels = countData ? countData.map((item) => `${(item.hour + currentHour) % 24}:00`) : [];
    const data = countData ? countData.map((item) => item.count) : [];
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
    const data = levelData ? levelData.map((item) => (item.duration)) : [];
    const labels = levelData ? levelData.map((item) => (`Level ${item.level}`)) : [];

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
    const labels = Object.keys(activityData);
    const dataValues = Object.values(activityData);

    const datasets = [];

    const colors = {
      "lesson-complete": 'rgba(255, 99, 132, 0.5)',
      "level-up": 'rgba(54, 162, 235, 0.5)',
      "incorrect": 'rgba(255, 206, 86, 0.5)',
      "complete": 'rgba(75, 192, 192, 0.5)',
      "reset": 'rgba(153, 102, 255, 0.5)'
    };

    dataValues.forEach((data, index) => {
      const color = colors[labels[index]];
      datasets.push({
        label: labels[index],
        data: [data],
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      });
    });

    const data = {
      labels: ['Activity Counts'], // Only one label for the y-axis
      datasets: datasets
    };
    setActivityChartData(data);
  }, [activityData]);

  function userStatsPercent(userStats, key, value) {
    const totalIncrementsAndDecrements = (userStats['level-up'] || 0) + (userStats['level-down'] || 0);

    let percentageDisplay = "";
    if ((key === "level-up" || key === "level-down") && totalIncrementsAndDecrements > 0) {
      const percentage = (value / totalIncrementsAndDecrements * 100).toFixed(2); // Round to two decimal places
      percentageDisplay = ` (${percentage}%)`;
    }
    return percentageDisplay;
  }

  useEffect(() => {
    const labels = activityHourData.map((value, index) => index);//Object.index(activityHourData);
    const dataValues = Object.values(activityHourData);

    const datasets = [];

    const colors = {
      "lesson-complete": 'rgba(255, 99, 132, 0.5)',
      "level-up": 'rgba(54, 162, 235, 0.5)',
      "incorrect": 'rgba(255, 206, 86, 0.5)',
      "complete": 'rgba(75, 192, 192, 0.5)',
      "reset": 'rgba(153, 102, 255, 0.5)'
    };

    dataValues.forEach((data, index) => {
      const color = colors[labels[index]];
      datasets.push({
        label: labels[index],
        data: [data],
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      });
    });

    const data = {
      labels: labels, // Only one label for the y-axis
      datasets: datasets
    };
    setActivityHourChartData(data);
  }, [activityHourData]);

  return (
    <div>
      <NavBar />
      <h1>Stats Page</h1>
      {countData.length === 0 ? (<p>Loading review counts...</p>) : (<Bar options={countOptions} data={countChartData} />)}
      <hr />
      {levelData.length === 0 ? (<p>Loading levelup chart...</p>) : (<Line options={levelOptions} data={LevelChartData} />)}
      <hr />
      {averageDuration.length === 0 ? (<p>Loading average duration...</p>) : (`Average duration: ${calc_dhm(averageDuration[0])}`)}
      <br />
      <div style={{ 'white-space': 'pre-wrap' }}>{projectNextLevel}</div>
      <hr />
      {`Number of items at max level: ${JSON.stringify(numItemsMaxLevel.numMaxLevel)}`}
      <hr />
      {Object.keys(activityData).length === 0 ? (<p>Loading activity chart...</p>) : (
        <Bar data={activityChartData} options={activityOptions} />
      )}
      <hr />
      {userStats.length === 0 ? (<p>Loading user stats...</p>) :
        (<div>
          {Object.entries(userStats).map(([key, value]) => (
            <div key={key}>
              {key}: {value}{userStatsPercent(userStats, key, value)}
            </div>
          ))}
        </div>
        )}
      <hr />
      {activityHourData.every(dict => Object.values(dict).every(value => value === 0)) ? (<p>Loading activity per hour chart...</p>) : (
        <Bar data={activityHourChartData} options={activityHourOptions} />
      )}
      <hr />
      <p>Start Date: {startDate}. Time on App: {secondsToDHM(timeOnApp.timeOnApp / 1000)}</p>
      <p>Streak: {streak.streak}. Max Streak: {streak.maxStreak}</p>
      {userStats24Hours.length === 0 ? 
        (<p>Loading user stats (last 24 hours)...</p>) :
        (<p>Number of reviews completed in last 24 hours: {(userStats24Hours['level-up'] || 0) + (userStats24Hours['level-down'] || 0)}</p>)
      }
      <hr />
      {lastYearActivity.length === 0 ? (<p>Loading last year activity...</p>) : (
        <div>
          <CalendarHeatmap
            startDate={shiftDate(today, -365)}
            endDate={today}
            values={lastYearActivity}
            classForValue={value => {
              if (!value) {
                return 'color-empty';
              }
              const val = value.count >= 4 ? 4 : value.count;
              return `color-github-${val}`;
            }}
            tooltipDataAttrs={getTooltipDataAttrs}
            showWeekdayLabels={true}
            onClick={handleClick}
          />
          <ReactToolTip id="my-tooltip" />
        </div>
      )}
    </div>
  );
}
