const express = require('express');
const User = require('../schemas/user');  // Import the User model
const router = express.Router();

// Route to create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user', details: err.message });
  }
});

// Route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// Get a user by email
router.get('/email/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;  // Get the email from the URL parameter
    const user = await User.findOne({ email: userEmail });  // Use findOne() to fetch the user by email

    if (!user) {
      return res.status(404).json({ error: 'User not found' });  // If no user is found
    }

    res.json(user);  // Send the user data as a response
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch user', details: err.message });
  }
});


module.exports = router;
