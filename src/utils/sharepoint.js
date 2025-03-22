import { sharepointConfig } from '../../sharepoint.config';
//AI generated code. Modify as needed.
export const saveSurveyResponse = async (responseData) => {
  try {
    const response = await fetch(`${sharepointConfig.siteUrl}/_api/web/lists/getbytitle('${sharepointConfig.listName}')/items`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      },
      body: JSON.stringify({
        '__metadata': { 'type': 'SP.Data.SurveyResponsesListItem' },
        'Title': responseData.title,
        'ResponseData': JSON.stringify(responseData.data),
        'SubmissionDate': new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save survey response');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving survey response:', error);
    throw error;
  }
};

export const exportToSharePoint = async (csvContent) => {
  try {
    const fileName = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`;
    const response = await fetch(`${sharepointConfig.siteUrl}/_api/web/lists/getbytitle('${sharepointConfig.libraryName}')/files/add(url='${fileName}',overwrite=true)`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      },
      body: JSON.stringify({
        '__metadata': { 'type': 'SP.File' },
        'ServerRelativeUrl': `/${sharepointConfig.libraryName}/${fileName}`,
        'Content': csvContent
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to export to SharePoint');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error exporting to SharePoint:', error);
    throw error;
  }
}; 