/**
 * ThemeSwitcher Component
 * 
 * This component provides a UI for switching between different color themes.
 * It demonstrates the power of the color variables system.
 */
import { useState } from 'react';
import { applyColorTheme } from '../styles/colors';

// Define available themes
const themes = {
  default: {
    name: 'Default',
    primary: '#FFCC00', // Yellow
    primaryHover: '#FFD633',
    primaryActive: '#E6B800',
    secondary: '#000000', // Black
    secondaryHover: '#333333',
    secondaryActive: '#000000',
  },
  blue: {
    name: 'Blue',
    primary: '#3B82F6', // Blue
    primaryHover: '#60A5FA',
    primaryActive: '#2563EB',
    secondary: '#1E3A8A', // Dark Blue
    secondaryHover: '#2563EB',
    secondaryActive: '#1E40AF',
  },
  green: {
    name: 'Green',
    primary: '#10B981', // Green
    primaryHover: '#34D399',
    primaryActive: '#059669',
    secondary: '#064E3B', // Dark Green
    secondaryHover: '#065F46',
    secondaryActive: '#064E3B',
  },
  purple: {
    name: 'Purple',
    primary: '#8B5CF6', // Purple
    primaryHover: '#A78BFA',
    primaryActive: '#7C3AED',
    secondary: '#4C1D95', // Dark Purple
    secondaryHover: '#6D28D9',
    secondaryActive: '#5B21B6',
  },
};

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState('default');
  
  // Apply a theme when selected
  const handleThemeChange = (themeKey) => {
    // Get the selected theme
    const theme = themes[themeKey];
    
    // Apply the theme
    applyColorTheme({
      // Keep existing colors but override with the new theme colors
      primary: theme.primary,
      primaryHover: theme.primaryHover,
      primaryActive: theme.primaryActive,
      secondary: theme.secondary,
      secondaryHover: theme.secondaryHover,
      secondaryActive: theme.secondaryActive,
    });
    
    // Update active theme state
    setActiveTheme(themeKey);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
      <div className="text-sm font-medium mb-2 text-gray-700">Theme:</div>
      <div className="flex gap-2">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            className={`w-8 h-8 rounded-full border-2 ${activeTheme === key ? 'border-gray-800' : 'border-transparent'}`}
            style={{ backgroundColor: theme.primary }}
            title={theme.name}
            aria-label={`Switch to ${theme.name} theme`}
          />
        ))}
      </div>
    </div>
  );
} 