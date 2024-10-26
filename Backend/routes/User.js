const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error registering user: ' + err.message);
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).send('Invalid email or password');
  }
});

// Update User Alert Settings
router.put('/settings', async (req, res) => {
    const { userId, maxTemperature, minTemperature } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).send('User not found');
  
      user.maxTemperature = maxTemperature;
      user.minTemperature = minTemperature;
      
      await user.save();
      res.send('Alert settings updated successfully');
    } catch (err) {
      res.status(400).send('Error updating settings: ' + err.message);
    }
  });
  

module.exports = router;
