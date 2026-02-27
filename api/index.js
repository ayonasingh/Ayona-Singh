// Vercel Serverless Function Entry Point
const path = require('path');

// Load environment variables from backend/.env if it exists
try {
  require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
} catch (e) {
  // Environment variables will be provided by Vercel
}

// Import the Express app
const app = require('../backend/server');

// Export for Vercel
module.exports = app;
