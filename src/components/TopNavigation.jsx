/**
 * TopNavigation Component
 * 
 * This component renders the top navigation bar of the application.
 * It contains the application title, action buttons, and mobile menu toggle.
 * 
 * @param {boolean} isSubmitting - Whether the form is currently being submitted
 * @param {boolean} canSubmit - Whether the form can be submitted (all questions answered)
 * @param {Function} onMenuToggle - Callback function for toggling the mobile sidebar
 * @param {boolean} isSidebarOpen - Whether the sidebar is currently open on mobile
 * @param {Object} user - The currently logged in user
 * @param {Function} onLogout - Callback function for logging out
 * @param {Function} onSaveDraft - Callback function for saving draft
 * @param {Function} onResetSurvey - Callback function for resetting the survey
 * @param {number} completionPercentage - The percentage of survey completion
 */
import { useState, useEffect, useRef } from 'react';
import { colorVars } from '../styles/colors';

export default function TopNavigation({ 
  isSubmitting, 
  canSubmit, 
  onMenuToggle, 
  isSidebarOpen, 
  user, 
  onLogout,
  onSaveDraft,
  onResetSurvey,
  completionPercentage = 0
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  
  // Add event listener to detect clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    // Add the event listener when the menu is shown
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  // Define styles using color variables
  const styles = {
    header: {
      backgroundColor: colorVars.secondary,
      boxShadow: `0 2px 4px ${colorVars.shadow}`,
    },
    menuButton: {
      color: colorVars.textLight,
    },
    title: {
      color: colorVars.textLight,
    },
    userButton: {
      color: colorVars.textLight,
    },
    userButtonHover: {
      color: colorVars.primary,
    },
    userAvatar: {
      backgroundColor: colorVars.primary,
      color: colorVars.textPrimary,
    },
    dropdownMenu: {
      backgroundColor: colorVars.background,
      boxShadow: `0 2px 10px ${colorVars.shadow}`,
      position: 'absolute',
      zIndex: 100
    },
    dropdownItem: {
      color: colorVars.textPrimary,
    },
    dropdownItemHover: {
      backgroundColor: colorVars.backgroundAlt,
    },
    saveDraftButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: colorVars.textLight,
    },
    saveDraftButtonHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    submitButton: {
      backgroundColor: colorVars.primary,
      color: colorVars.textPrimary,
    },
    submitButtonHover: {
      backgroundColor: colorVars.primaryHover,
    },
    completionIndicator: {
      color: colorVars.textLight,
      fontSize: '0.875rem',
      opacity: 0.9,
      marginRight: '8px',
      whiteSpace: 'nowrap'
    }
  };
  
  // User info
  const userInitial = user && user.firstName ? user.firstName.charAt(0).toUpperCase() : '?';
  
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 shadow-lg" style={styles.header}>
      {/* Mobile menu toggle button - only visible on mobile */}
      <button 
        className="md:hidden flex items-center justify-center w-10 h-10"
        style={styles.menuButton}
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? (
          // X icon for close
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger icon for open
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      {/* Application title */}
      <h1 className="text-xl md:text-2xl font-bold" style={styles.title}>Feedback Survey</h1>
      
      {/* Action buttons container */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* User profile and menu */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center transition-colors"
              style={styles.userButton}
              onMouseOver={(e) => e.currentTarget.style.color = styles.userButtonHover.color}
              onMouseOut={(e) => e.currentTarget.style.color = styles.userButton.color}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2" style={styles.userAvatar}>
                {userInitial}
              </div>
              <span className="hidden md:block">{user.name || user.email}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md py-1 shadow-lg" style={styles.dropdownMenu}>
                {/* Reset Survey option */}
                <button
                  className="block w-full text-left px-4 py-2 text-sm transition-colors"
                  style={styles.dropdownItem}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.dropdownItemHover.backgroundColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    setShowUserMenu(false);
                    onResetSurvey();
                  }}
                >
                  Reset Survey
                </button>
                
                {/* Logout option */}
                <button
                  className="block w-full text-left px-4 py-2 text-sm transition-colors border-t border-gray-200"
                  style={styles.dropdownItem}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.dropdownItemHover.backgroundColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Save Draft button - hidden on smallest screens */}
        <button
          type="button"
          className="hidden sm:block rounded-lg px-3 py-2 md:px-4 text-sm md:text-base transition-colors disabled:opacity-50"
          style={styles.saveDraftButton}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.saveDraftButtonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.saveDraftButton.backgroundColor}
          onClick={onSaveDraft}
          disabled={isSubmitting} // Disable when form is submitting
        >
          Save Draft
        </button>
        
        {/* Submit Survey button */}
        <button
          type="submit"
          form="survey-form" // Associates button with the form
          className="rounded-lg px-3 py-2 md:px-4 text-sm md:text-base font-medium transition-colors disabled:opacity-50"
          style={styles.submitButton}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor}
          disabled={isSubmitting || !canSubmit} // Disable when submitting or not all questions answered
          title={!canSubmit ? "Please answer all questions to submit" : "Submit your survey"} // Tooltip explaining disabled state
        >
          {isSubmitting ? 'Submitting...' : 'Submit'} {/* Shorter text on mobile */}
          <span className="hidden md:inline"> Survey</span>
        </button>
      </div>
    </header>
  );
} 