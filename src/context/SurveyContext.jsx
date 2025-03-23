import { createContext, useContext, useState, useCallback } from 'react';
import { useSurveyForm } from '../hooks/useSurveyForm';
import { loadSurveyData } from '../utils/loadSurveyData';
import { saveResponseToFile, saveDraftToFile, getSurveyResponses } from '../utils/saveResponse';
import { executeCJSScript } from '../utils/executeScript';

// Create the context
export const SurveyContext = createContext();

/**
 * Custom hook to use the survey context
 */
export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}

/**
 * SurveyProvider Component
 * 
 * This context provider centralizes all survey-related state and functions
 * to make them accessible throughout the app without excessive prop drilling.
 */
export function SurveyProvider({ children, userData }) {
  // Load survey data from QuestionList.json
  const initialSections = loadSurveyData();
  
  // State for tracking form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for managing the help tooltip message
  const [tooltipMessage, setTooltipMessage] = useState("Select a question mark icon to see help information");
  
  // State for showing the response viewer
  const [showResponseViewer, setShowResponseViewer] = useState(false);
  
  // Get survey form functionality from the useSurveyForm hook
  const { 
    sections,
    handleRadioChange,
    handleCommentChange,
    getComment,
    completionStats,
    answers,
    activeSection,
    setActiveSection,
    clearSavedProgress
  } = useSurveyForm(initialSections, userData);

  /**
   * Handle form submission
   * Collects all responses and updates the SurveyResponse.json file
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Set submitting state to show loading indicators
      setIsSubmitting(true);
      
      // Check if user has answered any questions
      const hasAnswers = Object.keys(answers).length > 0;
      
      // Collect all responses from sections and questions
      const responseData = sections.map(section => ({
        sectionId: section.id,
        sectionTitle: section.title,
        questions: section.questions.map(question => {
          // Get answer for this question
          const answer = answers[question.id];
          
          // Initialize comments to empty string if undefined
          const commentValue = getComment(question.id);
          
          return {
            questionId: question.id,
            questionText: question.text,
            answer: answer || null, // Use null for unanswered questions
            comments: commentValue
          };
        })
      }));
      
      console.log('Submitting full survey with data:', responseData);
      
      // Update the SurveyResponse.json file with new responses
      const { success, message } = await saveResponseToFile(userData, responseData);
      
      if (success) {
        // Format answers for CJS script execution
        const surveyAnswers = {};
        responseData.forEach(section => {
          section.questions.forEach(question => {
            const questionId = question.questionId.replace('_', ''); // Convert s1_q1 to s1q1
            
            // Add answer if it exists
            if (question.answer !== null && question.answer !== undefined) {
              surveyAnswers[questionId] = question.answer;
            }
            
            // Add comment if it exists
            if (question.comments && question.comments.trim() !== '') {
              surveyAnswers[`${questionId}_comment`] = question.comments;
            }
          });
        });
        
        // Execute the CJS script to update the actual JSON file
        console.log('Executing CJS script for survey submission');
        const cjsResult = await executeCJSScript(userData.email, surveyAnswers);
        
        // Add the CJS script execution result to the success message
        let successMessage = `Survey submitted successfully! ${message}`;
        if (cjsResult.success) {
          successMessage += ' The survey JSON file has been updated.';
        } else {
          successMessage += ' However, there was an issue updating the JSON file directly. Your changes have been saved in the browser.';
        }
        
        // Show success message
        alert(successMessage);
      } else {
        // Show error message
        alert(`Error submitting survey: ${message}`);
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert(`An unexpected error occurred: ${error.message}`);
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  }, [answers, sections, userData]);

  /**
   * Handle saving survey draft
   */
  const handleSaveDraft = useCallback(async () => {
    try {
      // Set submitting state to show loading indicators
      setIsSubmitting(true);
      
      // Collect all responses from sections and questions
      const responseData = sections.map(section => ({
        sectionId: section.id,
        sectionTitle: section.title,
        questions: section.questions.map(question => {
          // Get answer for this question
          const answer = answers[question.id];
          
          // Initialize comments to empty string if undefined
          const commentValue = getComment(question.id);
          
          return {
            questionId: question.id,
            questionText: question.text,
            answer: answer || null, // Use null for unanswered questions
            comments: commentValue
          };
        })
      }));
      
      console.log('Saving draft with data:', responseData);
      
      // Save the draft
      const { success, message } = await saveDraftToFile(userData, responseData);
      
      if (success) {
        // Format answers for CJS script execution
        const surveyAnswers = {};
        responseData.forEach(section => {
          section.questions.forEach(question => {
            const questionId = question.questionId.replace('_', ''); // Convert s1_q1 to s1q1
            
            // Add answer if it exists
            if (question.answer !== null && question.answer !== undefined) {
              surveyAnswers[questionId] = question.answer;
            }
            
            // Add comment if it exists
            if (question.comments && question.comments.trim() !== '') {
              surveyAnswers[`${questionId}_comment`] = question.comments;
            }
          });
        });
        
        // Execute the CJS script to update the actual JSON file
        console.log('Executing CJS script for draft save');
        const cjsResult = await executeCJSScript(userData.email, surveyAnswers);
        
        // Add the CJS script execution result to the success message
        let successMessage = `Draft saved successfully! ${message}`;
        if (cjsResult.success) {
          successMessage += ' The survey JSON file has been updated.';
        } else {
          successMessage += ' However, there was an issue updating the JSON file directly. Your changes have been saved in the browser.';
        }
        
        // Show success message
        alert(successMessage);
      } else {
        // Show error message
        alert(`Error saving draft: ${message}`);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(`An unexpected error occurred: ${error.message}`);
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  }, [answers, sections, userData]);

  /**
   * Handle section navigation 
   */
  const handleSectionClick = useCallback((sectionId) => {
    console.log(`Navigating to section: ${sectionId}`);
    setActiveSection(sectionId);
  }, [setActiveSection]);

  /**
   * Handle viewing responses
   */
  const handleViewResponses = useCallback(() => {
    setShowResponseViewer(true);
  }, []);

  /**
   * Reset the survey to initial state
   * Clears localStorage and resets all answers and comments
   */
  const resetSurvey = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the survey? This will clear all your answers.')) {
      try {
        // Clear localStorage
        clearSavedProgress();
        
        // Reset to first section
        setActiveSection(initialSections[0]?.id ?? 'strategy');
        
        // Reload the page to reset all state
        window.location.reload();
        
        console.log('Survey reset successful');
      } catch (error) {
        console.error('Error resetting survey:', error);
        alert('There was an error resetting the survey. Please try again.');
      }
    }
  }, [clearSavedProgress, initialSections]);

  // Value to be provided by the context
  const contextValue = {
    // Survey data
    sections,
    answers,
    completionStats,
    
    // Navigation
    activeSection,
    
    // Form handlers
    handleRadioChange,
    handleCommentChange,
    getComment,
    handleSubmit,
    handleSaveDraft,
    handleSectionClick,
    
    // UI state
    isSubmitting,
    tooltipMessage,
    setTooltipMessage,
    showResponseViewer,
    setShowResponseViewer,
    
    // Utility functions
    handleViewResponses,
    getSurveyResponses,
    clearSavedProgress,
    resetSurvey
  };

  return (
    <SurveyContext.Provider value={contextValue}>
      {children}
    </SurveyContext.Provider>
  );
} 