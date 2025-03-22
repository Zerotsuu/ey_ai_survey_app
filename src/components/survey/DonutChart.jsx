/**
 * DonutChart Component
 * 
 * This component renders a donut chart showing completion progress.
 * It's responsive and adjusts its size based on the viewport.
 * 
 * @param {number} completed - Number of completed questions
 * @param {number} total - Total number of questions
 * @param {string} color - CSS color value for the progress circle (default: uses primary color)
 */
import { colorVars } from '../../styles/colors';

export default function DonutChart({ completed, total, color }) {
  // Use provided color or default to primary color from variables
  const chartColor = color || colorVars.primary;
  
  // Calculate percentage completed
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Calculate SVG parameters for the donut chart
  const size = 120; // Chart size
  const strokeWidth = 10; // Width of the donut ring
  const radius = (size - strokeWidth) / 2; // Radius of the donut
  const circumference = 2 * Math.PI * radius; // Circumference of the donut
  const strokeDashoffset = circumference - (percentage / 100) * circumference; // Stroke offset based on percentage
  
  // Define styles using color variables
  const styles = {
    backgroundCircle: {
      stroke: colorVars.border,
    },
    progressCircle: {
      stroke: chartColor,
    },
    percentageText: {
      color: colorVars.textPrimary,
    },
    completedText: {
      color: chartColor,
    },
    totalText: {
      color: colorVars.textPrimary,
    },
    labelText: {
      color: colorVars.textSecondary,
    },
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* SVG for the donut chart */}
      <div className="relative h-24 w-24 md:h-32 md:w-32">
        <svg className="h-full w-full" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            stroke={styles.backgroundCircle.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          
          {/* Progress circle */}
          <circle
            stroke={styles.progressCircle.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        
        {/* Percentage text in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl font-bold" style={styles.percentageText}>{percentage}%</span>
        </div>
      </div>
      
      {/* Label below the chart */}
      <div className="mt-2 text-center">
        <p className="text-xl sm:text-sm">
          <span className="font-bold" style={styles.completedText}>{completed}</span>
          <span className="mx-1" style={styles.totalText}>/</span>
          <span style={styles.totalText}>{total}</span>
          <span className="ml-1 text-xl md:text-sm" style={styles.labelText}>questions</span>
        </p>
      </div>
    </div>
  );
} 