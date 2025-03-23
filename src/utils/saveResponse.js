/**
 * Utility functions to save survey responses
 */
import surveyResponses from '../response/SurveyResponse.json';
import { normalizeQuestionId } from './loadSurveyData';
import { updateSurveyResponse, processBatchUpdates } from './BrowserCJSAdapter';

// Create a mutable copy of the survey responses that we can update
let currentSurveyResponses = [...surveyResponses];

// Try to load saved responses from localStorage
try {
  const savedResponses = localStorage.getItem('surveyResponses');
  if (savedResponses) {
    currentSurveyResponses = JSON.parse(savedResponses);
    console.log('Loaded survey responses from localStorage');
  }
} catch (error) {
  console.error('Error loading survey responses from localStorage:', error);
}

// Check if there's an external batch update file defined
let externalBatchUpdates = null;
try {
  const batchUpdateJson = localStorage.getItem('externalBatchUpdates');
  if (batchUpdateJson) {
    externalBatchUpdates = JSON.parse(batchUpdateJson);
    console.log('Found external batch updates:', externalBatchUpdates);
  }
} catch (error) {
  console.error('Error loading external batch updates:', error);
}

/**
 * Set external batch updates to be applied when a user saves or submits their survey
 * @param {Object} batchUpdates - Object with email keys and update object values
 */
export const setExternalBatchUpdates = (batchUpdates) => {
  if (!batchUpdates || typeof batchUpdates !== 'object') {
    console.error('Invalid batch update format');
    return false;
  }
  
  try {
    localStorage.setItem('externalBatchUpdates', JSON.stringify(batchUpdates));
    externalBatchUpdates = batchUpdates;
    console.log('External batch updates saved and ready to be applied');
    return true;
  } catch (error) {
    console.error('Error setting external batch updates:', error);
    return false;
  }
};

/**
 * Clear external batch updates
 */
export const clearExternalBatchUpdates = () => {
  localStorage.removeItem('externalBatchUpdates');
  externalBatchUpdates = null;
  console.log('External batch updates cleared');
};

/**
 * Get the current survey responses
 * @returns {Array} The current survey responses
 */
export const getSurveyResponses = () => {
  // First try to load the latest data from localStorage
  try {
    const savedResponses = localStorage.getItem('surveyResponses');
    if (savedResponses) {
      currentSurveyResponses = JSON.parse(savedResponses);
      console.log('Refreshed survey responses from localStorage');
    }
  } catch (error) {
    console.error('Error loading latest survey responses from localStorage:', error);
  }
  
  return currentSurveyResponses;
};

/**
 * Registers a new user in the survey responses system
 * @param {Object} userData - User data with email, firstName, lastName, etc.
 * @returns {Object} The created user object
 */
export const registerUser = (userData) => {
  if (!userData || !userData.email) {
    console.error('Cannot register user: missing email');
    return null;
  }
  
  // Check if user already exists
  const existingUserIndex = currentSurveyResponses.findIndex(
    (user) => user.Business_Email?.toLowerCase() === userData.email?.toLowerCase()
  );
  
  if (existingUserIndex !== -1) {
    console.log(`User ${userData.email} already exists`);
    return currentSurveyResponses[existingUserIndex];
  }
  
  // Create new user object
  const newUser = {
    Business_Email: userData.email,
    First_Name: userData.firstName || '',
    Last_Name: userData.lastName || '',
    Company: userData.company || '',
    Job_Title: userData.jobTitle || '',
    Insurance_Type: userData.insuranceType || '',
    Employee_Count: userData.employeeCount || '',
    Annual_Revenue: userData.annualRevenue || '',
    Ownership_Type: userData.ownershipType || '',
    Registration_Date: new Date().toISOString().split('T')[0],
    Last_Modified_Date: new Date().toISOString().split('T')[0]
  };
  
  // Add to the responses array
  currentSurveyResponses.push(newUser);
  
  // Save to localStorage
  try {
    localStorage.setItem('surveyResponses', JSON.stringify(currentSurveyResponses));
    console.log(`User ${userData.email} registered successfully`);
  } catch (error) {
    console.error('Error saving registered user to localStorage:', error);
  }
  
  return newUser;
};

/**
 * Updates the survey response data in memory
 * 
 * @param {Object} userData - User information
 * @param {Object} responseData - Survey response data
 * @param {boolean} isDraft - Whether this is a draft save or final submission
 * @returns {Promise<Object>} Result with success status and message
 */
