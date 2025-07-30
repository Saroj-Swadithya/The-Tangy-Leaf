const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  try {
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch response from AI." });
  }
});

module.exports = router;
