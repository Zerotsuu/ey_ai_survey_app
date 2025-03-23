# Survey Response Update Utility

This Node.js script provides a command-line utility for updating survey responses in the Survey Response JSON file.

## How to Use

### Prerequisites
- Node.js must be installed
- Make sure you have the correct file structure with the survey responses at `src/response/SurveyResponse.json`

### Basic Usage

#### Individual Updates

You can update a single question's response using:

```bash
node updateSurvey.cjs <email> <questionId> <value> [commentText]
```

Examples:
```bash
# Update just a question answer
node updateSurvey.cjs user@example.com s1q1 4

# Update a question answer with a comment
node updateSurvey.cjs user@example.com s1q1 4 "This is my comment"

# Update just a comment for a question
node updateSurvey.cjs user@example.com s1q1_comment "Just updating the comment"
```

#### Batch Updates

You can update multiple questions for multiple users at once using a JSON file:

```bash
node updateSurvey.cjs --batch path/to/updates.json
```

Example updates.json format:
```json
{
  "user1@example.com": {
    "s1q1": 4,
    "s1q1_comment": "This is a comment for question 1",
    "s1q2": 3
  },
  "user2@example.com": {
    "s1q1": 5,
    "s2q1": 2
  }
}
```

### Notes

- Question IDs should be in the format `s1q1` (not `s1_q1`)
- Comments are stored with the suffix `_comment` (e.g., `s1q1_comment`)
- Rating values (1-5) will be stored as numbers
- Other values will be stored as strings
- The script will automatically update the `Last_Modified_Date` field for each user

## Integration with the React App

This script is designed to be run independently from the command line, but the survey application also includes direct update functionality through:

1. The Admin Utility page
2. The Direct Update panel in the main survey interface
3. The `updateUserResponses` function in `src/utils/updateResponses.js`

### Using CJS functionality in the Web App

The web application includes an adapter that mimics the functionality of the Node.js script. This allows you to use the same update format in both the command line and the web application. The following components and utilities are available:

#### Admin Utility Page

The Admin Utility page includes a "Batch Update (CJS-Compatible)" tab that allows you to paste a JSON object with the same format as used in the Node.js script.

#### Direct API Access

For programmatic access within the web app, you can use the following functions from `src/utils/updateResponses.js`:

```js
// Update a single user's responses
await updateUserResponses('user@example.com', { s1q1: 4, s1q2: 3 });

// Process a batch update for multiple users
await processBatchUserUpdates({
  "user1@example.com": {
    "s1q1": 4,
    "s1q2": 3
  },
  "user2@example.com": {
    "s1q1": 5
  }
});

// Parse a JSON string into a batch update object
const batchData = parseBatchUserUpdates(jsonString);
```

The command line script is useful for batch updates or automated processes that need to run outside the application, while the web app integration provides a user-friendly interface for making similar updates directly in the browser. 