import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './WeatherSummary.css'; // Import the CSS file

// Register necessary components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const WeatherSummary = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
       // const response = await axios.get('http://localhost:5000/api/weather-summaries');
       const response = await axios.get('http://localhost:5002/api/weather-summaries');
       console.log('API Response:', response.data);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather summaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getChartData = () => {
    const aggregatedData = {};

    weatherData.forEach(data => {
      const city = data.city;
      const date = new Date(data.date).toLocaleString(); // Store local time string

      if (!aggregatedData[city]) {
        aggregatedData[city] = {
          avgTemp: 0,
          maxTemp: -Infinity,
          minTemp: Infinity,
          avgHumidity: 0,
          avgWindSpeed: 0,
          count: 0,
          dates: [], // Store date strings for tooltip
        };
      }

      // Update aggregation
      aggregatedData[city].avgTemp += data.avgTemp;
      aggregatedData[city].maxTemp = Math.max(aggregatedData[city].maxTemp, data.maxTemp);
      aggregatedData[city].minTemp = Math.min(aggregatedData[city].minTemp, data.minTemp);
      aggregatedData[city].avgHumidity += data.humidity;
      aggregatedData[city].avgWindSpeed += data.windSpeed;
      aggregatedData[city].count += 1; // Keep track of the number of entries
      aggregatedData[city].dates.push(date); // Store local time string
    });

    // Calculate final averages
    const labels = Object.keys(aggregatedData);
    const avgTemps = labels.map(city => (aggregatedData[city].avgTemp / aggregatedData[city].count).toFixed(2));
    const maxTemps = labels.map(city => aggregatedData[city].maxTemp.toFixed(2));
    const minTemps = labels.map(city => aggregatedData[city].minTemp.toFixed(2));
    const avgHumidity = labels.map(city => (aggregatedData[city].avgHumidity / aggregatedData[city].count).toFixed(2));
    const avgWindSpeed = labels.map(city => (aggregatedData[city].avgWindSpeed / aggregatedData[city].count).toFixed(2));

    return {
      labels,
      datasets: [
        {
          label: 'Average Temperature (°C)',
          data: avgTemps,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          dates: aggregatedData, // Add aggregated data for tooltip
        },
        {
          label: 'Max Temperature (°C)',
          data: maxTemps,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          dates: aggregatedData,
        },
        {
          label: 'Min Temperature (°C)',
          data: minTemps,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          dates: aggregatedData,
        },
        {
          label: 'Average Humidity (%)',
          data: avgHumidity,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          dates: aggregatedData,
        },
        {
          label: 'Average Wind Speed (m/s)',
          data: avgWindSpeed,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          dates: aggregatedData,
        },
      ],
    };
  };

  return (
    <div className="weather-summary-container">
      <h2>Weather Summaries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar
          data={getChartData()}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Values',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Cities',
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const city = tooltipItem.label;
                    const metric = tooltipItem.dataset.label;
                    const value = tooltipItem.raw;

                    const aggregatedCityData = tooltipItem.dataset.dates[city]; // Get aggregated data for the city
                    const dateString = aggregatedCityData.dates.join(', '); // Join dates

                    return `${metric}: ${value} (Dates: ${dateString})`;
                  },
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default WeatherSummary;
