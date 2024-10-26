const mongoose = require('mongoose');

const WeatherSummarySchema = new mongoose.Schema({
  city: String,
  date: {
    type: Date,
    default: Date.now
  },
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String,
  conditionCounts: Object, 
  // New fields for additional weather parameters
  humidity: Number,      // Humidity as a percentage
  windSpeed: Number,     // Wind speed in meters per second
  pressure: Number,       // Pressure in hPa (hectopascals)
  
});

module.exports = mongoose.model('WeatherSummary', WeatherSummarySchema);


// const mongoose = require('mongoose');

// const WeatherSummarySchema = new mongoose.Schema({
//   city: {
//     type: String,
//     required: true, // Ensure city is always provided
//     trim: true // Remove leading/trailing whitespace
//   },
//   date: {
//     type: Date,
//     required: true, // Ensure date is always provided
//     default: Date.now,
//     index: true // Create an index for faster querying by date
//   },
//   avgTemp: {
//     type: Number,
//     required: true // Ensure avgTemp is always provided
//   },
//   maxTemp: {
//     type: Number,
//     required: true // Ensure maxTemp is always provided
//   },
//   minTemp: {
//     type: Number,
//     required: true // Ensure minTemp is always provided
//   },
//   dominantCondition: {
//     type: String,
//     required: true // Ensure dominantCondition is always provided
//   },
//   count: {
//     type: Number, // Use a Map for flexible key-value pairs
//     default: 1 // Default to an initial value
//   }
// });

// // Create an index on city and date to prevent duplicate entries for the same date
// WeatherSummarySchema.index({ city: 1, date: 1 }, { unique: true });

// module.exports = mongoose.model('WeatherSummary', WeatherSummarySchema);
