
const express = require('express');
const Password = require('../models/Password');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const router = express.Router();

router.use((req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer '

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Add password route
router.post('/add', async (req, res) => {
  const { website_name, website_username, website_password } = req.body;
  if (!website_name || !website_username || !website_password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newPassword = new Password({
      userId: req.userId,
      website_name,
      website_username,
      website_password,
    });
    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete password route
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPassword = await Password.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deletedPassword) {
      return res.status(404).json({ message: "Password not found or unauthorized access" });
    }
    res.status(200).json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error('Error deleting password:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update password route
router.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { website_name, website_username, website_password } = req.body;

  if (!website_name || !website_username || !website_password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedPassword = await Password.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { website_name, website_username, website_password },
      { new: true }
    );

    if (!updatedPassword) {
      return res.status(404).json({ message: 'Password entry not found' });
    }

    res.status(200).json(updatedPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// List passwords route
router.get('/list', async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.userId });
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
