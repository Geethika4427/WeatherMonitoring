# Real-Time Weather Monitoring System

# Project Title: Real-Time Weather Monitoring System

## Overview
The Real-Time Weather Monitoring System is designed to monitor weather conditions for major metros in India. Utilizing data from the [OpenWeatherMap API](https://openweathermap.org/), this system continuously retrieves weather updates and provides summarized insights through rollups and aggregates.

## Features
- **Real-Time Data Retrieval**: Fetches weather data every 5 minutes for cities: Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad.
- **Temperature Conversion**: Converts temperature values from Kelvin to Celsius (or Fahrenheit based on user preference).
- **Daily Weather Summaries**: 
  - Calculates daily aggregates:
    - Average temperature
    - Maximum temperature
    - Minimum temperature
    - Dominant weather condition
- **Alerting System**: User-configurable thresholds for weather conditions (e.g., alerts for temperature exceeding 35°C).
- **Visualizations**: Displays daily weather summaries, historical trends, and alerts.

## Technologies Used
- **Backend**: Node.js, Express
- **Frontend**: React
- **Database**: MongoDB
- **API**: OpenWeatherMap API

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Geethika4427/WeatherMonitoring.git
   cd WeatherMonitoring

2.Navigate to the backend directory and install dependencies
  cd backend
  npm init -y
  Run the application -> node server.js

3.Set up environment variables:
  Create a .env file in the backend directory

  PORT=5000
  OPENWEATHERMAP_API_KEY=c4293860e60839340a0889fe500b4822
  # MONGO_URI=mongodb://localhost:27017/weatherdb
  MONGO_URI=mongodb://host.docker.internal:27017/weatherdb
  # SENDGRID_API_KEY
  EMAIL_FROM=geethikaveerla8@gmail.com

  Dependencies:
  ------------------
  Express for creating the server.
  Mongoose for MongoDB interactions.
  Axios for making HTTP requests to the OpenWeatherMap API.
  CORS for handling Cross-Origin Resource Sharing.
  dotenv for loading environment variables from a .env file.
  Moment-timezone for handling timezones and formatting dates.
  Chalk for styling console log outputs.
  Custom models: WeatherSummary and Alert for storing weather data and alerts, respectively.

  Middleware:
  ------------
  express.json() to parse incoming JSON requests.
  cors() to enable CORS for all routes.
  
  MongoDB Connection:
  --------------------
  It connects to a MongoDB database using Mongoose and logs a success or error message.
  
  Weather Data Processing:
  -------------------------------
  The processWeatherData function processes weather data for multiple cities. It checks if there is already a weather summary for the current date and city, updating or creating it as necessary.
  It also checks for specific weather conditions (e.g., high temperatures) to trigger alerts.
  
  Fetching Weather Data:
  ---------------------------
  The fetchWeatherData function uses Axios to get current weather data from OpenWeatherMap for predefined cities and processes this data.
  
  Historical Trends:
  ------------------
  The getHistoricalTrends function retrieves historical weather data for the past week, calculating averages and other statistics.

  API Endpoints:
  -------------------
  Several API endpoints are defined to interact with the weather data:
  /api/weather-trends: Fetches historical trends.
  /weather: Gets current weather data for all cities.
  /saveWeather: Saves weather data.
  /api/weather-summaries: Retrieves the latest summaries for all cities.
  /api/historical-weather: Fetches historical weather data.
  /api/alerts: Gets alerts from the database.

  Alerts:
  -------
  The code has built-in functionality to trigger alerts based on weather conditions, such as high or low temperatures and rainy or snowy weather.
  
4.Navigate to the frontend directory and install dependencies:
 ->create Frontend directory >> npm create vite@latest >> projectName >> cd ProjectName >> npm install axios react-router-dom@6 >> npm run dev

5.Configuration
  # Data Retrieval Interval: The system retrieves data every 5 minutes. This interval can be modified in the backend code.
  # Alert Thresholds: Users can configure temperature thresholds within the application settings.
  
6.Test Cases
  System Setup: Verify that the system starts successfully and connects to the OpenWeatherMap API using a valid API key.
  Data Retrieval: Ensure the system retrieves and parses weather data for specified locations correctly.
  Temperature Conversion: Test the conversion of temperature values from Kelvin to Celsius or Fahrenheit based on user preferences.
  Daily Weather Summary: Simulate weather updates over several days and verify the correctness of calculated daily summaries.
  Alerting Thresholds: Simulate weather data that exceeds defined thresholds and verify that alerts are triggered appropriately.

7.Bonus Features
   Support for additional weather parameters (e.g., humidity, wind speed) from the OpenWeatherMap API.
   Weather forecast retrieval and summary generation based on predicted conditions.
  
8.Evaluation Criteria
   Functionality and correctness of the real-time data processing system.
   Accuracy of data parsing, temperature conversion, and rollup/aggregate calculations.
   Efficiency of data retrieval and processing within acceptable intervals.
   Completeness of test cases covering various weather scenarios and user configurations.
   Clarity and maintainability of the codebase.

# Acknowledgments
OpenWeatherMap API for providing weather data.
MERN stack documentation for guidance on implementation.





  

  

