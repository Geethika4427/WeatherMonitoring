
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    city: { type: String, required: true },
    condition: { type: String, required: true },
    severity: { type: String, required: true }, // e.g., "High", "Low", "Severe"
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', alertSchema);
