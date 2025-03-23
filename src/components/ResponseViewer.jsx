/**
 * ResponseViewer Component
 * 
 * This component displays the current survey responses in a modal dialog.
 * It allows administrators to view the state of responses without downloading a file.
 */
import { useState } from 'react';
import { colorVars } from '../styles/colors';

const ResponseViewer = ({ isOpen, onClose, responses }) => {
  const [showRaw, setShowRaw] = useState(false);
  
  if (!isOpen) return null;
  
  // Styles for the modal
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    },
    modal: {
      backgroundColor: colorVars.background,
      borderRadius: '8px',
      boxShadow: `0 4px 8px ${colorVars.shadow}`,
      padding: '20px',
      width: '90%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      position: 'sticky',
      top: 0,
      backgroundColor: colorVars.background,
      padding: '10px 0',
      zIndex: 10
    },
    title: {
      color: colorVars.textPrimary,
      fontSize: '1.25rem',
      fontWeight: 'bold',
      margin: 0
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: colorVars.textPrimary,
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '5px'
    },
    content: {
      color: colorVars.textPrimary
    },
    tabBar: {
      display: 'flex',
      marginBottom: '15px',
      borderBottom: `1px solid ${colorVars.border}`
    },
    tab: {
      padding: '8px 16px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid transparent',
      color: colorVars.textSecondary
    },
    activeTab: {
      borderBottom: `2px solid ${colorVars.primary}`,
      color: colorVars.textPrimary
    },
    userCard: {
      marginBottom: '20px',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: colorVars.backgroundAlt,
      boxShadow: `0 2px 4px ${colorVars.shadow}`
    },
    userEmail: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: colorVars.textPrimary
    },
    responseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '10px'
    },
    responseItem: {
      padding: '8px',
      backgroundColor: `${colorVars.primary}10`,
      borderRadius: '4px'
    },
    responseKey: {
      fontWeight: 'bold',
      color: colorVars.textPrimary
    },
    responseValue: {
      color: colorVars.textSecondary,
      wordBreak: 'break-word'
    }
  };
  
  // Filter user-specific data from responses
  const getUserData = (response) => {
    const userData = {};
    Object.keys(response).forEach(key => {
      if (!key.match(/^s\dq\d+/) && !key.match(/^s\dq\d+_comment/)) {
        userData[key] = response[key];
      }
    });
    return userData;
  };
  
  // Format response data for display
  const formatResponseData = (response) => {
    const answers = {};
    const comments = {};
    
    Object.keys(response).forEach(key => {
      // If it's an answer (s1q1, s2q3, etc.)
      if (key.match(/^s\dq\d+$/) && !key.includes('_comment')) {
        answers[key] = response[key];
      }
      // If it's a comment (s1q1_comment, etc.)
      else if (key.match(/^s\dq\d+_comment$/)) {
        comments[key] = response[key];
      }
    });
    
    return { answers, comments };
  };
  
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Survey Responses</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div style={styles.tabBar}>
          <button 
            style={{ ...styles.tab, ...(showRaw ? {} : styles.activeTab) }}
            onClick={() => setShowRaw(false)}
          >
            Formatted View
          </button>
          <button 
            style={{ ...styles.tab, ...(showRaw ? styles.activeTab : {}) }}
            onClick={() => setShowRaw(true)}
          >
            Raw JSON
          </button>
        </div>
        
        <div style={styles.content}>
          {showRaw ? (
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(responses, null, 2)}
            </pre>
          ) : (
            <div>
              {responses.map((response, index) => (
                <div key={index} style={styles.userCard}>
                  <div style={styles.userEmail}>
                    {response.Business_Email || `User ${index + 1}`}
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '5px 0' }}>User Info</h4>
                    <div style={styles.responseGrid}>
                      {Object.entries(getUserData(response)).map(([key, value]) => (
                        <div key={key} style={styles.responseItem}>
                          <div style={styles.responseKey}>{key}</div>
                          <div style={styles.responseValue}>{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ margin: '5px 0' }}>Survey Answers</h4>
                    <div style={styles.responseGrid}>
                      {Object.entries(formatResponseData(response).answers).map(([key, value]) => (
                        <div key={key} style={styles.responseItem}>
                          <div style={styles.responseKey}>{key}</div>
                          <div style={styles.responseValue}>{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {Object.keys(formatResponseData(response).comments).length > 0 && (
                    <div style={{ marginTop: '15px' }}>
                      <h4 style={{ margin: '5px 0' }}>Comments</h4>
                      <div style={styles.responseGrid}>
                        {Object.entries(formatResponseData(response).comments).map(([key, value]) => (
                          <div key={key} style={styles.responseItem}>
                            <div style={styles.responseKey}>{key.replace('_comment', '')}</div>
                            <div style={styles.responseValue}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseViewer; 