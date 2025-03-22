/**
 * Tooltip Component
 * 
 * This component displays help information in two different ways:
 * - On desktop: A sidebar on the right side of the screen
 * - On mobile: A compact popup that appears when help is requested
 * 
 * @param {string} message - The message to display in the tooltip
 * @param {boolean} isVisible - Whether the mobile tooltip is visible
 * @param {Function} onClose - Function to call when closing the mobile tooltip
 */
import { colorVars } from '../styles/colors';

export default function Tooltip({ message, isVisible, onClose }) {
  // Define styles using color variables
  const styles = {
    desktopTooltip: {
      backgroundColor: colorVars.background,
      borderColor: colorVars.border,
      boxShadow: `0 0 10px ${colorVars.shadow}`,
    },
    desktopContent: {
      backgroundColor: colorVars.backgroundAlt,
      borderColor: colorVars.border,
    },
    title: {
      color: colorVars.textPrimary,
    },
    message: {
      color: colorVars.textSecondary,
    },
    overlay: {
      backgroundColor: colorVars.overlay,
    },
    mobileTooltip: {
      backgroundColor: colorVars.background,
      borderColor: colorVars.border,
      boxShadow: `0 0 20px ${colorVars.shadow}`,
    },
    closeButton: {
      color: colorVars.textSecondary,
    },
    closeButtonHover: {
      color: colorVars.textPrimary,
    },
  };

  return (
    <>
      {/* Desktop tooltip (sidebar) - hidden on mobile */}
      <div 
        className="hidden md:block fixed right-0 top-0 h-screen w-96 p-6 shadow-lg border-l" 
        style={styles.desktopTooltip}
      >
        <div 
          className="mt-16 rounded-lg p-6 border" 
          style={styles.desktopContent}
        >
          <h3 className="mb-4 text-xl font-semibold" style={styles.title}>Help Information</h3>
          <p className="text-sm leading-relaxed" style={styles.message}>{message}</p>
        </div>
      </div>
      
      {/* Mobile tooltip (popup) - only shown when isVisible is true */}
      {isVisible && (
        <>
          {/* Semi-transparent overlay */}
          <div 
            className="md:hidden fixed inset-0 z-40 animate-fade-in"
            style={styles.overlay}
            onClick={onClose}
          ></div>
          
          {/* Popup content */}
          <div 
            className="md:hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[85%] rounded-lg p-5 z-50 animate-popup-in border"
            style={styles.mobileTooltip}
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold" style={styles.title}>Help</h3>
                <button 
                  style={styles.closeButton}
                  onMouseOver={(e) => e.currentTarget.style.color = styles.closeButtonHover.color}
                  onMouseOut={(e) => e.currentTarget.style.color = styles.closeButton.color}
                  onClick={onClose}
                  aria-label="Close help"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm" style={styles.message}>{message}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
} 