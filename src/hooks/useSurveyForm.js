import { useState, useCallback, useEffect } from "react";
import { normalizeQuestionId, denormalizeQuestionId } from "../utils/loadSurveyData";

// Constants for localStorage keys
const SURVEY_PROGRESS_KEY = 'survey_progress';

/**
 * useSurveyForm Custom Hook
 * 
 * This custom hook manages the state and logic for the survey form.
 * It handles section navigation, answer tracking, and completion status.
 * 
 * @param {Array} initialSections - Initial array of survey section objects
 * @param {Object} userData - User data that may contain existing responses
 * @returns {Object} - Object containing state and functions for the survey form
 */
export function useSurveyForm(initialSections, userData) {
  // State to track sections and their completion status
  const [sections, setSections] = useState(initialSections);
  
  // State to store user answers (key: questionId, value: selected answer)
  // Important: We store answers with s1_q1 format (with underscore) internally
  const [answers, setAnswers] = useState({});
  
  // State to store comments (key: questionId, value: comment text)
  // Also stored with s1_q1 format internally
  const [comments, setComments] = useState({});
  
  // State to track overall completion statistics
  const [completionStats, setCompletionStats] = useState({ totalQuestions: 0, completedQuestions: 0 });
  
  // State to track which section is currently active/visible
  const [activeSection, setActiveSection] = useState(initialSections[0]?.id ?? 'strategy');

  /**
   * Update the completion status of sections based on answers
   * @param {Object} currentAnswers - The current answers object
   */
  const updateSectionCompletionStatus = useCallback((currentAnswers) => {
    console.log('Updating all section completion statuses based on answers:', currentAnswers);
    setSections(prev => {
      const updatedSections = prev.map(section => {
        // Check how many questions in this section have been answered
        const sectionQuestionIds = section.questions.map(q => q.id);
        
        // Only count properly answered questions (not undefined or empty strings)
        const answeredQuestions = sectionQuestionIds.filter(qId => 
          currentAnswers[qId] !== undefined && 
          currentAnswers[qId] !== null &&
          currentAnswers[qId] !== "undefined" &&
          String(currentAnswers[qId]).trim() !== ""
        );
        
        // Calculate completion percentage
        const completionPercentage = Math.floor(
          (answeredQuestions.length / section.questions.length) * 100
        );

        const isComplete = completionPercentage === 100;
        
        console.log(`Section ${section.id}: ${answeredQuestions.length}/${section.questions.length} questions answered (${completionPercentage}%), isComplete: ${isComplete}`);
        
        return {
          ...section,
          isComplete,
          isCompleted: isComplete, // Set both properties for consistency
          completionPercentage
        };
      });
      
      return updatedSections;
    });
  }, []);
  
  // Function to load answers from userData
  const loadUserDataAnswers = useCallback(() => {
    if (userData) {
      // Debug the user data received
      console.log("Loading user data in useSurveyForm:", userData);
      
      // Create objects to store the processed answer and comment data
      const existingAnswers = {};
      const existingComments = {};
      
      // Process all keys in the userData
      Object.keys(userData).forEach(key => {
        // Handle answer keys (format: s1q1)
        if (/^s\dq\d+$/.test(key) && !key.includes('_comment')) {
          // Extract the answer value
          const answerValue = userData[key];
          
          // Convert to s1_q1 format (with underscore) for internal use
          const questionId = key.replace(/^(s\d)(q\d+)$/, '$1_$2');
          
          console.log(`Converting answer key ${key} to ${questionId} with value: ${answerValue}`);
          
          // Store as string for consistency
          existingAnswers[questionId] = String(answerValue);
        }
        
        // Handle comment keys (format: s1q1_comment)
        else if (/^s\dq\d+_comment$/.test(key)) {
          // Extract the base question ID without "_comment"
          const baseKey = key.replace('_comment', '');
          
          // Convert to s1_q1 format for internal use
          const questionId = baseKey.replace(/^(s\d)(q\d+)$/, '$1_$2');
          
          console.log(`Converting comment key ${key} to ${questionId} with comment: "${userData[key]}"`);
          
          // Store the comment
          existingComments[questionId] = userData[key];
        }
      });
      
      // Apply the answers and comments to state
      if (Object.keys(existingAnswers).length > 0) {
        console.log('Setting answers state:', existingAnswers);
        setAnswers(existingAnswers);
        
        // Update section completion status based on existing answers
        updateSectionCompletionStatus(existingAnswers);
      }
      
      if (Object.keys(existingComments).length > 0) {
        console.log('Setting comments state:', existingComments);
        setComments(existingComments);
      }
    }
  }, [userData, updateSectionCompletionStatus]);

  // Load saved progress from localStorage on component mount
  useEffect(() => {
    try {
      // Try to get saved progress from localStorage first
      const savedProgressString = localStorage.getItem(SURVEY_PROGRESS_KEY);
      if (savedProgressString) {
        const savedProgress = JSON.parse(savedProgressString);
        
        // Check if saved progress is for current user
        if (savedProgress.userEmail === userData.email) {
          console.log('Restoring survey progress from localStorage:', savedProgress);
          
          if (savedProgress.answers && Object.keys(savedProgress.answers).length > 0) {
            setAnswers(savedProgress.answers);
          }
          
          if (savedProgress.comments && Object.keys(savedProgress.comments).length > 0) {
            setComments(savedProgress.comments);
          }
          
          if (savedProgress.activeSection) {
            setActiveSection(savedProgress.activeSection);
          }
          
          // Update completion stats based on restored answers
          if (savedProgress.answers) {
            updateSectionCompletionStatus(savedProgress.answers);
          }
          
          return; // Skip loading from userData if we restored from localStorage
        }
      }
    } catch (error) {
      console.error('Error loading saved progress from localStorage:', error);
    }
    
    // If no saved progress, load from userData
    loadUserDataAnswers();
  }, [userData, updateSectionCompletionStatus, loadUserDataAnswers]);
  
  // Save progress to localStorage whenever answers, comments, or active section changes
  useEffect(() => {
    // Only save if we have user data and at least one answer
    if (userData && userData.email && (Object.keys(answers).length > 0 || Object.keys(comments).length > 0)) {
      const progressData = {
        userEmail: userData.email,
        timestamp: new Date().toISOString(),
        answers,
        comments,
        activeSection
      };
      
      try {
        localStorage.setItem(SURVEY_PROGRESS_KEY, JSON.stringify(progressData));
        console.log('Saved survey progress to localStorage');
      } catch (error) {
        console.error('Error saving progress to localStorage:', error);
      }
    }
  }, [answers, comments, activeSection, userData]);
  
  /**
   * Updates the completion status of a specific section
   * 
   * @param {string} sectionId - ID of the section to update
   * @param {boolean} isComplete - Whether the section is complete
   */
  const updateSectionCompletion = (sectionId, isComplete) => {
    console.log(`Updating section ${sectionId} completion to ${isComplete}`);
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId ? { 
          ...section, 
          isComplete,
          isCompleted: isComplete, // Set both properties for consistency
          completionPercentage: isComplete ? 100 : Math.floor(
            (Object.keys(answers).filter(key => 
              section.questions.some(q => q.id === key)
            ).length / section.questions.length) * 100
          )
        } : section
      )
    );
  };

  /**
   * Calculates and updates the completion statistics
   * This is memoized with useCallback to prevent unnecessary recalculations
   */
  const calculateCompletionStats = useCallback(() => {
    // Skip calculation during server-side rendering
    if (typeof window === 'undefined') return;

    // Get all valid question IDs from all sections
    const allQuestionIds = sections.flatMap(section => 
      section.questions.map(q => q.id)
    );
    
    // Count only valid answers for existing questions
    const validAnswerCount = allQuestionIds.filter(qId => 
      answers[qId] !== undefined && 
      answers[qId] !== null &&
      answers[qId] !== "undefined" &&
      String(answers[qId]).trim() !== ""
    ).length;
    
    // Total number of questions
    const totalQuestions = allQuestionIds.length;
    
    // Calculate the completion percentage
    const completionPercentage = totalQuestions > 0 
      ? Math.floor((validAnswerCount / totalQuestions) * 100) 
      : 0;
    
    // Check which sections are complete by directly checking the section state
    const sectionsComplete = {};
    sections.forEach(section => {
      const sectionQuestionIds = section.questions.map(q => q.id);
      const answeredQuestions = sectionQuestionIds.filter(qId => 
        answers[qId] !== undefined && 
        answers[qId] !== null &&
        answers[qId] !== "undefined" &&
        String(answers[qId]).trim() !== ""
      );
      sectionsComplete[section.id] = answeredQuestions.length === section.questions.length;
    });
    
    console.log(`Completion stats: ${validAnswerCount}/${totalQuestions} questions answered (${completionPercentage}%)`);
    console.log(`Valid answers:`, allQuestionIds.filter(qId => 
      answers[qId] !== undefined && 
      answers[qId] !== null &&
      answers[qId] !== "undefined" &&
      String(answers[qId]).trim() !== ""
    ));
    
    // Update the completion stats state
    setCompletionStats({ 
      totalQuestions, 
      completedQuestions: validAnswerCount,
      completionPercentage,
      sectionsComplete,
      isFullyCompleted: validAnswerCount === totalQuestions
    });
  }, [sections, answers]);

  // Force calculation at component mount to ensure initial stats are correct
  useEffect(() => {
    calculateCompletionStats();
    console.log("Initial completion stats calculation triggered");
  }, []); // Empty dependency array means this runs once at mount

  // Recalculate completion stats when sections structure changes
  useEffect(() => {
    calculateCompletionStats();
    console.log("Section structure changed - recalculating completion stats");
  }, [sections]); // Only depend on sections

  /**
   * Handles radio button changes and updates section completion status
   * 
   * @param {string} questionId - ID of the question being answered (format: s1_q1)
   * @param {string} value - Selected answer value
   */
  const handleRadioChange = (questionId, value) => {
    // Convert the value to a string to ensure consistency
    const stringValue = String(value).trim();
    console.log(`handleRadioChange: Setting answer for ${questionId} to "${stringValue}" (type: ${typeof stringValue})`);
    
    if (stringValue === "" || stringValue === "undefined") {
      console.error(`Invalid value "${stringValue}" for question ${questionId}. Not saving answer.`);
      return;
    }
    
    // Store the answer in the answers state
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: stringValue
      };
      
      return newAnswers;
    });
    
    // We need to update our counts after the state has been updated
    setTimeout(() => {
      // Get all valid answered questions from all sections
      const allQuestionIds = sections.flatMap(section => 
        section.questions.map(q => q.id)
      );
      
      // Get the current answers state after the update
      const currentAnswers = {...answers, [questionId]: stringValue};
      
      // Count only answers that match existing questions
      const validAnswerCount = allQuestionIds.filter(qId => 
        currentAnswers[qId] !== undefined && 
        currentAnswers[qId] !== null &&
        currentAnswers[qId] !== "undefined" &&
        String(currentAnswers[qId]).trim() !== ""
      ).length;
      
      // Calculate total questions from the sections in memory
      const totalQuestions = allQuestionIds.length;
      
      // Calculate new completion percentage based on actual answered questions
      const newCompletionPercentage = Math.floor((validAnswerCount / totalQuestions) * 100);
      
      console.log(`Radio selection update: ${validAnswerCount}/${totalQuestions} questions (${newCompletionPercentage}%)`);
      console.log(`Current valid answers:`, allQuestionIds.filter(qId => currentAnswers[qId]));
      
      // Immediately update completion stats based on current radio button states
      setCompletionStats({
        totalQuestions,
        completedQuestions: validAnswerCount,
        completionPercentage: newCompletionPercentage,
        isFullyCompleted: validAnswerCount === totalQuestions
      });
      
      // Update section completion statuses
      updateSectionCompletionStatus(currentAnswers);
    }, 0);
  };

  /**
   * Handle comment changes
   * @param {string} questionId - ID of the question being commented on (format: s1_q1)
   * @param {string} commentText - The comment text
   */
  const handleCommentChange = (questionId, commentText) => {
    // Note: questionId should be in the s1_q1 format here
    console.log(`handleCommentChange: Setting comment for ${questionId}`);
    
    setComments(prev => ({
      ...prev,
      [questionId]: commentText
    }));
  };

  /**
   * Get comment for a specific question
   * @param {string} questionId - ID of the question to get comment for (format: s1_q1)
   * @returns {string} The comment text or empty string
   */
  const getComment = (questionId) => {
    // Note: questionId should be in the s1_q1 format here
    const comment = comments[questionId] || '';
    console.log(`getComment: Retrieving comment for ${questionId}: ${comment}`);
    return comment;
  };

  /**
   * Clears all survey progress data from localStorage
   * This should be called when logging out or when resetting a survey
   */
  const clearSavedProgress = useCallback(() => {
    try {
      localStorage.removeItem(SURVEY_PROGRESS_KEY);
      console.log('Cleared saved survey progress from localStorage');
    } catch (error) {
      console.error('Error clearing progress from localStorage:', error);
    }
  }, []);

  // Return all the state and functions needed by components
  return { 
    sections,              // Array of sections with completion status
    handleRadioChange,     // Function to handle radio button changes
    handleCommentChange,   // Function to handle comment changes
    getComment,           // Function to get comment for a specific question
    completionStats,       // Statistics about overall completion
    answers,               // Object containing all answers
    activeSection,         // ID of the currently active section
    setActiveSection,      // Function to change the active section
    clearSavedProgress     // Function to clear saved progress from localStorage
  };
}