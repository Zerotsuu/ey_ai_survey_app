/**
 * Login Component
 * 
 * This component renders a login form with email field only.
 * It validates the email against a list of authorized emails in the JSON file.
 * 
 * @param {Function} onLogin - Callback function when login is successful
 * @param {Function} onSwitchToRegister - Callback to switch to registration view
 */
import { useState } from 'react';
import { colorVars } from '../../styles/colors';
import { validateEmail, getUserInfo, hasExistingResponses } from '../../utils/emailValidator';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define styles using color variables
  const styles = {
    container: {
      backgroundColor: colorVars.background,
      boxShadow: `0 4px 6px ${colorVars.shadow}`,
      borderColor: colorVars.border,
    },
    title: {
      color: colorVars.textPrimary,
    },
    subtitle: {
      color: colorVars.textSecondary,
    },
    errorContainer: {
      backgroundColor: colorVars.error + '20', // 20% opacity
      color: colorVars.error,
    },
    warningContainer: {
      backgroundColor: colorVars.warning + '20', // 20% opacity
      color: colorVars.warning || '#f59e0b', // Fallback amber color
    },
    label: {
      color: colorVars.textPrimary,
    },
    input: {
      borderColor: colorVars.border,
      color: colorVars.textPrimary,
    },
    inputFocus: {
      borderColor: colorVars.primary,
      boxShadow: `0 0 0 1px ${colorVars.primary}`,
    },
    submitButton: {
      backgroundColor: colorVars.primary,
      color: colorVars.textPrimary,
    },
    submitButtonHover: {
      backgroundColor: colorVars.primaryHover,
    },
    registerText: {
      color: colorVars.textSecondary,
    },
    registerLink: {
      color: colorVars.primary,
    },
    registerLinkHover: {
      color: colorVars.primaryHover,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setWarning('');
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if email exists in the survey data
      const userData = validateEmail(email);
      
      if (!userData) {
        setError('Email not found. Please check your email or contact the survey administrator.');
        setIsLoading(false);
        return;
      }
      
      // Get full user info
      const userInfo = getUserInfo(email);
      
      // Check if the user has already completed the survey
      if (userInfo.hasResponses) {
        setWarning('You have already submitted responses to this survey. Continuing will allow you to update your previous responses.');
      }
      
      // Show a message about insurance type if it exists
      if (userInfo.insuranceType) {
        setWarning(prev => {
          const insuranceMessage = `Insurance Type: ${userInfo.insuranceType}`;
          return prev ? `${prev}\n${insuranceMessage}` : insuranceMessage;
        });
      }
      
      // Call the onLogin callback with the user information
      onLogin(userInfo);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md" style={styles.container}>
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={styles.title}>Survey Access</h1>
        <p className="mt-2" style={styles.subtitle}>Enter your email to access the survey</p>
      </div>
      
      {error && (
        <div className="p-3 text-sm rounded-md" style={styles.errorContainer}>
          {error}
        </div>
      )}
      
      {warning && (
        <div className="p-3 text-sm rounded-md" style={styles.warningContainer}>
          {warning}
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium" style={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
              e.target.style.boxShadow = styles.inputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium border border-transparent rounded-md shadow-sm focus:outline-none disabled:opacity-50"
            style={styles.submitButton}
            onMouseOver={(e) => {
              if (!isLoading) e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = styles.submitButton.backgroundColor;
            }}
          >
            {isLoading ? 'Verifying...' : 'Access Survey'}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <p className="text-sm" style={styles.registerText}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium"
            style={styles.registerLink}
            onMouseOver={(e) => e.target.style.color = styles.registerLinkHover.color}
            onMouseOut={(e) => e.target.style.color = styles.registerLink.color}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
} 