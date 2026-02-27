// Vercel Serverless Function Entry Point
require('dotenv').config({ path: '../backend/.env' });

const app = require('../backend/server');

// Export the Express app for Vercel serverless
module.exports = app;
