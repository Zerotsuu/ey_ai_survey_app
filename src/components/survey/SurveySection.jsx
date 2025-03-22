/**
 * SurveySection Component
 * 
 * This component renders an individual survey section with its questions.
 * Each section has a unique visual style, title, and a set of questions with Likert scale ratings.
 * The component is fully responsive for both desktop and mobile devices.
 * CONTAINS MOBILE MOBILE VIEW * 
 * @param {string} id - Unique identifier for the section
 * @param {string} title - Title of the section
 * @param {Array} questions - Array of question objects for this section
 * @param {Function} onHelpClick - Callback function when help icon is clicked
 * @param {Function} onRadioChange - Callback function when a radio button is changed
 */
import QuestionRow from './QuestionRow';
import QuestionMark from './QuestionMark';
import RadioGroup from './RadioGroup';
import { colorVars } from '../../styles/colors';

export default function SurveySection({ id, title, questions, onHelpClick, onRadioChange }) {
  // Likert scale options for the radio buttons (1-5 rating)
  const likertOptions = ['1', '2', '3', '4', '5'];

  /**
   * Get section-specific visual elements based on section ID
   * Returns an object with image, color, and icon for the section
   */
  const getSectionVisual = () => {
    // Different images for each section - each image represents the theme of the section
    const sectionImages = {
      strategy: 'https://img.freepik.com/free-photo/business-planning-concept-with-wooden-blocks-with-icons-it_176474-9225.jpg',
      customer: 'https://img.freepik.com/free-photo/customer-experience-concept-businessman-using-computer-with-virtual-screen-pressing-smiley-face-emotion-face-icons_616485-61.jpg',
      organization: 'https://img.freepik.com/free-photo/business-people-meeting-planning-strategy-analysis-concept_53876-124773.jpg',
      operations: 'https://img.freepik.com/free-photo/business-process-management-diagram-concept_53876-125245.jpg',
      risk: 'https://img.freepik.com/free-photo/businessman-holding-virtual-screen-risk-management-business-concept_53876-104007.jpg',
      finance: 'https://img.freepik.com/free-photo/business-finance-accounting-concept-businessman-using-calculator-with-computer-laptop-analyzing-graph-chart-document-office_616485-58.jpg',
      data: 'https://img.freepik.com/free-photo/data-analysis-business-intelligence-bi-concept-businessman-analyst-looking-graphs-charts-dashboard-screen_616485-61.jpg'
    };

    // Different icons for each section - using emojis for simplicity
    const sectionIcons = {
      strategy: '🎯',
      customer: '👥',
      organization: '🏢',
      operations: '⚙️',
      risk: '⚠️',
      finance: '💰',
      data: '📊'
    };
    
    // Return visual elements with fallbacks if section ID is not recognized
    return {
      image: sectionImages[id] || 'https://6fikixnjm9.ufs.sh/f/W6lDwSyomLOB10jFAjEtaij7RU3fhC4HdI5bXcnkB0MvqxyG',
      icon: sectionIcons[id] || '📋',
    };
  };

  // Get the visual elements for this section
  const sectionVisual = getSectionVisual();

  // Define styles using color variables
  const styles = {
    section: {
      backgroundColor: colorVars.background,
      borderColor: colorVars.border,
      boxShadow: `0 2px 8px ${colorVars.shadow}`,
    },
    title: {
      color: colorVars.textPrimary,
    },
    imageBorder: {
      borderColor: colorVars.primary,
    },
    tableHeader: {
      borderColor: colorVars.border,
    },
    headerText: {
      color: colorVars.textPrimary,
    },
    mobileQuestionCard: {
      backgroundColor: colorVars.backgroundAlt,
      borderColor: `${colorVars.primary}30`, // 30% opacity
    },
    mobileQuestionText: {
      color: colorVars.textPrimary,
    },
    commentField: {
      backgroundColor: colorVars.background,
      color: colorVars.textPrimary,
      borderColor: `${colorVars.primary}30`, // 30% opacity
    },
    commentPlaceholder: {
      color: colorVars.textSecondary,
    },
  };

  return (
    // Container for each survey section with unique ID for navigation
    <section id={id} className="rounded-xl p-4 md:p-8 shadow-md border" style={styles.section}>
      {/* Section title with icon */}
      <h2 className="mb-4 md:mb-6 flex items-center text-xl md:text-2xl font-bold" style={styles.title}>
        <span className="mr-2 text-2xl md:text-3xl">{sectionVisual.icon}</span>
        {title}
      </h2>

      {/* Section visual image */}
      <div className="mb-4 md:mb-6 h-24 md:h-32 w-full overflow-hidden rounded-lg shadow-lg border-2" style={styles.imageBorder}>
        <img 
          src={sectionVisual.image} 
          alt={`${title} visual`} 
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div> 

      {/* Scrollable container for questions */}
      <div className="max-h-[400px] overflow-y-auto space-y-4">
        {/* Questions table - desktop view */}
        <div className="hidden md:block">
          <table className="w-full">
            {/* Table header with Likert scale options */}
            <thead>
              <tr className="border-b" style={styles.tableHeader}>
                <th className="w-1/2 pb-4 text-left text-lg font-medium" style={styles.headerText}>Question</th>
                {likertOptions.map((option) => (
                  <th key={option} className="w-8 pb-4 text-center text-sm font-medium" style={styles.headerText}>
                    {option}
                  </th>
                ))}
                <th className="w-64 pb-4 pl-4 text-left text-sm font-medium" style={styles.headerText}>Comments</th>
              </tr>
            </thead>

            {/* Render individual question rows */}
            <tbody>
              {questions.map((question) => (
                <QuestionRow 
                  key={question.id} 
                  question={question} 
                  onHelpClick={onHelpClick}
                  onRadioChange={onRadioChange}
                  color={colorVars.primary}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Questions list - mobile view */}
        <div className="md:hidden space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="p-4 rounded-lg border" style={styles.mobileQuestionCard}>
              <div className="flex items-start mb-3">
                <div className="flex-1 font-medium" style={styles.mobileQuestionText}>{question.text}</div>
                {question.helpText && (
                  <QuestionMark onClick={() => onHelpClick(question.helpText)} />
                )}
              </div>
              
              {/* Likert scale for mobile */}
              <div className="flex justify-between mb-3">
                <RadioGroup
                  name={question.id}
                  options={likertOptions}
                  onChange={(value) => onRadioChange(question.id, value)}
                  color={colorVars.primary}
                />
              </div>
              
              {/* Comments field for mobile */}
              <textarea
                id={`${question.id}-comment`}
                placeholder="Comments (optional)"
                className="w-full p-2 rounded text-sm border"
                style={styles.commentField}
                rows="2"
              ></textarea>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}