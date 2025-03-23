import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

/**
 * AuthPage Component
 * 
 * This component renders the authentication page with login and registration forms.
 * It handles switching between the forms and processes user authentication.
 */
export default function AuthPage() {
  const { handleAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  
  /**
   * Handle successful login
   * @param {Object} userData - User data from successful login
   */
  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    handleAuthenticated(userData);
  };
  
  /**
   * Handle successful registration
   * @param {Object} userData - User data from successful registration
   */
  const handleRegister = (userData) => {
    console.log('User registered:', userData);
    handleAuthenticated(userData);
  };
  
  /**
   * Switch to login view
   */
  const switchToLogin = () => {
    setShowLogin(true);
  };
  
  /**
   * Switch to register view
   */
  const switchToRegister = () => {
    setShowLogin(false);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      {showLogin ? (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={switchToRegister} 
        />
      ) : (
        <Register 
          onRegister={handleRegister} 
          onSwitchToLogin={switchToLogin} 
        />
      )}
    </div>
  );
} 