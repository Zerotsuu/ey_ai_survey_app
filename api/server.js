/**
 * API Server for CJS Script Integration
 * 
 * This is a simple Express server that provides API endpoints for executing
 * the CJS script to update the SurveyResponse.json file in real-time.
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import API endpoint handlers using dynamic import
const executeCJSPromise = import('./execute-cjs.js');
const executeBatchCJSPromise = import('./execute-batch-cjs.js');

// Create Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());

// Set up routes once handlers are loaded
Promise.all([executeCJSPromise, executeBatchCJSPromise]).then(([executeCJSModule, executeBatchCJSModule]) => {
  const executeCJS = executeCJSModule.default || executeCJSModule;
  const executeBatchCJS = executeBatchCJSModule.default || executeBatchCJSModule;

  // API routes
  app.post('/api/execute-cjs', executeCJS);
  app.post('/api/execute-batch-cjs', executeBatchCJS);

  // console.log('API routes configured');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Set port from environment variable or use 3001 as default
const PORT = process.env.API_PORT || 3001;

// Start the server
app.listen(PORT, () => {
  // console.log(`API server listening on port ${PORT}`);
  console.log(`CJS integration endpoints available at http://localhost:${PORT}/api/execute-cjs and http://localhost:${PORT}/api/execute-batch-cjs`);
}); 