/**
 * Email validation function
 * Validates that a string is a properly formatted email address
 * 
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if the email is valid, false otherwise
 */
export function validateEmail(email) {
  // Basic email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Required field validation
 * Validates that a field is not empty
 * 
 * @param {string} value - The field value to validate
 * @returns {boolean} - True if the field is not empty, false otherwise
 */
export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}

/**
 * Number validation
 * Validates that a value is a number within the specified range
 * 
 * @param {number|string} value - The value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - True if the value is valid, false otherwise
 */
export function validateNumber(value, min, max) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Length validation
 * Validates that a string's length is within the specified range
 * 
 * @param {string} value - The string to validate
 * @param {number} min - Minimum allowed length
 * @param {number} max - Maximum allowed length
 * @returns {boolean} - True if the length is valid, false otherwise
 */
export function validateLength(value, min, max) {
  return value.length >= min && value.length <= max;
}

/**
 * Survey answer validation
 * Validates that a survey answer is valid (not undefined, null, or empty string)
 * 
 * @param {*} value - The answer value to validate
 * @returns {boolean} - True if the answer is valid, false otherwise
 */
export function validateSurveyAnswer(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (value === 'undefined') return false;
  return true;
} 