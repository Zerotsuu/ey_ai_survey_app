/**
 * Main App Component
 * 
 * This is the root component of the survey application that orchestrates all other components.
 * It sets up the context providers and handles routing between main pages.
 */
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SurveyProvider } from "./context/SurveyContext";
import AuthPage from "./pages/AuthPage";
import SurveyPage from "./pages/SurveyPage";

/**
 * Main application wrapper that provides context providers
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

/**
 * Inner app content that uses the authentication context
 */
function AppContent() {
  const { user, showSurvey } = useAuth();
  
  return (
    <>
      {/* Show authentication page if not authenticated */}
      {!showSurvey && <AuthPage />}
      
      {/* Show survey page if authenticated */}
      {showSurvey && (
        <SurveyProvider userData={user}>
          <SurveyPage />
        </SurveyProvider>
      )}
    </>
  );
} 