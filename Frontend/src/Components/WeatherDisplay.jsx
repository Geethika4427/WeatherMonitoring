import { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherDisplay.css'; 

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState([]); // To store all weather data
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const [showResults, setShowResults] = useState(false); // To control displaying results

  // Fetch weather data
  const fetchWeatherData = async () => {
    try {
     // const response = await axios.get('http://localhost:5000/weather');
     const response = await axios.get('http://localhost:5002/weather');
      setWeatherData(response.data); // Set the weather data
      console.log('Fetched Weather Data:', response.data); // Log the fetched data
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Filtered weather data based on the search query
  const filteredWeatherData = weatherData.filter(cityData =>
    cityData.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update the search query
    if (e.target.value) {
      setShowResults(true); // Show results only if there's input
    } else {
      setShowResults(false); // Hide results if input is cleared
    }
  };

  return (
    <div className="weather-container">
      {/* <h1>Real-Time Weather Monitoring System</h1> */}
      <input
        type="text"
        placeholder="Search for a city..."
        value={searchQuery}
        onChange={handleSearch} // Update the search query on input change
        className="search-bar"
      />
      {showResults && filteredWeatherData.length > 0 ? ( // Check if results should be shown
        filteredWeatherData.map((cityData) => (
          <div key={cityData.city} className="city-weather">
            <h2>Weather Data for {cityData.city}</h2>
            <p>Temperature: {cityData.temp}°C</p>
            <p>Feels Like: {cityData.feels_like}°C</p>
            <p>Humidity: {cityData.humidity}%</p>
            <p>Wind Speed: {cityData.windSpeed} m/s</p>
            <p>Condition: {cityData.main}</p>
            <p>Last Updated: {new Date(cityData.dt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        // Show message when there are no matches or if the search bar is empty
        showResults && <p>No weather data found for `{searchQuery}`</p>
      )}
    </div>
  );
};

export default WeatherDisplay;

