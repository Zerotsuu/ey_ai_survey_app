/**
 * QuestionMark Component
 * 
 * This component renders a question mark icon that shows help information when clicked.
 * When clicked, it updates the tooltip content in the sidebar.
 * 
 * @param {Function} onClick - Callback function when the question mark is clicked
 */
import { colorVars } from '../../styles/colors';

export default function QuestionMark({ onClick }) {
  // Define styles using color variables
  const styles = {
    button: {
      backgroundColor: `${colorVars.primary}20`, // 20% opacity
      color: colorVars.textPrimary,
      width: '16px', 
      height: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'translateY(-1px)'
    },
    buttonHover: {
      backgroundColor: `${colorVars.primary}30`, // 30% opacity
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-2 shrink-0 rounded-full text-xs"
      style={styles.button}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
      aria-label="Help"
    >
      ?
    </button>
  );
} 