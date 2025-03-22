import { useState, useCallback, useEffect } from "react";

/**
 * useSurveyForm Custom Hook
 * 
 * This custom hook manages the state and logic for the survey form.
 * It handles section navigation, answer tracking, and completion status.
 * 
 * @param {Array} initialSections - Initial array of survey section objects
 * @returns {Object} - Object containing state and functions for the survey form
 */
export function useSurveyForm(initialSections) {
  // State to track sections and their completion status
  const [sections, setSections] = useState(initialSections);
  
  // State to store user answers (key: questionId, value: selected answer)
  const [answers, setAnswers] = useState({});
  
  // State to track overall completion statistics
  const [completionStats, setCompletionStats] = useState({ totalQuestions: 0, completedQuestions: 0 });
  
  // State to track which section is currently active/visible
  const [activeSection, setActiveSection] = useState(initialSections[0]?.id ?? 'strategy');

  /**
   * Updates the completion status of a specific section
   * 
   * @param {string} sectionId - ID of the section to update
   * @param {boolean} isComplete - Whether the section is complete
   */
  const updateSectionCompletion = (sectionId, isComplete) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId ? { ...section, isComplete } : section
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

    // Calculate total number of questions across all sections
    const totalQuestions = sections.reduce((acc, section) => 
      acc + section.questions.length, 0
    );
    
    // Count how many questions have been answered
    const completedQuestions = Object.keys(answers).length;
    
    // Update the completion stats state
    setCompletionStats({ totalQuestions, completedQuestions });
  }, [sections, answers]);

  // Recalculate completion stats whenever sections or answers change
  useEffect(() => {
    calculateCompletionStats();
  }, [calculateCompletionStats]);

  /**
   * Handles radio button changes and updates section completion status
   * 
   * @param {string} sectionId - ID of the section containing the question
   * @param {string} questionId - ID of the question being answered
   * @param {string} value - Selected answer value
   */
  const handleRadioChange = (sectionId, questionId, value) => {
    // Store the answer in the answers state
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Find the section that contains the question
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    // Check if all questions in the section are now answered
    const allQuestionsAnswered = section.questions.every(q => 
      answers[q.id] ?? q.id === questionId // Include the current answer that hasn't been saved to state yet
    );

    // Update the section's completion status
    updateSectionCompletion(sectionId, allQuestionsAnswered);
    
    // Recalculate overall completion statistics
    calculateCompletionStats();
  };

  // Return all the state and functions needed by components
  return { 
    sections,              // Array of sections with completion status
    handleRadioChange,     // Function to handle radio button changes
    completionStats,       // Statistics about overall completion
    answers,               // Object containing all answers
    activeSection,         // ID of the currently active section
    setActiveSection       // Function to change the active section
  };
} 