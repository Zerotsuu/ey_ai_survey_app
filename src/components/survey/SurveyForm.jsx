import { useState } from "react";
import Tooltip from "./Tooltip";
import TopNavigation from "./TopNavigation";
import SideNavigation from "./SideNavigation";
import SurveySection from "./survey/SurveySection";
import { sections as initialSections } from "../data/surveyData";
import { useSurveyForm } from "../hooks/useSurveyForm";

export default function SurveyForm() {
  // State for managing the help tooltip message
  const [tooltipMessage, setTooltipMessage] = useState("Select a question mark icon to see help information");
  
  // Custom hook for managing survey state and radio button changes
  const { sections, handleRadioChange, completionStats, activeSection, setActiveSection, answers } = useSurveyForm(initialSections);

// UNUSED CODE CONVERSION TO CSV ==========================================================
  const handleExport = () => {
    // Create workbook data
    const workbookData = sections.map((section) => {
      return {
        sheetName: section.title,
        data: section.questions.map((question) => ({
          Question: question.text,
          Answer: answers[question.id] ?? 'Not answered',
          Comments: document.getElementById(`${question.id}-comment`)?.value ?? ''
        }))
      };
    });

    // Convert to CSV format
    const csvContent = workbookData.map((sheet) => {
      const headers = ['Question', 'Answer', 'Comments'].join(',');
      const rows = sheet.data.map((row) => 
        [row.Question, row.Answer, row.Comments].map((cell) => 
          `"${String(cell).replace(/"/g, '""')}"`
        ).join(',')
      );
      return `${sheet.sheetName}\n${headers}\n${rows.join('\n')}`;
    }).join('\n\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'survey_responses.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
// UNUSED CODE ===========================================================================================
  return (
    <div className="flex h-screen">
      {/* Left sidebar navigation showing section completion status */}
      <SideNavigation 
        sections={sections} 
        completionStats={completionStats}
        activeSection={activeSection}
        onSectionClick={setActiveSection}
      />
      
      <div className="flex flex-1 flex-col">
        {/* Top navigation bar with save/submit buttons */}
        <TopNavigation onExport={handleExport} />
        
        <main className="flex flex-1 overflow-y-auto bg-[#2e026d] pt-16">
          {/* Main survey form with sections */}
          <form id="survey-form" className="w-[calc(100%-24rem)] space-y-8 p-8">
            {sections
              .filter((section) => section.id === activeSection)
              .map((section) => (
                <SurveySection 
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  questions={section.questions} 
                  onHelpClick={setTooltipMessage}
                  onRadioChange={(questionId, value) => {
                    handleRadioChange(section.id, questionId, value);
                  }}
                />
              ))}
          </form>
          
          {/* Help tooltip sidebar */}
          <Tooltip message={tooltipMessage} />
        </main>
      </div>
    </div>
  );
} 