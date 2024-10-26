// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env  
const WeatherSummary = require('./models/WeatherSummary'); // Import the WeatherSummary model
const chalk = require('chalk');
const moment = require('moment-timezone');
const Alert = require('./models/Alert')

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(chalk.green('MongoDB connected')))
.catch(err => console.log(chalk.red('Error connecting to MongoDB:', err)));

// Define the cities and API key
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const apiKey = process.env.OPENWEATHERMAP_API_KEY;

const processWeatherData = async (weatherData) => {
 // const currentDate = new Date().toISOString().split('T')[0]; // Get current date in UTC
 const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD"); // Current date in local time

  for (const cityData of weatherData) {
    const { city, avgTemp, dominantCondition, date, humidity, windSpeed } = cityData;

    // No conversion to IST, keep in UTC format
   //const dateInUTC = new Date(date).toISOString(); // Convert to UTC

    // Check if a summary already exists for the current date and city
    let summary = await WeatherSummary.findOne({ city: city, date: currentDate });

    // If summary doesn't exist, create a new one
    if (!summary) {
      summary = new WeatherSummary({
        city,
        avgTemp: parseFloat(avgTemp),
        maxTemp: parseFloat(avgTemp),
        minTemp: parseFloat(avgTemp),
        dominantCondition,
        humidity: parseFloat(humidity), // Ensure humidity is parsed as float
        windSpeed: parseFloat(windSpeed), // Ensure wind speed is parsed as float
        count: 1, // Initialize count for averaging
       // date: dateInUTC // Save the date in UTC
       date: date // Save the date in local time
      });
    } else {
      // Update temperature aggregates
      summary.avgTemp = (summary.avgTemp * summary.count + parseFloat(avgTemp)) / (summary.count + 1); // Calculate new average
      summary.maxTemp = Math.max(summary.maxTemp, parseFloat(avgTemp));
      summary.minTemp = Math.min(summary.minTemp, parseFloat(avgTemp));
      summary.humidity = (summary.humidity * summary.count + humidity) / (summary.count + 1); // Calculate new average humidity
      summary.windSpeed = (summary.windSpeed * summary.count + windSpeed) / (summary.count + 1); // Calculate new average wind speed
      summary.count += 1; // Increment count for averaging
     // summary.date = dateInUTC; // Update the date in UTC
     summary.date = date; // Update the date in local time
    }

    // Save the updated summary to the database
    await summary.save();
    console.log(chalk.green(`Weather summary for ${city} saved for ${currentDate}. Dominant condition: ${dominantCondition}. Date: ${date}`));

    // Check alert conditions
    await checkAndTriggerAlerts(city, parseFloat(avgTemp), dominantCondition);
  }
};

// Function to check alert conditions and trigger alerts
const checkAndTriggerAlerts = async (city, avgTemp, condition) => {
  let severity = '';

  // Define alert conditions
  if (avgTemp > 35) {
    severity = 'Severe';
    await triggerAlert(city, 'High Temperature', severity);
  } else if (avgTemp < 5) {
    severity = 'Severe';
    await triggerAlert(city, 'Low Temperature', severity);
  } else if (condition === 'Rain') {
    severity = 'Moderate';
    await triggerAlert(city, 'Rainy Weather', severity);
  } else if (condition === 'Snow') {
    severity = 'Moderate';
    await triggerAlert(city, 'Snowy Weather', severity);
  }
};

// Function to trigger alerts
const triggerAlert = async (city, condition, severity) => {
  // Check if the alert already exists
  const existingAlert = await Alert.findOne({ city, condition });
  if (!existingAlert) {
    const alert = new Alert({ city, condition, severity });
    await alert.save(); // Save to the database
    console.log(chalk.red(`ALERT: ${condition} in ${city}! Severity: ${severity}`)); // Log alert
  }
};

// Fetch Weather Data Function
const fetchWeatherData = async () => {
  try {
    const promises = cities.map(async (city) => {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = response.data;

      // Use the metric unit provided by the API
      const tempCelsius = data.main.temp;
      const humidity = data.main.humidity; // Get humidity
      const windSpeed = data.wind.speed; // Get wind speed

      // // Convert the timestamp to UTC
      // const dateInUTC = moment.unix(data.dt).utc().format("YYYY-MM-DD HH:mm:ss");
      // console.log(chalk.green(`City: ${city}, Time in UTC: ${dateInUTC}`)); // Debug log
 // Convert the timestamp to local time (IST)
 const dateInLocalTime = moment.unix(data.dt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
 console.log(chalk.green(`City: ${city}, Time in Local Time: ${dateInLocalTime}`)); // Debug log
      return {
        city: city,
        avgTemp: tempCelsius.toFixed(2),
        dominantCondition: data.weather[0].main,
        //date: dateInUTC, // Save the date in UTC format
        date: dateInLocalTime, // Save the date in local time
        humidity: humidity.toFixed(2), // Include humidity
        windSpeed: windSpeed.toFixed(2) // Include wind speed
      };
      
    });

    const results = await Promise.all(promises);
    console.log(chalk.blue('Weather Data:'), results);

    // Process the data and save to the database
    await processWeatherData(results);
  } catch (error) {
    console.error(chalk.red('Error fetching weather data:', error));
  }
};

// Historical trends function (7-day average trends)
const getHistoricalTrends = async () => {
  try {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7); // Calculate 7 days ago

    const trends = await WeatherSummary.aggregate([
      {
        $match: {
          date: {
            $gte: lastWeek.toISOString(),
            $lte: today.toISOString(),
          },
        },
      },
      {
        $group: {
          _id: "$city",
          avgTemp: { $avg: "$avgTemp" },
          maxTemp: { $max: "$maxTemp" },
          minTemp: { $min: "$minTemp" },
          humidity: { $avg: "$humidity" }, // Calculate average humidity
          windSpeed: { $avg: "$windSpeed" }, // Calculate average wind speed
          dominantCondition: { $first: "$dominantCondition" }, // Taking the first condition for simplicity
        },
      },
    ]);

    return trends;
  } catch (error) {
    console.error(chalk.red("Error fetching historical trends:", error));
  }
};

