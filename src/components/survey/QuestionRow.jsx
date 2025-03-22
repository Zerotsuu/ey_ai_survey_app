/**
 * QuestionRow Component
 * 
 * This component renders a single question row in the survey table.
 * It includes the question text, radio buttons for Likert scale, and a comments field.
 * 
 * @param {Object} question - The question object with id, text, and helpText
 * @param {Function} onHelpClick - Callback function when help icon is clicked
 * @param {Function} onRadioChange - Callback function when a radio button is changed
 * @param {string} color - CSS color value for the radio buttons
 */
import RadioGroup from './RadioGroup';
import QuestionMark from './QuestionMark';
import { colorVars } from '../../styles/colors';

export default function QuestionRow({ question, onHelpClick, onRadioChange, color }) {
  // Likert scale options (1-5)
  const options = ['1', '2', '3', '4', '5'];
  
  // Define styles using color variables
  const styles = {
    row: {
      borderColor: colorVars.border,
    },
    questionText: {
      color: colorVars.textPrimary,
    },
    commentField: {
      backgroundColor: colorVars.backgroundAlt,
      color: colorVars.textPrimary,
      borderColor: `${colorVars.primary}30`, // 30% opacity
    },
    commentPlaceholder: {
      color: colorVars.textSecondary,
    },
  };
  
  return (
    <tr className="border-b" style={styles.row}>
      {/* Question text with optional help icon */}
      <td className="py-4 pr-4">
        <div className="flex items-start">
          <span style={styles.questionText}>{question.text}</span>
          {question.helpText && (
            <QuestionMark onClick={() => onHelpClick(question.helpText)} />
          )}
        </div>
      </td>
      
      {/* Radio button group for Likert scale */}
      <td colSpan={5} className="py-4">
        <RadioGroup 
          name={question.id}
          options={options}
          onChange={(value) => onRadioChange(question.id, value)}
          color={color}
        />
      </td>
      
      {/* Comments text area */}
      <td className="py-4 pl-4">
        <textarea
          id={`${question.id}-comment`}
          className="h-10 w-full rounded p-2 text-sm resize-none border"
          style={styles.commentField}
          placeholder="Optional comments"
        />
      </td>
    </tr>
  );
} 