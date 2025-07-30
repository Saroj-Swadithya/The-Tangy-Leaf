const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const path = require('path');
const fs = require('fs');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Routes with try-catch for debugging invalid route imports
try {
  console.log("Loading /api/chat");
  app.use('/api/chat', require('./routes/chat'));
  console.log("✅ /api/chat loaded");
} catch (err) {
  console.error("❌ Error loading /api/chat:", err.stack);
}

try {
  console.log("Loading /api/auth");
  app.use('/api/auth', require('./routes/auth'));
  console.log("✅ /api/auth loaded");
} catch (err) {
  console.error("❌ Error loading /api/auth:", err.stack);
}

try {
  console.log("Loading /api/orders");
  app.use('/api/orders', require('./routes/orders'));
  console.log("✅ /api/orders loaded");
} catch (err) {
  console.error("❌ Error loading /api/orders:", err.stack);
}

try {
  console.log("Loading /api/payment");
  app.use('/api/payment', require('./routes/payment'));
  console.log("✅ /api/payment loaded");
} catch (err) {
  console.error("❌ Error loading /api/payment:", err.stack);
}

// Serve React frontend if build exists
const indexHtmlPath = path.join(__dirname, '../frontend/build/index.html');

if (fs.existsSync(indexHtmlPath)) {
  console.warn("✅ Frontend build found. Enabling static file serving.");
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(indexHtmlPath);
  });
} else {
  console.warn("⚠️  Frontend route disabled in development. React build not found or not needed.");
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', function (err) {
  console.error('UNCAUGHT EXCEPTION:', err.stack);
});

module.exports = app;