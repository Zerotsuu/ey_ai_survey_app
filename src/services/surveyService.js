import { saveResponseToFile, saveDraftToFile, getSurveyResponses } from '../utils/saveResponse';

/**
 * SurveyService
 * 
 * Service layer for all survey-related operations.
 * This centralizes the data operations and can be easily switched
 * between different implementations (API, local files, etc.)
 */

/**
 * Submit a completed survey
 * 
 * @param {Object} userData - User data for the submission
 * @param {Array} surveyData - Survey response data
 * @returns {Promise<Object>} - Result of the submission
 */
export async function submitSurvey(userData, surveyData) {
  try {
    console.log('Submitting survey data:', surveyData);
    const result = await saveResponseToFile(userData, surveyData);
    return result;
  } catch (error) {
    console.error('Error submitting survey:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Save a survey draft
 * 
 * @param {Object} userData - User data for the draft
 * @param {Array} surveyData - Survey response data
 * @returns {Promise<Object>} - Result of the draft save
 */
export async function saveSurveyDraft(userData, surveyData) {
  try {
    console.log('Saving survey draft:', surveyData);
    const result = await saveDraftToFile(userData, surveyData);
    return result;
  } catch (error) {
    console.error('Error saving survey draft:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Get all survey responses
 * 
 * @returns {Array} - List of survey responses
 */
export function getAllSurveyResponses() {
  try {
    const responses = getSurveyResponses();
    return responses || [];
  } catch (error) {
    console.error('Error retrieving survey responses:', error);
    return [];
  }
}

/**
 * Format survey data for submission
 * 
 * @param {Array} sections - Survey sections with questions
 * @param {Object} answers - User's answers
 * @param {Function} getComment - Function to get comments for questions
 * @returns {Array} - Formatted survey data for submission
 */
export function formatSurveyDataForSubmission(sections, answers, getComment) {
  return sections.map(section => ({
    sectionId: section.id,
    sectionTitle: section.title,
    questions: section.questions.map(question => {
      // Get answer for this question
      const answer = answers[question.id];
      
      // Get comment for this question
      const commentValue = getComment ? getComment(question.id) : '';
      
      return {
        questionId: question.id,
        questionText: question.text,
        answer: answer || null, // Use null for unanswered questions
        comments: commentValue
      };
    })
  }));
} 