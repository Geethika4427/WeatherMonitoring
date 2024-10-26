import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [historicalTrends, setHistoricalTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/weather');
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const fetchHistoricalTrends = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/weather-trends');
        setHistoricalTrends(response.data);
      } catch (error) {
        console.error('Error fetching historical trends:', error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchWeatherData();
    fetchHistoricalTrends();
    fetchAlerts();

    const interval = setInterval(fetchWeatherData, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval); // Cleanup
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: historicalTrends.map(trend => trend._id), // City names
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: historicalTrends.map(trend => trend.avgTemp),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
      {
        label: 'Average Humidity (%)',
        data: historicalTrends.map(trend => trend.avgHumidity), // Add humidity data
        borderColor: 'rgba(255, 206, 86, 1)', // Different color for humidity
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 1,
      },
      {
        label: 'Average Wind Speed (m/s)',
        data: historicalTrends.map(trend => trend.avgWindSpeed), // Add wind speed data
        borderColor: 'rgba(153, 102, 255, 1)', // Different color for wind speed
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Weather Monitoring Dashboard</h1>
      
      <h2>Current Weather Data</h2>
      <ul>
        {weatherData.map((data, index) => (
          <li key={index}>
            {data.city}: {data.temp} °C, Condition: {data.main}, Humidity: {data.humidity}%, Wind Speed: {data.windSpeed} m/s
          </li>
        ))}
      </ul>

      <h2>Daily Weather Trends</h2>
      <Line data={chartData} />

      <h2>Alerts</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            Alert for {alert.city}: {alert.condition} - Severity: {alert.severity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherDashboard;
