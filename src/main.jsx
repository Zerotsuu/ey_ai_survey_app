import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import './styles/colors.css'
import { applyColorTheme } from './styles/colors.js'

// Apply default color theme
applyColorTheme()

// Initialize the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 