export const saveResponseToFile = async (userData, responseData, isDraft = false) => {
  try {
    console.log('Saving response in memory...');
    console.log('User data:', userData);
    console.log('Response data:', responseData);
    
    if (!userData || !userData.email) {
      console.error('Invalid user data - missing email');
      return { success: false, message: 'Invalid user data - missing email' };
    }
    
    // Find the user index in the survey responses array
    let userIndex = currentSurveyResponses.findIndex(
      (response) => response.Business_Email?.toLowerCase() === userData.email?.toLowerCase()
    );
    
    // If user not found, create a new entry for this user
    if (userIndex === -1) {
      console.log(`User ${userData.email} not found. Creating new user entry.`);
      
      // Create a new user object with basic information
      const newUser = {
        Business_Email: userData.email,
        First_Name: userData.firstName || '',
        Last_Name: userData.lastName || '',
        Company: userData.company || '',
        Job_Title: userData.jobTitle || '',
        Insurance_Type: userData.insuranceType || '',
        Employee_Count: userData.employeeCount || '',
        Annual_Revenue: userData.annualRevenue || '',
        Ownership_Type: userData.ownershipType || '',
        Registration_Date: new Date().toISOString().split('T')[0],
        Last_Modified_Date: new Date().toISOString().split('T')[0]
      };
      
      // Add the new user to the responses array
      currentSurveyResponses.push(newUser);
      
      // Get the index of the newly added user
      userIndex = currentSurveyResponses.length - 1;
      console.log('New user added to survey responses at index:', userIndex);
    }
    
    // Get survey question answers and comments
    const surveyAnswers = {};
    
    // Process all responses and format them for storage
    responseData.forEach((section) => {
      section.questions.forEach((question) => {
        // The question ID is in format s1_q1, but we need to store it as s1q1
        const normalizedQuestionId = normalizeQuestionId(question.questionId);
        
        // Store answers in the format s1q1, s2q3, etc.
        if (question.answer !== null && question.answer !== undefined && question.answer !== '') {
          console.log(`Processing answer for ${normalizedQuestionId}: ${question.answer} (${typeof question.answer})`);
          
          // Convert string answers to numbers for the radio buttons (1-5)
          // First, ensure it's a string (in case it's already a number)
          const answerStr = String(question.answer).trim();
          
          // Try to parse it as a number if it looks like a number
          if (/^[1-5]$/.test(answerStr)) {
            const answerValue = parseInt(answerStr, 10);
            console.log(`Storing ${normalizedQuestionId} as number: ${answerValue}`);
            surveyAnswers[normalizedQuestionId] = answerValue; // Store as number for radio buttons (1-5)
          } else {
            console.log(`Storing ${normalizedQuestionId} as string: ${answerStr}`);
            surveyAnswers[normalizedQuestionId] = answerStr; // Keep as string for other types of answers
          }
        }
        
        // If there's a comment, store it as s1q1_comment, etc.
        if (question.comments !== null && question.comments !== undefined && question.comments.trim && question.comments.trim() !== '') {
          surveyAnswers[`${normalizedQuestionId}_comment`] = question.comments;
          console.log(`Storing comment for ${normalizedQuestionId}: ${question.comments}`);
        }
      });
    });
    
    console.log('Final survey answers to save:', surveyAnswers);
    
    // Update the user's survey responses
    const updatedUser = {
      ...currentSurveyResponses[userIndex],
      ...surveyAnswers,
      Last_Modified_Date: new Date().toISOString().split('T')[0] // Add today's date as YYYY-MM-DD
    };
    
    // Update the user in the current survey responses
    currentSurveyResponses[userIndex] = updatedUser;
    
    // Update localStorage to indicate the user has responses
    if (userData && !userData.hasResponses) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          parsedUser.hasResponses = true;
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    }
    
    // Store the updated responses in localStorage for persistence
    try {
      localStorage.setItem('surveyResponses', JSON.stringify(currentSurveyResponses));
      console.log('Survey responses saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // This might happen if the data is too large for localStorage
    }
    
    // Always use the CJS adapter to ensure the responses are saved in the JSON file
    // Create an update object specifically for this user
    const userUpdates = {};
    
    // Only add to updates if we have actual answers
    if (Object.keys(surveyAnswers).length > 0) {
      userUpdates[userData.email] = surveyAnswers;
      
      // Use the CJS adapter function to process the updates
      try {
        console.log('Sending survey responses to CJS adapter...');
        const cjsResult = await processBatchUpdates(userUpdates);
        console.log('CJS adapter response:', cjsResult);
        
        if (!cjsResult.success) {
          console.warn('CJS adapter reported issues with saving responses:', cjsResult.message);
        }
      } catch (cjsError) {
        console.error('Error with CJS adapter:', cjsError);
        // We don't want to fail the whole operation if just the CJS part fails
      }
    } else {
      console.log('No answers to save via CJS adapter, skipping update');
    }
    
    // Apply any external batch updates if they exist
    if (externalBatchUpdates) {
      console.log('Applying external batch updates after save/submit');
      try {
        const batchResult = await processBatchUpdates(externalBatchUpdates);
        if (batchResult.success) {
          console.log('Successfully applied external batch updates:', batchResult);
          // Clear the batch updates after successfully applying them
          clearExternalBatchUpdates();
        } else {
          console.error('Failed to apply external batch updates:', batchResult);
        }
      } catch (batchError) {
        console.error('Error applying external batch updates:', batchError);
      }
    }
    
    return { 
      success: true, 
      message: isDraft 
        ? 'Draft saved successfully.' 
        : 'Survey submitted successfully.' 
    };
  } catch (error) {
    console.error('Error updating survey response:', error);
    return { 
      success: false, 
      message: 'An error occurred while saving your responses. Please try again.' 
    };
  }
};

