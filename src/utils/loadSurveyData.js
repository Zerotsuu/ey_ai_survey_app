/**
 * Utility to load and process survey data from QuestionList.json
 */
import questionList from '../data/QuestionList.json';

/**
 * Organizes questions from QuestionList.json into sections
 * @returns {Array} Array of survey sections with their questions
 */
export const loadSurveyData = () => {
  // Define the section mappings (s1 -> strategy, etc.)
  const sectionMappings = {
    's1': { id: 'strategy', title: 'Strategy & Innovation' },
    's2': { id: 'customer', title: 'Customer Experience' },
    's3': { id: 'organization', title: 'Organization & People' },
    's4': { id: 'operations', title: 'Operations' },
    's5': { id: 'risk', title: 'Cybersecurity & Risk' },
    's6': { id: 'finance', title: 'Finance, Tax & Legal' },
    's7': { id: 'data', title: 'Data & Technology' }
  };

  // Create an object to group questions by section
  const sectionGroups = {};
  
  // Group questions by their section code (s1, s2, etc.)
  questionList.forEach(question => {
    // Extract section code (e.g., "s1" from "s1_q1")
    const sectionCode = question.Code.split('_')[0];
    
    if (!sectionGroups[sectionCode]) {
      sectionGroups[sectionCode] = [];
    }
    
    // Add the question to its section group
    sectionGroups[sectionCode].push({
      id: question.Code,
      text: question.Question,
      helpText: question.HelpText1
    });
  });
  
  // Convert grouped questions to the sections format
  const sections = Object.keys(sectionGroups).map(sectionCode => {
    const mapping = sectionMappings[sectionCode];
    return {
      id: mapping.id,
      title: mapping.title,
      isComplete: false,
      completionPercentage: 0,
      questions: sectionGroups[sectionCode].sort((a, b) => {
        // Sort questions by their number (e.g., "s1_q1" comes before "s1_q2")
        const numA = parseInt(a.id.split('_q')[1]);
        const numB = parseInt(b.id.split('_q')[1]);
        return numA - numB;
      })
    };
  });
  
  // Sort sections by their order
  sections.sort((a, b) => {
    const orderMap = {
      'strategy': 1,
      'customer': 2,
      'organization': 3,
      'operations': 4,
      'risk': 5,
      'finance': 6,
      'data': 7
    };
    return orderMap[a.id] - orderMap[b.id];
  });
  
  return sections;
};

/**
 * Helper function to normalize question IDs
 * Converts the format "s1_q1" to "s1q1" for compatibility with survey responses
 * @param {string} id - Question ID in format "s1_q1"
 * @returns {string} Normalized ID in format "s1q1"
 */
export const normalizeQuestionId = (id) => {
  return id.replace('_q', 'q');
};

/**
 * Helper function to denormalize question IDs
 * Converts the format "s1q1" to "s1_q1" for compatibility with QuestionList.json
 * @param {string} id - Question ID in format "s1q1"
 * @returns {string} Denormalized ID in format "s1_q1"
 */
export const denormalizeQuestionId = (id) => {
  if (id.includes('_q')) return id; // Already in the right format
  return id.replace(/([a-z]\d)(q\d+)/, '$1_$2');
}; 