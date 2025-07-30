const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Import the authentication middleware

// @route   GET api/auth
// @desc    Get the logged-in user's data
// @access  Private
// This route now correctly handles the GET request to /api/auth from App.js
router.get('/', auth, async (req, res) => {
  try {
    // req.user.id is added to the request by the 'auth' middleware
    // We fetch the user from the database but exclude the password for security
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  console.log("Login request received.");
  const { email, password } = req.body;

  try {
    // Check if a user with the given email exists
    let user = await User.findOne({ email });
    if (!user) {
      // If no user is found, send a clear error message
      console.log("Login failed: User not found.");
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords don't match, send the same clear error message
      console.log("Login failed: Password does not match.");
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // If credentials are correct, create a JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign the token, send it back to the client
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, 
      (err, token) => {
        if (err) {
            console.error("JWT Signing Error:", err); 
            throw err;
        };
        console.log("Login successful, token generated."); 
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Critical error in /login route:", err.message);
    res.status(500).send('Server error');
  }
});

router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      user = new User({ name, email, password, phone });
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});


module.exports = router;