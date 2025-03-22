/**
 * Register Component
 * 
 * This component renders a registration form with name, email, and password fields.
 * It includes form validation and handles user registration.
 * 
 * @param {Function} onRegister - Callback function when registration is successful
 * @param {Function} onSwitchToLogin - Callback to switch to login view
 */
import { useState } from 'react';
import { colorVars } from '../../styles/colors';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    helperText: {
      color: colorVars.textSecondary,
    },
    submitButton: {
      backgroundColor: colorVars.primary,
      color: colorVars.textPrimary,
    },
    submitButtonHover: {
      backgroundColor: colorVars.primaryHover,
    },
    loginText: {
      color: colorVars.textSecondary,
    },
    loginLink: {
      color: colorVars.primary,
    },
    loginLinkHover: {
      color: colorVars.primaryHover,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    // Password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API here
      // For this demo, we'll simulate a successful registration after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onRegister callback with the user information
      onRegister({ name, email });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md" style={styles.container}>
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={styles.title}>Create an Account</h1>
        <p className="mt-2" style={styles.subtitle}>Sign up to start your survey</p>
      </div>
      
      {error && (
        <div className="p-3 text-sm rounded-md" style={styles.errorContainer}>
          {error}
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium" style={styles.label}>
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
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
            autoComplete="new-password"
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
          <p className="mt-1 text-xs" style={styles.helperText}>
            Password must be at least 8 characters long
          </p>
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium" style={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <p className="text-sm" style={styles.loginText}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium"
            style={styles.loginLink}
            onMouseOver={(e) => e.target.style.color = styles.loginLinkHover.color}
            onMouseOut={(e) => e.target.style.color = styles.loginLink.color}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
} 