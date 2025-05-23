/**
 * API Endpoint to execute the updateSurvey.cjs script
 * 
 * This endpoint allows the browser to trigger execution of the Node.js script
 * to update the SurveyResponse.json file in real-time.
 */

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Handler for the execute-cjs API endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export default async (req, res) => {
  try {
    // Check if this is a POST request
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
    
    // Get email and updates from request body
    const { email, updates } = req.body;
    
    // Validate request data
    if (!email || !updates) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    
    console.log(`API: Executing CJS script for user ${email}`);
    
    // Create a temporary file for the updates
    const tempFileName = `temp_updates_${Date.now()}.json`;
    const tempFilePath = path.resolve(__dirname, tempFileName);
    
    // Create a single-user update format for the script
    const updateData = {};
    updateData[email] = updates;
    
    // Write updates to temp file
    fs.writeFileSync(tempFilePath, JSON.stringify(updateData, null, 2));
    
    // Construct the command to run the CJS script
    const scriptPath = path.resolve(__dirname, '../src/utils/updateSurvey.cjs');
    const command = `node "${scriptPath}" --batch "${tempFilePath}"`;
    
    console.log(`Executing command: ${command}`);
    
    // Execute the command
    exec(command, (error, stdout, stderr) => {
      // Clean up the temp file
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkError) {
        // console.error('Error removing temp file:', unlinkError);
      }
      
      if (error) {
        console.error(`Execution error: ${error.message}`);
        return res.status(500).json({ success: false, message: `Script execution failed: ${error.message}`, stderr, stdout });
      }
      
      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
      }
      
      console.log(`Script stdout: ${stdout}`);
      
      // Return success response
      res.status(200).json({ 
        success: true, 
        message: 'Script executed successfully',
        output: stdout
      });
    });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}; 