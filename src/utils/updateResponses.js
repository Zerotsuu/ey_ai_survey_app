/**
 * Utility for updating specific survey responses
 * 
 * This utility provides a simple way to update specific question responses
 * for a user without having to submit the entire survey.
 */
import { updateSpecificResponses } from './saveResponse';
import { updateSurveyResponse, processBatchUpdates, parseBatchUpdates } from './BrowserCJSAdapter';

/**
 * Updates specific survey responses for a user
 * @param {string} email - User's email address
 * @param {Object} updates - Object with keys as question IDs and values as the new answers/comments
 * @returns {Promise<Object>} Result object with success status and message
 * 
 * @example
 * // Update a single question answer
 * await updateUserResponses('user@example.com', { s1q1: 4 });
 * 
 * // Update multiple questions and comments
 * await updateUserResponses('user@example.com', {
 *   s1q1: 4,
 *   s1q1_comment: 'This is my updated comment',
 *   s1q2: 3,
 *   s1q3: 5
 * });
 */
export const updateUserResponses = async (email, updates) => {
  if (!email || !updates || typeof updates !== 'object') {
    // console.error('Invalid parameters for updateUserResponses');
    return { success: false, message: 'Invalid parameters' };
  }
  
  // We now use our browser-compatible version that mimics the CJS functionality
  return updateSurveyResponse(email, updates);
};

/**
 * Process batch updates for multiple users
 * @param {Object} batchUpdates - Object with email keys and update object values
 * @returns {Promise<Object>} Result with success status and detailed results
 * 
 * @example
 * // Update multiple users at once
 * await processBatchUserUpdates({
 *   "user1@example.com": {
 *     "s1q1": 4,
 *     "s1q2": 3
 *   },
 *   "user2@example.com": {
 *     "s1q1": 5,
 *     "s1q2_comment": "New comment"
 *   }
 * });
 */
export const processBatchUserUpdates = processBatchUpdates;

/**
 * Parse batch updates from a JSON string
 * @param {string} jsonString - JSON string to parse
 * @returns {Object|null} Parsed batch updates or null if invalid
 */
export const parseBatchUserUpdates = parseBatchUpdates;

/**
 * Example usage function - can be called from the console for testing
 */
export const exampleUpdate = async () => {
  const email = 'arnold.carlmar.v.silva@ph.ey.com'; // Replace with actual email
  
  const updates = {
    // s1q1: 4,
    // s1q1_comment: 'I have clarity now',
    
    s1q2: 3,
    s1q2_comment: 'Better understanding of this question',
  };
  
  const result = await updateUserResponses(email, updates);
  console.log('Update result:', result);
  
  return result;
};

/**
 * Example batch update - can be called from the console for testing
 */
export const exampleBatchUpdate = async () => {
  const batchUpdates = {
    'arnold.carlmar.v.silva@ph.ey.com': {
      s1q1: 4,
      s1q1_comment: 'This is a comment for question 1'
    },
    'john.doe@example.com': {
      s1q1: 5,
      s1q2: 2
    }
  };
  
  const result = await processBatchUserUpdates(batchUpdates);
  console.log('Batch update result:', result);
  
  return result;
}; 