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
