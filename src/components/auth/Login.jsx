/**
 * Login Component
 * 
 * This component renders a login form with email and password fields.
 * It includes form validation and handles authentication.
 * 
 * @param {Function} onLogin - Callback function when login is successful
 * @param {Function} onSwitchToRegister - Callback to switch to registration view
 */
import { useState } from 'react';
import { colorVars } from '../../styles/colors';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    checkbox: {
      color: colorVars.primary,
    },
    checkboxLabel: {
      color: colorVars.textSecondary,
    },
    forgotPassword: {
      color: colorVars.primary,
    },
    forgotPasswordHover: {
      color: colorVars.primaryHover,
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
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API here
      // For this demo, we'll simulate a successful login after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onLogin callback with the user information
      onLogin({ email });
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md" style={styles.container}>
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={styles.title}>Welcome Back</h1>
        <p className="mt-2" style={styles.subtitle}>Sign in to access your survey</p>
      </div>
      
      {error && (
        <div className="p-3 text-sm rounded-md" style={styles.errorContainer}>
          {error}
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
          <label htmlFor="password" className="block text-sm font-medium" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 rounded"
              style={styles.checkbox}
            />
            <label htmlFor="remember-me" className="block ml-2 text-sm" style={styles.checkboxLabel}>
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a 
              href="#" 
              className="font-medium"
              style={styles.forgotPassword}
              onMouseOver={(e) => e.target.style.color = styles.forgotPasswordHover.color}
              onMouseOut={(e) => e.target.style.color = styles.forgotPassword.color}
            >
              Forgot your password?
            </a>
          </div>
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
            {isLoading ? 'Signing in...' : 'Sign in'}
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
            Register now
          </button>
        </p>
      </div>
    </div>
  );
} 