# CJS Script Integration

This document explains how the web application integrates with the CommonJS (CJS) script to update the JSON file in real-time when submitting or saving survey responses.

## Overview

The application includes a Node.js-compatible CJS script (`updateSurvey.cjs`) that can directly update the `SurveyResponse.json` file. The web application now integrates with this script via API endpoints, allowing real-time updates to the JSON file when users submit their surveys or save drafts.

## How It Works

1. When a user submits a survey or saves a draft, the application first saves the responses in the browser's localStorage (as before).
2. Additionally, the application now makes an API call to execute the CJS script directly, updating the actual JSON file on the server.
3. The CJS script runs in a Node.js environment, with full access to the file system, allowing it to update the JSON file directly.

## API Endpoints

Two new API endpoints have been added to facilitate this integration:

### 1. `/api/execute-cjs`

- **Purpose**: Updates a single user's survey responses
- **Method**: POST
- **Input**: 
  ```json
  {
    "email": "user@example.com",
    "updates": {
      "s1q1": 4,
      "s1q1_comment": "This is my comment",
      "s1q2": 3
    }
  }
  ```
- **Output**:
  ```json
  {
    "success": true,
    "message": "Script executed successfully",
    "output": "Script stdout output..."
  }
  ```

### 2. `/api/execute-batch-cjs`

- **Purpose**: Updates multiple users' survey responses at once
- **Method**: POST
- **Input**: 
  ```json
  {
    "batchUpdates": {
      "user1@example.com": {
        "s1q1": 4,
        "s1q2": 3
      },
      "user2@example.com": {
        "s1q1": 5,
        "s1q2": 2
      }
    }
  }
  ```
- **Output**:
  ```json
  {
    "success": true,
    "message": "Batch script executed successfully",
    "output": "Script stdout output..."
  }
  ```

## Security Considerations

- The API endpoints run server-side Node.js code that has access to the file system
- Proper validation is included to ensure only valid updates are processed
- The temporary files created for updates are automatically deleted after processing

## Fallback Behavior

The application still maintains its localStorage-based state management as a fallback:

1. If the CJS script execution fails, the application will still save responses to localStorage
2. The user will be informed about the status, including whether the JSON file was successfully updated

## Testing the Integration

You can test this integration by:

1. Filling out the survey form and clicking "Submit" or "Save Draft"
2. Check the browser console for logs about the CJS script execution
3. Verify that the SurveyResponse.json file has been updated with your changes

## Troubleshooting

- If the JSON file is not being updated, check that the API server is running
- Verify that the script paths in the API endpoints match your file structure
- Check permissions on the SurveyResponse.json file to ensure it's writable 