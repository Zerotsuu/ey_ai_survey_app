const fs = require('fs');
const path = require('path');

/**
 * Updates survey responses for a specific user
 * 
 * @param {string} email - User's email address
 * @param {Object} updates - Object containing question IDs and their new values/comments
 * @returns {boolean} Success status
 */
function updateSurveyResponse(email, updates) {
  try {
    if (!email) {
      console.error('Email is required');
      return false;
    }
    
    console.log(`Updating responses for user: ${email}`);
    console.log('Updates to apply:', updates);

    // Try to load from localStorage first (if running in browser)
    let data;
    let usingLocalFile = true;
    
    // Determine file path based on the environment
    const filePath = path.join(__dirname, '../response/SurveyResponse.json');
    
    try {
      // Read the JSON file from disk
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`Loaded data from ${filePath}`);
    } catch (fileError) {
      console.error(`Error reading file: ${fileError.message}`);
      console.error('Make sure you are running this script from the correct directory');
      return false;
    }
    
    // Find the user by email
    const userIndex = data.findIndex(
      (item) => item.Business_Email?.toLowerCase() === email.toLowerCase()
    );
    
    if (userIndex === -1) {
      console.error(`No user found with email: ${email}`);
      return false;
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
      return false;
    }
    
    // Update the last modified date
    user.Last_Modified_Date = new Date().toISOString().split('T')[0];
    
    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Successfully updated ${updateCount} fields for user ${email}`);
    console.log(`Changes saved to ${filePath}`);
    
    return true;
  } catch (error) {
    console.error('Error updating survey response:', error);
    return false;
  }
}

// Check if being run directly or required as a module
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  1. Individual update: node updateSurvey.cjs <email> <questionId> <value> [commentText]');
    console.log('  2. Batch update: node updateSurvey.cjs --batch <path/to/updates.json>');
    console.log('');
    console.log('Examples:');
    console.log('  node updateSurvey.cjs user@example.com s1q1 4');
    console.log('  node updateSurvey.cjs user@example.com s1q1 4 "This is my comment"');
    console.log('  node updateSurvey.cjs user@example.com s1q1_comment "Just updating the comment"');
    console.log('  node updateSurvey.cjs --batch ./updates.json');
    console.log('');
    console.log('Format for batch update JSON file:');
    console.log(`{
  "email@example.com": {
    "s1q1": 4,
    "s1q1_comment": "This is a comment for question 1",
    "s1q2": 3
  },
  "another@example.com": {
    "s1q1": 5,
    "s2q1": 2
  }
}`);
    process.exit(1);
  }
  
  // Check if this is a batch update
  if (args[0] === '--batch') {
    if (args.length < 2) {
      console.error('Error: Missing JSON file path for batch update');
      process.exit(1);
    }
    
    const batchFilePath = args[1];
    console.log(`Loading batch updates from ${batchFilePath}`);
    
    try {
      // Read the batch update JSON file
      const batchUpdates = JSON.parse(fs.readFileSync(batchFilePath, 'utf-8'));
      
      // Track success count
      let successCount = 0;
      const userCount = Object.keys(batchUpdates).length;
      
      // Process each user's updates
      for (const [email, updates] of Object.entries(batchUpdates)) {
        console.log(`\nProcessing updates for ${email}...`);
        const success = updateSurveyResponse(email, updates);
        
        if (success) {
          successCount++;
        }
      }
      
      console.log(`\nBatch update complete: ${successCount}/${userCount} users updated successfully`);
      process.exit(successCount === userCount ? 0 : 1);
    } catch (error) {
      console.error(`Error processing batch update: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Regular single update
    if (args.length < 3) {
      console.error('Error: Not enough arguments for individual update');
      console.log('Usage: node updateSurvey.cjs <email> <questionId> <value> [commentText]');
      process.exit(1);
    }
    
    const email = args[0];
    const questionId = args[1];
    const value = args[2];
    const comment = args[3];
    
    const updates = {};
    
    // If it's a comment key, update just the comment
    if (questionId.includes('_comment')) {
      updates[questionId] = value;
    } else {
      // Otherwise update both the answer and potentially the comment
      updates[questionId] = value;
      if (comment) {
        updates[`${questionId}_comment`] = comment;
      }
    }
    
    // Run the update
    const success = updateSurveyResponse(email, updates);
    process.exit(success ? 0 : 1);
  }
} else {
  // Export the function if being required as a module
  module.exports = { updateSurveyResponse };
}