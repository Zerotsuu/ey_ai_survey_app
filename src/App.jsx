/**
 * Main App Component
 * 
 * This is the root component of the survey application that orchestrates all other components.
 * It manages the overall state, handles form submission, and renders the main layout.
 */
import { useState, useMemo, useEffect } from "react";
import Tooltip from "./components/Tooltip";
import TopNavigation from "./components/TopNavigation";
import SideNavigation from "./components/SideNavigation";
import SurveySection from "./components/survey/SurveySection";
import { sections as initialSections } from "./data/surveyData";
import { useSurveyForm } from "./hooks/useSurveyForm";
import { saveSurveyResponse } from "./utils/sharepoint";
import AuthPage from "./components/auth/AuthPage";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { colorVars } from "./styles/colors";

export default function App(props) {
  // State for managing authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  
  // State for managing the help tooltip message
  const [tooltipMessage, setTooltipMessage] = useState("Select a question mark icon to see help information");
  
  // State for tracking if the mobile tooltip is visible
  const [isMobileTooltipVisible, setIsMobileTooltipVisible] = useState(false);
  
  // State for tracking form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Define styles using color variables
  const styles = {
    welcomeContainer: {
      backgroundColor: colorVars.background,
    },
    welcomeCard: {
      backgroundColor: colorVars.background,
      boxShadow: `0 4px 6px ${colorVars.shadow}`,
      borderColor: colorVars.border,
    },
    welcomeTitle: {
      color: colorVars.textPrimary,
    },
    welcomeText: {
      color: colorVars.textSecondary,
    },
    startButton: {
      backgroundColor: colorVars.secondary,
      color: colorVars.textLight,
    },
    startButtonHover: {
      backgroundColor: colorVars.secondaryHover,
    },
    logoutButton: {
      color: colorVars.textSecondary,
    },
    logoutButtonHover: {
      color: colorVars.textPrimary,
    },
  };
  
  // Use the custom hook to manage survey form state
  const { 
    sections,            // Array of survey sections with their questions and completion status
    handleRadioChange,   // Function to handle radio button changes
    completionStats,     // Statistics about survey completion
    activeSection,       // ID of the currently active section
    setActiveSection,    // Function to change the active section
    answers              // Object containing all question answers
  } = useSurveyForm(initialSections);

  /**
   * Handle successful authentication
   * @param {Object} userData - User data from login/registration
   */
  const handleAuthenticated = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowSurvey(false);
  };

  /**
   * Check if all questions have been answered
   * This is memoized to avoid recalculating on every render
   */
  const canSubmit = useMemo(() => {
    // Get total number of questions across all sections
    const totalQuestions = sections.reduce((total, section) => 
      total + section.questions.length, 0
    );
    
    // Check if all questions have answers
    return Object.keys(answers).length === totalQuestions;
  }, [sections, answers]);

  /**
   * Handle form submission
   * Collects all responses and submits them to SharePoint if available
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't submit if not all questions are answered
    if (!canSubmit) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    try {
      // Set submitting state to show loading indicators
      setIsSubmitting(true);
      
      // Collect all responses from sections and questions
      const responseData = sections.map(section => ({
        sectionId: section.id,
        sectionTitle: section.title,
        questions: section.questions.map(question => ({
          questionId: question.id,
          questionText: question.text,
          answer: answers[question.id] ?? 'Not answered',
          comments: document.getElementById(`${question.id}-comment`)?.value ?? ''
        }))
      }));
      
      // If SharePoint context is available, save to SharePoint
      if (props.context && props.sharepointConfig?.siteUrl) {
        await saveSurveyResponse({
          title: 'Survey Response',
          data: responseData
        });
        alert('Survey submitted successfully to SharePoint!');
      } else {
        // Otherwise, just show a success message
        alert('Survey submitted successfully!');
        console.log('Survey data:', responseData);
      }
    } catch (error) {
      // Handle any errors during submission
      console.error('Submission error:', error);
      alert(`Failed to submit survey: ${error.message}`);
    } finally {
      // Reset submitting state regardless of success or failure
      setIsSubmitting(false);
    }
  };

  // Toggle sidebar visibility for mobile view
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a section is selected (mobile only)
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Handle help icon click
  const handleHelpClick = (message) => {
    setTooltipMessage(message);
    setIsMobileTooltipVisible(true);
  };

  // Close mobile tooltip
  const closeMobileTooltip = () => {
    setIsMobileTooltipVisible(false);
  };

  // Check for existing user in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // If not authenticated, show the auth page
  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onAuthenticated={handleAuthenticated} />
        <ThemeSwitcher />
      </>
    );
  }

  // If authenticated but not showing survey yet, show welcome page
  if (!showSurvey) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen p-4" style={styles.welcomeContainer}>
          <div className="max-w-md w-full rounded-lg p-8 text-center shadow-lg border" style={styles.welcomeCard}>
            <h1 className="text-2xl font-bold mb-4" style={styles.welcomeTitle}>Welcome, {user.name || user.email}</h1>
            <p className="mb-6" style={styles.welcomeText}>You are now logged in. Click the button below to start the survey.</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setShowSurvey(true)}
                className="py-2 px-4 rounded transition-colors"
                style={styles.startButton}
                onMouseOver={(e) => e.target.style.backgroundColor = styles.startButtonHover.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = styles.startButton.backgroundColor}
              >
                Start Survey
              </button>
              <button
                onClick={handleLogout}
                className="transition-colors"
                style={styles.logoutButton}
                onMouseOver={(e) => e.target.style.color = styles.logoutButtonHover.color}
                onMouseOut={(e) => e.target.style.color = styles.logoutButton.color}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <ThemeSwitcher />
      </>
    );
  }

  // Show the survey
  return (
    <>
      <div className="flex h-screen flex-col md:flex-row">
        {/* Sidebar navigation - hidden by default on mobile, shown when isSidebarOpen is true */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-40 h-screen w-full md:w-64`}>
          <SideNavigation 
            sections={sections} 
            completionStats={completionStats}
            activeSection={activeSection}
            onSectionClick={handleSectionClick}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
        
        <div className="flex flex-1 flex-col">
          {/* Top navigation bar with submit button and mobile menu toggle */}
          <TopNavigation 
            isSubmitting={isSubmitting} 
            canSubmit={canSubmit}
            onMenuToggle={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            user={user}
            onLogout={handleLogout}
          />
          
          {/* Main content area with the survey form */}
          <main className="flex flex-1 overflow-y-auto bg-white pt-16">
            <form 
              id="survey-form" 
              className="w-full md:w-[calc(100%-24rem)] space-y-8 p-4 md:p-8"
              onSubmit={handleSubmit}
            >
              {/* Only show the currently active section */}
              {sections
                .filter((section) => section.id === activeSection)
                .map((section) => (
                  <SurveySection 
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    questions={section.questions} 
                    onHelpClick={handleHelpClick}
                    onRadioChange={(questionId, value) => {
                      handleRadioChange(section.id, questionId, value);
                    }}
                  />
                ))}
            </form>
            
            {/* Help tooltip that displays contextual help information */}
            <Tooltip 
              message={tooltipMessage} 
              isVisible={isMobileTooltipVisible}
              onClose={closeMobileTooltip}
            />
          </main>
        </div>
      </div>
      <ThemeSwitcher />
    </>
  );
} 