// API endpoint for historical trends
app.get('/api/weather-trends', async (req, res) => {
  try {
    const trends = await getHistoricalTrends();

    if (trends.length === 0) {
      return res.status(404).json({ message: 'No historical data found for any cities' });
    }

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather trends', error });
  }
});

// API endpoint to get weather data for all cities
app.get('/weather', async (req, res) => {
  try {
    const promises = cities.map(async (city) => {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = response.data;

      // Convert temperature from Kelvin to Celsius (if necessary)
      const tempCelsius = data.main.temp;
      const feelsLikeCelsius = data.main.feels_like;
      const humidity = data.main.humidity; // Get humidity
      const windSpeed = data.wind.speed; // Get wind speed

     const dateInLocalTime = moment.unix(data.dt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'); // Convert to IST
      return {
        city: city,
        temp: tempCelsius.toFixed(2),
        feels_like: feelsLikeCelsius.toFixed(2),
        humidity: humidity.toFixed(2), // Include humidity
        windSpeed: windSpeed.toFixed(2), // Include wind speed
        main: data.weather[0].main,  // Main weather condition (e.g., Clear, Rain)
       // dt: dateInUTC  // Use the formatted date in UTC
       dt: dateInLocalTime  // Use the formatted date in local time (IST)
      };
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);
    
    // Send the results as the response
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error });
  }
});

// API endpoint to save weather data
app.post('/saveWeather', async (req, res) => {
  try {
    const { city, temp, condition,humidity, windSpeed } = req.body;

    // Create a new weather summary document
    const weatherSummary = new WeatherSummary({
      city,
      avgTemp: temp,
      maxTemp: temp,
      minTemp: temp,
      dominantCondition: condition,
      humidity,
      windSpeed,
      date: new Date()
    });

    await weatherSummary.save(); // Save to MongoDB
    res.status(201).json({ message: 'Weather data saved successfully!' });
  } catch (error) {
    console.error('Error saving weather data:', error);
    res.status(500).json({ message: 'Error saving weather data', error });
  }
});

// API endpoint to get all weather summaries
app.get('/api/weather-summaries', async (req, res) => {
  try {
    // Use aggregate to get the latest summary for each city
    const summaries = await WeatherSummary.aggregate([
      {
        $group: {
          _id: "$city", // Group by city
          avgTemp: { $last: "$avgTemp" },
          maxTemp: { $last: "$maxTemp" },
          minTemp: { $last: "$minTemp" },
          dominantCondition: { $last: "$dominantCondition" },
          humidity: { $last: "$humidity" },       // Include latest humidity
          windSpeed: { $last: "$windSpeed" },     // Include latest wind speed
          date: { $last: "$date" }
        }
      }
    ]);


    // Format response
    const response = summaries.map(summary => ({
      city: summary._id,
      avgTemp: summary.avgTemp,
      maxTemp: summary.maxTemp,
      minTemp: summary.minTemp,
      dominantCondition: summary.dominantCondition,
      humidity: summary.humidity,                // Return humidity in response
      windSpeed: summary.windSpeed,              // Return wind speed in response
      date: summary.date
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather summaries', error });
  }
});

//API endpoint to get historical weather data
app.get('/api/historical-weather', async (req, res) => {
  try {
    const historicalData = await WeatherSummary.find({}).sort({ date: 1 }); // Adjust your query as needed
    res.json(historicalData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical weather data', error });
  }
});

// API endpoint to get alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find(); // Fetch all alerts from the database
    res.json(alerts); // Send alerts as the response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error });
  }
});

// Function to start the application
const startApp = async () => {
  await fetchWeatherData(); // Fetch weather data
  setInterval(fetchWeatherData, 5 * 60 * 1000); // Fetch weather data every 5 minutes
};

// Export the startApp function
module.exports = { startApp };
// Start the application
startApp();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(chalk.green(`Server running on port ${PORT}`)));



