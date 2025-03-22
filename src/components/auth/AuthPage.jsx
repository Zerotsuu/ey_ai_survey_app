/**
 * AuthPage Component
 * 
 * This component manages the authentication views (login and registration).
 * It handles switching between views and authentication state.
 * 
 * @param {Function} onAuthenticated - Callback function when user is authenticated
 */
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { colorVars } from '../../styles/colors';

export default function AuthPage({ onAuthenticated }) {
  const [view, setView] = useState('login'); // 'login' or 'register'
  
  // Define styles using color variables
  const styles = {
    container: {
      backgroundColor: colorVars.backgroundAlt,
    },
  };
  
  const handleLogin = (userData) => {
    // In a real app, you would store the user data in a global state or context
    localStorage.setItem('user', JSON.stringify(userData));
    onAuthenticated(userData);
  };
  
  const handleRegister = (userData) => {
    // In a real app, you would store the user data in a global state or context
    localStorage.setItem('user', JSON.stringify(userData));
    onAuthenticated(userData);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen" style={styles.container}>
      <div className="w-full max-w-md">
        {view === 'login' ? (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setView('register')} 
          />
        ) : (
          <Register 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setView('login')} 
          />
        )}
      </div>
    </div>
  );
} 