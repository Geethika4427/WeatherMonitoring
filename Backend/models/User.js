const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  maxTemperature: { type: Number, default: 35 }, // Default max threshold
  minTemperature: { type: Number, default: 0 }, // Default min threshold
  // You can add more fields for other alert configurations
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