/**
 * Creates a draft response in memory
 * 
 * @param {Object} userData - User information
 * @param {Object} responseData - Survey response data
 * @returns {Promise<Object>} Result with success status and message
 */
export const saveDraftToFile = async (userData, responseData) => {
  return saveResponseToFile(userData, responseData, true);
};

/**
 * Updates specific question responses for a user
 * 
 * @param {string} email - User's email address
 * @param {Object} updates - Object containing question IDs and their new values/comments
 * @returns {Promise<Object>} Result with success status and message
 */
export const updateSpecificResponses = async (email, updates) => {
  try {
    if (!email) {
      console.error('No email provided for update');
      return { success: false, message: 'Email is required' };
    }
    
    console.log(`Updating specific responses for user: ${email}`);
    console.log('Updates to apply:', updates);
    
    // Get the latest survey responses
    const currentResponses = getSurveyResponses();
    
    // Find the user index in the survey responses array
    const userIndex = currentResponses.findIndex(
      (response) => response.Business_Email?.toLowerCase() === email.toLowerCase()
    );
    
    if (userIndex === -1) {
      console.error(`User ${email} not found in survey responses`);
      return { success: false, message: 'User not found' };
    }
    
    // Get the user object
    const user = currentResponses[userIndex];
    
    // Process the updates
    const updatedFields = {};
    
    Object.entries(updates).forEach(([key, value]) => {
      // Check if it's a regular answer key (s1q1)
      if (/^s\dq\d+$/.test(key) && !key.includes('_comment')) {
        console.log(`Updating answer for ${key}: ${value}`);
        
        // Try to convert to number if it's a rating (1-5)
        if (typeof value === 'string' && /^[1-5]$/.test(value.trim())) {
          updatedFields[key] = parseInt(value, 10);
        } else if (typeof value === 'number' && value >= 1 && value <= 5) {
          updatedFields[key] = value;
        } else {
          updatedFields[key] = value;
        }
      } 
      // Check if it's a comment key (s1q1_comment)
      else if (/^s\dq\d+_comment$/.test(key)) {
        console.log(`Updating comment for ${key}: ${value}`);
        
        // Store comment as is
        if (value !== undefined && value !== null) {
          updatedFields[key] = value;
        }
      }
    });
    
    // Update the user's survey responses
    const updatedUser = {
      ...user,
      ...updatedFields,
      Last_Modified_Date: new Date().toISOString().split('T')[0] // Update modification date
    };
    
    // Apply the updates
    currentResponses[userIndex] = updatedUser;
    
    // Save the updated responses
    try {
      localStorage.setItem('surveyResponses', JSON.stringify(currentResponses));
      console.log('Specific survey responses updated in localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    return {
      success: true,
      message: 'Survey responses updated successfully'
    };
  } catch (error) {
    console.error('Error updating specific responses:', error);
    return {
      success: false,
      message: 'An error occurred while updating the survey responses'
    };
  }
}; 