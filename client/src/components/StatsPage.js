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
import { handleResponse, handleError, handleFetch, calc_dhm, secondsToDHM, shiftDate, getTooltipDataAttrs, handleClick, github_colour } from './helpers';

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

export default function StatsPage({ userId }) {
  const [fetchData, setFetchData] = useState({
    count: [], level: [], stats: [], stats24: [], activity: [], activityHour: []
  });
  const [chartData, setChartData] = useState({
    count: [], level: [], activity: [], activityHour: []
  });
  const [statData, setStatData] = useState(
    {averageDuration: [], timeOnApp: 0, projectNextLevel: '', streak: [], startDate: '', lastYearActivity: [], numItemsMaxLevel: 0}
  );

  useEffect(() => {
    handleFetch(`/api/itemsgetbyhour/${userId}`, 
    (data) => setFetchData(p => ({...p, count: data})),
    'reviews');

    fetch(`api/users/${userId}`)
      .then(handleResponse)
      .then(user => {
        const now = new Date(); // Current date/time
        const n = user?.levelData.length;
        var data = [{ level: 0, duration: 0 }];
        if (n > 0) {
          data = user?.levelData.map(level => ({
            level: level.level,
            // Use endDate if it exists; otherwise, use current date/time
            duration: (new Date(level.endDate || now) - new Date(level.startDate)) / (1000 * 60 * 60 * 24) // Convert to days
          }));
        }

        let avg;
        if (user.levelData[user.level]?.endDate) {
          avg = Array(n).fill(data.reduce((sum, current) => sum + current.duration, 0) / n);
        } else {
          avg = Array(n).fill(data.slice(0, -1).reduce((sum, current) => sum + current.duration, 0) / (n - 1));
        }
        setFetchData(p => ({...p, level: data}));
        setStatData(p => ({...p, averageDuration: avg, startDate: new Date(user.registrationDate).toISOString().split('T')[0]}));
      })
      .catch(e => handleError(e, 'user'));

    fetch(`api/users/${userId}/projectlevelup`)
      .then(handleResponse)
      .then(data => {
        if (data?.projection) {
          setStatData(p => ({...p, projectNextLevel: `Time on level: ${data.duration}.\nNext levelup in: ${calc_dhm(data.projection)}`}));
        } else if (data?.message) {
          setStatData(p => ({...p, projectNextLevel: `Level-up projection: ${data.message}`}));
        } else {
          setStatData(p => ({...p, projectNextLevel: ""}));
        }
      })
      .catch(e => handleError(e, 'levelup projection'));
    
    handleFetch(`api/useractivity24Hour/${userId}`, (d) => setFetchData(p => ({...p, activity: d})), 'activity 24 hour');
    
    handleFetch(`api/userstats/${userId}`, (d) => setFetchData(p => ({...p, stats: d})), 'user stats');
    
    handleFetch(`api/userstats/${userId}/?recentActivity=true`, (d) => setFetchData(p => ({...p, stats24: d})), 'user stats (last 24 hours)');
    
    handleFetch(`api/useractivityPerHour/${userId}`, (d) => setFetchData(p => ({...p, activityHour: d})), 'activity per hour');

    handleFetch(`api/sessions/${userId}/timeOnApp`, (d) => setStatData(p => ({...p, timeOnApp: d.timeOnApp})), 'time on app');
    
    handleFetch(`api/sessions/${userId}/streak`, (d) => setStatData(p => ({...p, streak: d})), 'streak');

    fetch(`api/sessions/${userId}/lastYearActivity`)
      .then(handleResponse)
      .then(data => {
        const d = data.sessionCounts.map(item => ({ date: new Date(item._id.year, item._id.month - 1, item._id.day), count: item.count }));
        return d;
      })
      .then(data => setStatData(p => ({...p, lastYearActivity: data})))
      .catch(e => handleError(e, 'last year activity'));

    handleFetch(`api/itemsmaxlevel/${userId}`,
    (data) => setStatData(p => ({...p, numItemsMaxLevel: data})), 
    'max level');
  }, [userId]);

  useEffect(() => {
    const currentHour = new Date().getHours(); // Note: This gets the current hour in local time
    const countData = fetchData.count;
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
    setChartData(p => ({...p, count: d}))
  }, [fetchData]);

  useEffect(() => {
    const levelData = fetchData.level;
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
          data: statData.averageDuration,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    }
    setChartData(p => ({...p, level: d}))
  }, [statData, fetchData]);

  useEffect(() => {
    const activityData = fetchData.activity;
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
    setChartData(p => ({...p, activity: data}));
  }, [fetchData]);

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
    const activityHourData = fetchData.activityHour;
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
    setChartData(p => ({...p, activityHour: data}))
  }, [fetchData]);

  return (
    <div>
      <NavBar />
      <h1>Stats Page</h1>
      {fetchData.count.length === 0 ? (<p>Loading review counts...</p>) : (<Bar options={countOptions} data={chartData.count} />)}
      <hr />
      {fetchData.level.length === 0 ? (<p>Loading levelup chart...</p>) : (<Line options={levelOptions} data={chartData.level} />)}
      <hr />
      {statData.averageDuration.length === 0 ? (<p>Loading average duration...</p>) : (`Average duration: ${calc_dhm(statData.averageDuration[0])}`)}
      <br />
      <div style={{ 'white-space': 'pre-wrap' }}>{statData.projectNextLevel}</div>
      <hr />
      {`Number of items at max level: ${JSON.stringify(statData.numItemsMaxLevel.numMaxLevel)}`}
      <hr />
      {Object.keys(fetchData.activity).length === 0 ? (<p>Loading activity chart...</p>) : (
        <Bar data={chartData.activity} options={activityOptions} />
      )}
      <hr />
      {fetchData.stats.length === 0 ? (<p>Loading user stats...</p>) :
        (<div>
          {Object.entries(fetchData.stats).map(([key, value]) => (
            <div key={key}>
              {key}: {value}{userStatsPercent(fetchData.stats, key, value)}
            </div>
          ))}
        </div>
        )}
      <hr />
      {fetchData.activityHour.every(dict => Object.values(dict).every(value => value === 0)) ? (<p>Loading activity per hour chart...</p>) : (
        <Bar data={chartData.activityHour} options={activityHourOptions} />
      )}
      <hr />
      <p>Start Date: {statData.startDate}. Time on App: {secondsToDHM(statData.timeOnApp / 1000)}</p>
      <p>Streak: {statData.streak.streak}. Max Streak: {statData.streak.maxStreak}</p>
      {fetchData.stats24.length === 0 ? 
        (<p>Loading user stats (last 24 hours)...</p>) :
        (<p>Number of reviews completed in last 24 hours: {(fetchData.stats24['level-up'] || 0) + (fetchData.stats24['level-down'] || 0)}</p>)
      }
      <hr />
      {statData.lastYearActivity.length === 0 ? (<p>Loading last year activity...</p>) : (
        <div>
          <CalendarHeatmap
            startDate={shiftDate(today, -365)}
            endDate={today}
            values={statData.lastYearActivity}
            classForValue={value => github_colour(value)}
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
