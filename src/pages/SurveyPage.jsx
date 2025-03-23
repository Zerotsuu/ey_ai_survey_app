import { useState } from "react";
import { useSurvey } from "../context/SurveyContext";
import { useAuth } from "../context/AuthContext";
import TopNavigation from "../components/TopNavigation";
import SideNavigation from "../components/SideNavigation";
import SurveySection from "../components/survey/SurveySection";
import Tooltip from "../components/Tooltip";
import ResponseViewer from "../components/ResponseViewer";
import { normalizeQuestionId } from "../utils/loadSurveyData";

/**
 * SurveyPage Component
 * 
 * This component renders the main survey page with the survey form,
 * navigation, and related UI elements.
 */
export default function SurveyPage() {
  // Get authentication context
  const { user, handleLogout } = useAuth();
  
  // Get survey context
  const {
    sections,
    activeSection,
    handleSectionClick,
    handleRadioChange,
    handleCommentChange,
    getComment,
    completionStats,
    answers,
    comments,
    isSubmitting,
    tooltipMessage,
    setTooltipMessage,
    handleSubmit,
    handleSaveDraft,
    handleViewResponses,
    showResponseViewer,
    setShowResponseViewer,
    getSurveyResponses,
    resetSurvey
  } = useSurvey();
  
  // State for handling mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Detect mobile viewport for responsive design
  const isMobile = window.innerWidth < 768;

  return (
    <div className="absolute flex h-screen flex-col bg-app-background text-app-text">
      {/* Top navigation bar */}
      <TopNavigation 
        isSubmitting={isSubmitting}
        canSubmit={completionStats.isFullyCompleted}
        completionPercentage={completionStats.completionPercentage || 0}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        user={user}
        onLogout={handleLogout}
        onViewResponses={handleViewResponses}
        onSaveDraft={handleSaveDraft}
        onResetSurvey={resetSurvey}
      />
      
      <div className="flex w-full flex-1 overflow-hidden">
        {/* Side navigation showing section completion status */}
        <SideNavigation 
          sections={sections} 
          completionStats={completionStats}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
        
        {/* Main content area with survey form */}
        <main className="flex-1 overflow-y-auto pt-16">
          {/* Main form with sections and questions */}
          <form 
            id="survey-form" 
            className="mx-auto px-4 py-6 md:px-8 md:py-10 max-w-5xl"
            onSubmit={handleSubmit}
          >
            {/* Display current section questions */}
            {sections
              .filter((section) => section.id === activeSection)
              .map((section) => (
                <SurveySection 
                  key={section.id}
                  section={section}
                  id={section.id}
                  title={section.title}
                  questions={section.questions || []}
                  onHelpClick={setTooltipMessage}
                  onRadioChange={handleRadioChange}
                  onCommentChange={handleCommentChange}
                  answers={answers}
                  comments={comments}
                  getComment={getComment}
                  normalizeQuestionId={normalizeQuestionId}
                />
              ))}
          </form>
        </main>
        
        {/* Help tooltip sidebar */}
        <Tooltip message={tooltipMessage} />
      </div>
      
      {/* Response viewer modal */}
      <ResponseViewer 
        isOpen={showResponseViewer} 
        onClose={() => setShowResponseViewer(false)} 
        responses={getSurveyResponses() || []}
      />
    </div>
  );
} 