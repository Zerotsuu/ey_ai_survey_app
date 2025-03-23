/**
 * BrowserCJSAdapter.jsx
 * 
 * This adapter provides browser-compatible functions that mimic
 * the functionality of the Node.js updateSurvey.cjs script.
 * It allows the web application to use the same update logic
 * without requiring Node.js.
 */
import { normalizeQuestionId } from './loadSurveyData';
import { getSurveyResponses } from './saveResponse';

/**
 * Updates survey responses for a specific user
 * This is a browser-compatible version of the updateSurveyResponse function
 * from updateSurvey.cjs
 * 
 * @param {string} email - User's email address
 * @param {Object} updates - Object containing question IDs and their new values/comments
 * @returns {Promise<Object>} Result with success status and message
 */
export const updateSurveyResponse = async (email, updates) => {
  try {
    if (!email) {
      console.error('Email is required');
      return { success: false, message: 'Email is required' };
    }
    
    console.log(`Updating responses for user: ${email}`);
    console.log('Updates to apply:', updates);

    // Handle case where updates is empty
    if (!updates || Object.keys(updates).length === 0) {
      console.log(`No updates provided for user: ${email}`);
      return { success: true, message: 'No updates provided', updatedFields: {} };
    }

    // Get the current survey responses
    let data = getSurveyResponses();
    
    // Find the user by email
    const userIndex = data.findIndex(
      (item) => item.Business_Email?.toLowerCase() === email.toLowerCase()
    );
    
    if (userIndex === -1) {
      console.error(`No user found with email: ${email}`);
      return { success: false, message: `No user found with email: ${email}` };
    }
    
    // Get the user object
    const user = data[userIndex];
    console.log(`Found user: ${user.First_Name} ${user.Last_Name}`);
    
    // Process the updates
    const updatedFields = {};
    let updateCount = 0;
    
    // Dynamically update any field in the updates object
    Object.entries(updates).forEach(([key, value]) => {
      // Validate the key format for question answers (s1q1) or comments (s1q1_comment)
      if (/^s\dq\d+(_comment)?$/.test(key)) {
        const oldValue = user[key];
        
        // Handle number conversion for rating questions (1-5)
        if (!key.includes('_comment') && typeof value === 'string' && /^[1-5]$/.test(value.trim())) {
          value = parseInt(value, 10);
        }
        
        // Update the field
        user[key] = value;
        updatedFields[key] = value;
        updateCount++;
        
        console.log(`Updated ${key}: ${oldValue} → ${value}`);
      } else {
        console.warn(`Skipping invalid key format: ${key}`);
      }
    });
    
    if (updateCount === 0) {
      console.warn('No valid updates were made');
      return { success: true, message: 'No valid updates were made', updatedFields: {} };
    }
    
    // Update the last modified date
    user.Last_Modified_Date = new Date().toISOString().split('T')[0];
    
    // Update the user in the data array
    data[userIndex] = user;
    
    // Save the updated data back to localStorage
    try {
      localStorage.setItem('surveyResponses', JSON.stringify(data));
      console.log('Saved updated survey responses to localStorage');
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
      return { success: false, message: 'Error saving changes to localStorage' };
    }
    
    return { 
      success: true, 
      message: `Successfully updated ${updateCount} fields for user ${email}`,
      updatedFields
    };
  } catch (error) {
    console.error('Error updating survey response:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

/**
 * Process batch updates for multiple users
 * This is a browser-compatible version of the batch update functionality
 * from updateSurvey.cjs
 * 
 * @param {Object} batchUpdates - Object with email keys and update object values
 * @returns {Promise<Object>} Result with success status and detailed results
 */
export const processBatchUpdates = async (batchUpdates) => {
  try {
    console.log('Processing batch updates:', batchUpdates);
    
    if (!batchUpdates || typeof batchUpdates !== 'object') {
      return { success: false, message: 'Invalid batch update data' };
    }
    
    // Special case: Empty updates - return success with no changes
    if (Object.keys(batchUpdates).length === 0) {
      console.log('No batch updates to process (empty object)');
      return { 
        success: true, 
        message: 'No updates to process', 
        details: {}, 
        successCount: 0, 
        totalCount: 0 
      };
    }
    
    // Track results for each user
    const results = {};
    let successCount = 0;
    const userCount = Object.keys(batchUpdates).length;
    
    // Process each user's updates
    for (const [email, updates] of Object.entries(batchUpdates)) {
      console.log(`Processing updates for ${email}...`);
      
      // Skip if updates is empty
      if (!updates || Object.keys(updates).length === 0) {
        console.log(`No updates for ${email}, skipping`);
        results[email] = { success: true, message: 'No updates to process' };
        successCount++;
        continue;
      }
      
      const result = await updateSurveyResponse(email, updates);
      
      results[email] = result;
      if (result.success) {
        successCount++;
      }
    }
    
    return {
      success: true, // Always return success even if some updates failed
      message: `Batch update complete: ${successCount}/${userCount} users updated successfully`,
      details: results,
      successCount,
      totalCount: userCount
    };
  } catch (error) {
    console.error('Error processing batch update:', error);
    return {
      success: false,
      message: `Error processing batch update: ${error.message}`
    };
  }
};

/**
 * Process batch updates for multiple users (alias for processBatchUpdates)
 * This provides compatibility with the CJS version
 * 
 * @param {Object} batchUpdates - Object with email keys and update object values
 * @returns {Promise<Object>} Result with success status and detailed results
 */
export const processBatchUserUpdates = processBatchUpdates;

/**
 * Parse batch updates from a JSON string
 * Helpful for handling pasted JSON or file uploads in the browser
 * 
 * @param {string} jsonString - JSON string to parse
 * @returns {Object|null} Parsed batch updates or null if invalid
 */
export const parseBatchUpdates = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate the structure
    if (typeof parsed !== 'object' || parsed === null) {
      console.error('Invalid batch update format: not an object');
      return null;
    }
    
    // Check if at least one email key exists
    if (Object.keys(parsed).length === 0) {
      console.error('Invalid batch update format: empty object');
      return null;
    }
    
    // Validate each entry
    for (const [email, updates] of Object.entries(parsed)) {
      if (typeof updates !== 'object' || updates === null) {
        console.error(`Invalid updates for ${email}: not an object`);
        return null;
      }
      
      if (Object.keys(updates).length === 0) {
        console.error(`Invalid updates for ${email}: empty object`);
        return null;
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}; 