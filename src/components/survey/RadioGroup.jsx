/**
 * RadioGroup Component
 * 
 * This component renders a group of radio buttons for Likert scale questions.
 * It features custom-styled radio buttons with improved visual design.
 * 
 * @param {string} name - The name attribute for the radio button group
 * @param {string[]} options - Array of option values (e.g., ['1', '2', '3', '4', '5'])
 * @param {Function} onChange - Callback function when a radio button is changed
 * @param {string} color - CSS color value for the radio buttons
 */
import { colorVars } from '../../styles/colors';

export default function RadioGroup({ name, options, onChange, color }) {
  // Use provided color or default to primary color from variables
  const buttonColor = color || colorVars.primary;
  // Calculate hover color (slightly lighter)
  const hoverColor = buttonColor === colorVars.primary ? colorVars.primaryHover : buttonColor;
  
  // Define styles using color variables
  const styles = {
    optionText: {
      color: colorVars.textPrimary,
    },
  };
  
  return (
    <div className="flex justify-between">
      {options.map((option) => (
        <label 
          key={option} 
          className="flex flex-col items-center cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option}
            onChange={(e) => onChange(e.target.value)}
            style={{
              borderColor: buttonColor,
              '--checked-border-color': buttonColor,
              '--checked-bg-color': `${buttonColor}20`, // 20% opacity version of the color
              '--hover-border-color': hoverColor
            }}
            className="appearance-none h-8 w-8 rounded-full border-2 bg-transparent checked:border-4 checked:border-[var(--checked-border-color)] checked:bg-[var(--checked-border-color)] hover:border-[var(--hover-border-color)] transition-all cursor-pointer"
          />
          <span className="mt-1 text-xs text-center" style={styles.optionText}>{option}</span>
        </label>
      ))}
    </div>
  );
} 