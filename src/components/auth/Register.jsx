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
import { registerUser } from '../../utils/saveResponse';
import { validateEmail } from '../../utils/emailValidator';
import { executeCJSScript } from '../../utils/executeScript';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [insuranceType, setInsuranceType] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
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
    select: {
      borderColor: colorVars.border,
      color: colorVars.textPrimary,
      backgroundColor: colorVars.background,
    },
    selectFocus: {
      borderColor: colorVars.primary,
      boxShadow: `0 0 0 1px ${colorVars.primary}`,
    },
    submitButton: {
      backgroundColor: colorVars.primary,
      color: colorVars.buttonText,
    },
    submitButtonHover: {
      backgroundColor: colorVars.primaryDark,
    },
    loginText: {
      color: colorVars.textSecondary,
    },
    loginLink: {
      color: colorVars.primary,
    },
    loginLinkHover: {
      color: colorVars.primaryDark,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!firstName || !lastName || !email || !company || !jobTitle || !insuranceType) {
      setError('Please fill in all required fields');
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
      // Create a user object with the registration data
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        company: company,
        jobTitle: jobTitle,
        insuranceType: insuranceType,
        employeeCount: employeeCount,
        annualRevenue: annualRevenue,
        ownershipType: ownershipType,
        hasResponses: false
      };
      
      // Check if the user already exists
      const existingUser = validateEmail(email, false);
      if (existingUser) {
        setError('This email is already registered. Please login instead.');
        setIsLoading(false);
        return;
      }
      
      // Register the new user in the survey responses system
      const newUser = registerUser(userData);
      
      if (!newUser) {
        throw new Error('Failed to register user');
      }
      
      // ==================>>>>>> CREATE AN UPDATE OBJECT FOR THE CJS SCRIPT <<<<<=================
      // Basically we're creating an object with the same keys as the updates object
      // but with the values as the new values for the user
      const updates = {
        First_Name: firstName,
        Last_Name: lastName,
        Company: company,
        Job_Title: jobTitle,
        Insurance_Type: insuranceType,
        Employee_Count: employeeCount ? parseInt(employeeCount, 10) || 0 : 0,
        Annual_Revenue: annualRevenue ? parseInt(annualRevenue, 10) || 0 : 0,
        Ownership_Type: ownershipType || '',
      };
      
      // Execute the CJS script to update the JSON file
      try {
        const cjsResult = await executeCJSScript(email, updates);
        console.log('CJS script execution result:', cjsResult);
        
        if (cjsResult.success) {
          // JSON file update was successful
          setError(''); // Clear any error message
        } else {
          // JSON file update failed but we'll continue anyway
          console.warn('Failed to update JSON file directly, but registration will continue');
        }
      } catch (cjsError) {
        console.error('Error executing CJS script:', cjsError);
        // Continue with registration even if CJS script fails
      }
      
      // Call the onRegister callback with the user information
      onRegister(userData);
    } catch (err) {
      console.error('Registration error:', err);
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
        <div className="flex flex-row space-x-4">
          <input
            id="Fname"
            placeholder='First Name'
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className="flex w-full h-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
              e.target.style.boxShadow = styles.inputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            id="Lname"
            placeholder='Last Name'
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className="flex w-full h-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
              e.target.style.boxShadow = styles.inputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        
        <div className='space-y-4'>
          <input
            id="email"
            placeholder='Email'
            name="email"
            type="email"
            autoComplete="email"
            required
            className="flex w-full h-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
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
          <input
            id="Company"
            placeholder='Company'
            name="company"
            type="Company"
            autoComplete="Company"
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
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <input
            id="JobTitle"
            placeholder='Job Title'
            name="jobTitle"
            type="JobTitle"
            autoComplete="JobTitle"
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
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          
          {/* Insurance Type Dropdown */}
          <div className="relative">
            <select
              id="insuranceType"
              name="insuranceType"
              required
              className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none appearance-none"
              style={styles.select}
              onFocus={(e) => {
                e.target.style.borderColor = styles.selectFocus.borderColor;
                e.target.style.boxShadow = styles.selectFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.select.borderColor;
                e.target.style.boxShadow = 'none';
              }}
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value)}
            >
              <option value="" disabled>Select Insurance Type</option>
              <option value="Life">Life</option>
              <option value="Nonlife">Nonlife</option>
              <option value="Pre-Need">Pre-Need</option>
              <option value="Micro">Micro</option>
              <option value="HMO">HMO</option>
              <option value="Reinsurance">Reinsurance</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Employee Count */}
          <input
            id="employeeCount"
            placeholder="Employee Count"
            name="employeeCount"
            type="number"
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
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
          />
          
          {/* Annual Revenue */}
          <input
            id="annualRevenue"
            placeholder="Annual Revenue"
            name="annualRevenue"
            type="number"
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
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
          />
          
          {/* Ownership Type */}
          <input
            id="ownershipType"
            placeholder="Ownership Type"
            name="ownershipType"
            type="text"
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
            value={ownershipType}
            onChange={(e) => setOwnershipType(e.target.value)}
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