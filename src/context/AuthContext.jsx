import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

/**
 * Custom hook to use the auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * AuthProvider Component
 * 
 * This context provider centralizes all authentication-related state and functions
 * to make them accessible throughout the app without excessive prop drilling.
 */
export function AuthProvider({ children }) {
  // State for managing authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);

  // Check for existing authentication on mount
  useEffect(() => {
    // Try to get existing user data from local storage
    const storedUser = localStorage.getItem('survey_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.email) {
          setUser(userData);
          setIsAuthenticated(true);
          setShowSurvey(true);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('survey_user');
      }
    }
  }, []);

  /**
   * Handle user authentication
   * @param {Object} userData - User data from authentication
   */
  const handleAuthenticated = useCallback((userData) => {
    console.log("User authenticated:", userData);
    setUser(userData);
    setIsAuthenticated(true);
    setShowSurvey(true);
    
    // Store user data in local storage
    localStorage.setItem('survey_user', JSON.stringify(userData));
  }, []);

  /**
   * Handle user logout
   */
  const handleLogout = useCallback(() => {
    console.log("User logged out");
    setUser(null);
    setIsAuthenticated(false);
    setShowSurvey(false);
    
    // Remove user data from local storage
    localStorage.removeItem('survey_user');
    
    // Also clear survey progress when logging out
    localStorage.removeItem('survey_progress');
  }, []);

  // Value to be provided by the context
  const contextValue = {
    isAuthenticated,
    user,
    showSurvey,
    handleAuthenticated,
    handleLogout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
} 