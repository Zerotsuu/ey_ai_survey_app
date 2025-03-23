# Survey Form for SharePoint

A React-based survey form component that can be deployed as a SharePoint web part.

Uses react+vite. can use AI to translate jsx to plain js for plain Reactjs.

## Features

- Interactive survey form with multiple sections
- Progress tracking with visual indicators
- Export responses to CSV or SharePoint
- Save draft functionality
- Responsive design
- Custom Color Theming (Accents)

## Project Structure

```
survey-form-sharepoint/
├── public/                    # Static files
├── sharepoint/                # SharePoint-specific files
│   ├── manifest.json          # SharePoint web part manifest
│   └── webpart.js             # SharePoint web part entry point
├── src/
│   ├── components/            # React components
│   ├── data/                  # Data files
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # CSS and style files
│   ├── utils/                 # Utility functions
│   ├── App.jsx                # Main App component
│   └── main.jsx               # Application entry point
├── index.html                 # HTML entry point
├── package.json               # Project dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── sharepoint.config.js       # SharePoint configuration
```

## Optimized Project Structure

The project has been reorganized to improve maintainability, separation of concerns, and code reuse. Here's an overview of the new structure:

```
src/
├── assets/                # Static assets like images, icons
├── components/            # Reusable UI components
│   ├── common/            # Generic components used across the app
│   │   ├── Button.jsx
│   │   ├── Tooltip.jsx
│   │   └── ...
│   ├── layout/            # Layout components
│   │   ├── TopNavigation.jsx
│   │   ├── SideNavigation.jsx
│   │   └── ...
│   └── survey/            # Survey-specific components
│       ├── DonutChart.jsx
│       ├── QuestionRow.jsx
│       ├── RadioGroup.jsx
│       └── ...
├── context/               # React context providers
│   ├── AuthContext.jsx    # Authentication context
│   └── SurveyContext.jsx  # Survey state management context
├── data/                  # Static data files and schemas
│   └── QuestionList.json
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   ├── useSurveyForm.js   # Survey form state management
│   └── ...
├── pages/                 # Page components
│   ├── AuthPage.jsx       # Login/authentication page
│   ├── SurveyPage.jsx     # Main survey page
│   ├── ResultsPage.jsx    # View responses page
│   └── ...
├── services/              # API and external service integrations
│   ├── api.js             # Base API configuration
│   ├── authService.js     # Authentication service
│   └── surveyService.js   # Survey data service
├── styles/                # Global styles and theme
│   ├── colors.js
│   └── global.css
├── utils/                 # Utility functions
│   ├── validators.js      # Form validation utilities
│   ├── formatters.js      # Data formatting utilities
│   └── ...
├── App.jsx                # Root App component (simplified)
└── main.jsx               # Entry point
```

### Key Improvements:

1. **Separation of Concerns**:
   - Moved business logic from App.jsx into appropriate context providers and hooks
   - Separated UI components from data management

2. **Code Organization**:
   - Components grouped by function (common, layout, survey)
   - Created a proper pages directory for top-level route components
   - Services directory for external API interactions

3. **State Management**:
   - Created context providers to make state available throughout the app
   - Reduced prop drilling by using context where appropriate

4. **Maintainability**:
   - Smaller, focused components with single responsibilities
   - Consistent naming conventions
   - Clear organization of files by function

5. **Performance**:
   - Optimized rendering with proper component splitting
   - Improved state management to reduce unnecessary re-renders

This restructuring will make the codebase more maintainable, easier to navigate, and create clearer boundaries between different parts of the application.

### Prerequisites

- Node.js (LTS v18).
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running Locally

To start the development server:

```bash
npm start
```

### Building for Production

To build the application for production:

```bash
npm run build
```

### Building for SharePoint

To build the application for SharePoint:

```bash
npm run sp-build
npm run sp-package
```
# Sharepoint notes
## 1. Deploy as a SharePoint Framework (SPFx) Web Part
Create an SPFx project that wraps your React application
Build the SPFx package (.sppkg file)
Upload to the App Catalog in your SharePoint tenant
Add the web part to your SharePoint pages
This approach requires some restructuring of your code but provides the best integration with SharePoint.
## 2. Deploy to SharePoint Asset Library
For a simpler approach:
Take your build output (the build folder)
Upload all files to a document library in SharePoint (like "Site Assets")
Create a page with a "Content Editor" or "Script Editor" web part
Reference your index.html file in the web part
## 3. Use SharePoint's Site Pages
Upload your build files to a SharePoint library
Create a new Site Page
Add a "Script Editor" web part
Add code to load your application's JavaScript and CSS
## 4. Host in SharePoint's App Part
Host your React app on a separate web server
Create an App Part in SharePoint that loads your external application in an iframe
##Important Considerations
#Authentication: Your app will need to handle SharePoint authentication if it needs to access SharePoint data
#CORS: If hosted externally, you'll need to handle cross-origin resource sharing
#Relative Paths: Update your build configuration to use relative paths that work in SharePoint
#API Access: Use the SharePoint REST API or Microsoft Graph API for data access

## SharePoint Configuration

Before deploying to SharePoint, update the `sharepoint.config.js` file with your SharePoint site details:

```javascript
export const sharepointConfig = {
  siteUrl: 'https://your-sharepoint-site.com',
  listName: 'SurveyResponses',
  libraryName: 'SurveyExports',
  // ... other settings
};
```

## Deployment

1. Build the SharePoint package
2. Upload the `.sppkg` file to your SharePoint App Catalog
3. Add the web part to your SharePoint page

## License

This project is licensed under the MIT License.

## CJS Script Integration

This application now integrates with the CommonJS (CJS) script for real-time JSON file updates. When users submit surveys or save drafts, the application will update the SurveyResponse.json file directly using the CJS script.

### How to Use the CJS Integration

1. Install the required dependencies:
   ```bash
   npm install
   ```

2. Start both the web application and the API server together:
   ```bash
   npm run dev
   ```

   This will start:
   - The main web application on port 5173 (default Vite port)
   - The API server on port 3001

3. Use the application normally - the CJS script will be executed automatically when you:
   - Submit a survey
   - Save a draft

### Manual CJS Script Execution

You can also manually run the CJS script to update survey responses:

```bash
# Update a single question response
npm run update-survey user@example.com s1q1 4

# Update a question with a comment
npm run update-survey user@example.com s1q1 4 "This is my comment"

# Update just a comment
npm run update-survey user@example.com s1q1_comment "Just updating the comment"

# Run a batch update from a JSON file
npm run update-survey -- --batch ./updates.json
```

For more details on the CJS script integration, see `src/utils/README_CJS_INTEGRATION.md`. 
