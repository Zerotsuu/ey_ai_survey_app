export const sharepointConfig = {
  // SharePoint site URL - to be configured during deployment
  siteUrl: '',
  
  // SharePoint list name for storing survey responses
  listName: 'SurveyResponses',
  
  // SharePoint library name for storing exported files
  libraryName: 'SurveyExports',
  
  // SharePoint page title
  pageTitle: 'Survey Form',
  
  // SharePoint page description
  pageDescription: 'Interactive survey form for collecting responses',
  
  // SharePoint web part title
  webPartTitle: 'Survey Form',
  
  // SharePoint web part description
  webPartDescription: 'A React-based survey form component',
  
  // SharePoint web part icon
  webPartIcon: 'Survey',
  
  // SharePoint web part group
  webPartGroup: 'Custom Components',
  
  // SharePoint web part properties
  webPartProperties: {
    backgroundColor: '#2e026d',
    textColor: '#ffffff',
    showNavigation: true,
    allowExport: true
  }
}; 