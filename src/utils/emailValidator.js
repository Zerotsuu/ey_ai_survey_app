import surveyResponses from '../response/SurveyResponse.json';
import { getSurveyResponses, registerUser } from './saveResponse';

/**
 * Validates if an email exists in the survey responses data
 * @param {string} email - Email address to validate
 * @param {boolean} createIfMissing - Whether to create a new user if not found
 * @returns {Object|null} - User data if email exists, null otherwise
 */
export const validateEmail = (email, createIfMissing = true) => {
  if (!email) return null;
  
  // Get the current survey responses from memory
  const currentResponses = getSurveyResponses();
  
  // Find the user with the matching email
  const user = currentResponses.find(
    (response) => response.Business_Email?.toLowerCase() === email.toLowerCase()
  );
  
  if (user) {
    console.log("Found existing user in survey responses:", user);
    
    // Add a flag indicating if this user has previous responses
    const hasAnswers = Object.keys(user).some(key => /^s\dq\d+$/.test(key) && !key.includes('_comment'));
    user.hasResponses = hasAnswers;
    console.log("User has responses:", hasAnswers);
    return user;
  } 
  
  // If user not found and createIfMissing is true, create a new user
  if (createIfMissing) {
    console.log(`User with email ${email} not found. Creating new user...`);
    
    // Create a new user with minimal information
    const userData = {
      email: email,
      firstName: '',
      lastName: '',
      company: '',
      jobTitle: '',
      insuranceType: '',
      employeeCount: '',
      annualRevenue: '',
      ownershipType: ''
    };
    
    // Register the user in the survey responses system
    const newUser = registerUser(userData);
    
    if (newUser) {
      console.log("Created new user:", newUser);
      // Add the hasResponses flag
      newUser.hasResponses = false;
      return newUser;
    }
  }
  
  console.log("User not found and not creating a new one");
  return null;
};

/**
 * Checks if a user has already submitted survey responses
 * @param {string} email - Email address to check
 * @returns {boolean} - True if the user has any survey responses, false otherwise
 */
export const hasExistingResponses = (email) => {
  const user = validateEmail(email);
  
  if (!user) return false;
  
  // Check if the user has any answer fields (s1q1, s2q1, etc.)
  const hasAnswers = Object.keys(user).some(key => /^s\dq\d+$/.test(key));
  
  return hasAnswers;
};

/**
 * Gets user info from the survey responses data
 * @param {string} email - Email address to look up
 * @returns {Object} - User data with name, company, etc.
 */
export const getUserInfo = (email) => {
  const user = validateEmail(email);
  
  if (!user) return null;
  
  // Create a normalized copy of user data 
  // This ensures consistent format for answers regardless of how they're stored in the JSON
  const normalizedUser = { ...user };
  
  // Convert any numeric answer values to strings to match form expected format
  Object.keys(normalizedUser).forEach(key => {
    // For question answers (format: s1q1, s2q3, etc.)
    if (/^s\dq\d+$/.test(key) && !key.includes('_comment')) {
      // Convert numeric values to strings
      if (typeof normalizedUser[key] === 'number') {
        normalizedUser[key] = normalizedUser[key].toString();
      }
    }
    
    // Convert any question IDs with underscores (s1_q1) to the correct format (s1q1)
    // This handles potential format discrepancies in the JSON
    if (/^s\d_q\d+$/.test(key)) {
      const newKey = key.replace('_q', 'q');
      
      // Only copy if the new key doesn't already exist
      if (!normalizedUser[newKey]) {
        // Convert numeric values to strings
        let value = normalizedUser[key];
        if (typeof value === 'number') {
          value = value.toString();
        }
        
        normalizedUser[newKey] = value;
      }
    }
  });
  
  return {
    email: normalizedUser.Business_Email,
    firstName: normalizedUser.First_Name,
    lastName: normalizedUser.Last_Name,
    company: normalizedUser.Company,
    jobTitle: normalizedUser.Job_Title,
    industry: normalizedUser.Industry,
    insuranceType: normalizedUser.Insurance_Type,
    employeeCount: normalizedUser.Employee_Count,
    annualRevenue: normalizedUser.Annual_Revenue,
    ownershipType: normalizedUser.Ownership_Type,
    hasResponses: hasExistingResponses(email),
    ...normalizedUser // Include all normalized user data
  };
}; 