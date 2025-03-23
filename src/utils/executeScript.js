/**
 * Utility for executing the CJS script directly from the browser
 * This provides a seamless way to update the actual JSON file when submitting
 * or saving survey responses.
 */

/**
 * Execute the updateSurvey.cjs script via the Node.js backend
 * @param {string} email - User's email address
 * @param {Object} updates - Object containing question IDs and their new values
 * @returns {Promise<Object>} - Result of the script execution
 */
export const executeCJSScript = async (email, updates) => {
  try {
    // Validate inputs
    if (!email || !updates) {
      console.error('Invalid parameters for CJS script execution');
      return { success: false, message: 'Invalid parameters' };
    }

    console.log(`Executing CJS script for user ${email} with updates:`, updates);
    
    // Prepare the data for the API call
    const scriptData = {
      email,
      updates
    };
    
    // Send the request to the Node.js API endpoint that will execute the script
    const response = await fetch('http://localhost:3001/api/execute-cjs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scriptData)
    });
    
    // Parse the response
    const result = await response.json();
    
    // Log the result
    console.log('CJS script execution result:', result);
    
    return result;
  } catch (error) {
    console.error('Error executing CJS script:', error);
    return { 
      success: false, 
      message: `Error executing CJS script: ${error.message}`
    };
  }
};

/**
 * Execute batch updates via the CJS script
 * @param {Object} batchUpdates - Object with email keys and update object values
 * @returns {Promise<Object>} - Result of the script execution
 */
export const executeBatchCJSScript = async (batchUpdates) => {
  try {
    // Validate input
    if (!batchUpdates || typeof batchUpdates !== 'object') {
      console.error('Invalid batch updates for CJS script execution');
      return { success: false, message: 'Invalid batch updates' };
    }
    
    console.log('Executing batch CJS script with updates:', batchUpdates);
    
    // Send the request to execute the batch update
    const response = await fetch('/api/execute-batch-cjs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ batchUpdates })
    });
    
    // Parse the response
    const result = await response.json();
    
    // Log the result
    console.log('Batch CJS script execution result:', result);
    
    return result;
  } catch (error) {
    console.error('Error executing batch CJS script:', error);
    return { 
      success: false, 
      message: `Error executing batch CJS script: ${error.message}`
    };
  }
}; 