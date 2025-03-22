/**
 * Application Color Configuration
 * 
 * This file defines the color palette for the entire application.
 * Colors are exported as CSS variables and as JavaScript objects for programmatic use.
 */

// Default color theme
export const defaultColors = {
  // Primary colors
  primary: '#FFCC00', // Yellow
  primaryHover: '#FFD633',
  primaryActive: '#E6B800',
  
  // Secondary colors
  secondary: '#000000', // Black
  secondaryHover: '#333333',
  secondaryActive: '#000000',
  
  // Background colors
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textLight: '#FFFFFF',
  
  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // UI element colors
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

/**
 * Applies the color theme to CSS variables
 * @param {Object} colors - Color object to apply
 */
export function applyColorTheme(colors = defaultColors) {
  const root = document.documentElement;
  
  // Apply each color as a CSS variable
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}

/**
 * Gets the current color theme
 * @returns {Object} Current color theme
 */
export function getCurrentTheme() {
  const root = document.documentElement;
  const theme = {};
  
  // Get each color from CSS variables
  Object.keys(defaultColors).forEach(key => {
    theme[key] = getComputedStyle(root).getPropertyValue(`--color-${key}`).trim();
  });
  
  return theme;
}

// Export CSS variable names for use in components
export const colorVars = Object.keys(defaultColors).reduce((acc, key) => {
  acc[key] = `var(--color-${key})`;
  return acc;
}, {}); 