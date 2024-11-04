import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import './HistoricalWeather.css';

// Register the components needed for the chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const HistoricalWeather = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistoricalData = async () => {
    try {
      //const response = await axios.get('http://localhost:5000/api/historical-weather');
      const response = await axios.get('http://localhost:5002/api/historical-weather');
      console.log(response.data); // Log the response to see its structure
      if (Array.isArray(response.data)) {
        setHistoricalData(response.data);
      } else {
        throw new Error('Unexpected data format received.'); // Throw error if data is not an array
      }
    } catch (err) {
      setError(err); // Set error state
    } finally {
      setLoading(false); // Always executed
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  if (loading) {
    return <div>Loading historical weather data...</div>;
  }

  if (error) {
    return <div>Error fetching historical weather data: {error.message}</div>;
  }

  // Prepare data for chart
  const filteredData = historicalData.slice(-30); // Adjust the number as needed (e.g., last 30 records)

  const chartData = {
    labels: filteredData.map(item => new Date(item.date).toLocaleDateString()), // Format date for labels
    datasets: [
      {
        label: 'Average Temperature',
        data: filteredData.map(item => item.avgTemp), // Assuming avgTemp is in the data
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex; 
            const cityName = filteredData[index]?.city || 'Unknown City'; // Access city name directly
            const dateTime = new Date(filteredData[index]?.date); // Create Date object
            
            // Format date and time to local timezone
            const options = { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false, // Change to true for AM/PM format
            };

            // Get the local date and time string
            const formattedDateTime = dateTime.toLocaleString(undefined, options); // Use undefined for locale to default to local timezone
            
            return `${cityName} - ${formattedDateTime}`; // Return city name and formatted date
          },
          label: (tooltipItem) => {
            const avgTemp = tooltipItem.raw; // Average temperature value
            return `Avg Temp: ${avgTemp}°C`; // Customize label format
          },
        },
      },
    },
  };

  return (
    <div className="historical-weather-container">
      <h2>Historical Weather Data</h2>
      <div className="chartjs-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HistoricalWeather;
