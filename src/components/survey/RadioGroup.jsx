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
 * @param {string|number} selectedValue - Currently selected value
 */
import { colorVars } from '../../styles/colors';
import { useEffect, useState } from 'react';

export default function RadioGroup({ name, options, onChange, color, selectedValue }) {
  // Use provided color or default to primary color from variables
  const buttonColor = color || colorVars.primary;
  // Calculate hover color (slightly lighter)
  const hoverColor = buttonColor === colorVars.primary ? colorVars.primaryHover : buttonColor;
  
  // Convert selectedValue to string for comparison and ensure it's not undefined
  const selectedValueStr = selectedValue ? String(selectedValue).trim() : '';
  
  // Log the passed-in value for debugging
  useEffect(() => {
    console.log(`RadioGroup ${name} - received selectedValue: "${selectedValue}" (${typeof selectedValue})`);
  }, [name, selectedValue]);
  
  // Handle the initial state
  const [selectedOption, setSelectedOption] = useState(selectedValueStr);
  
  // Update our internal state when selectedValue changes
  useEffect(() => {
    if (selectedValueStr) {
      setSelectedOption(selectedValueStr);
      console.log(`RadioGroup ${name} - selectedValue updated to: "${selectedValueStr}" (${typeof selectedValue})`);
    }
  }, [name, selectedValue, selectedValueStr]);
  
  // Log when our internal selection changes
  useEffect(() => {
    console.log(`RadioGroup ${name} - internal selection: "${selectedOption}"`);
  }, [name, selectedOption]);
  
  // Define styles using color variables
  const styles = {
    optionText: {
      color: colorVars.textPrimary,
    },
  };
  
  // Handle change
  const handleOptionChange = (option) => {
    const optionStr = String(option).trim();
    console.log(`Selected option "${optionStr}" in ${name}`);
    setSelectedOption(optionStr);
    onChange(optionStr);
  };
  
  return (
    <div className="flex justify-between">
      {options.map((option) => {
        // Convert option to string for comparison
        const optionStr = String(option).trim();
        
        // Simple string equality check
        const checked = selectedOption === optionStr;
        
        console.log(`RadioGroup ${name} - Rendering option "${optionStr}", checked=${checked}, selectedOption="${selectedOption}"`);
        
        return (
          <label 
            key={option} 
            className="flex flex-col items-center cursor-pointer"
          >
            {/* Hidden native radio button for accessibility */}
            <input
              type="radio"
              name={name}
              value={optionStr}
              checked={checked}
              onChange={() => handleOptionChange(optionStr)}
              className="sr-only" // Hide the native radio button
            />
            
            {/* Custom styled radio button */}
            <div
              className={`h-8 w-8 rounded-full transition-all cursor-pointer flex items-center justify-center
                ${checked 
                  ? 'border-0' 
                  : 'border-2 border-opacity-100 hover:border-opacity-100'}`}
              style={{
                borderColor: buttonColor,
                backgroundColor: checked ? buttonColor : 'transparent',
              }}
              onClick={() => handleOptionChange(optionStr)}
            >
            </div>
            
            <span className="mt-1 text-xs text-center" style={styles.optionText}>{option}</span>
          </label>
        );
      })}
    </div>
  );
} 