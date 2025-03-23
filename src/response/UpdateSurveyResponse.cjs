const fs = require('fs');
const path = require('path');

const Business_Email = 'arnold.carlmar.v.silva@ph.ey.com';

function updateSurveyResponse(email, updates) {
  const filePath = path.join(__dirname, 'SurveyResponse.json');

  // Read the JSON file
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Find the entry with the matching Business_Email
  const entry = data.find((item) => item.Business_Email === email);

  if (entry) {
    // Update or add the fields
    entry.s1q1 = updates.s1q1;
    entry.s1q1_comment = updates.s1q1_comment;
  } else {
    console.error(`No entry found for Business_Email: ${email}`);
    return;
  }

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Survey response updated for ${email}`);
}

// Example usage
updateSurveyResponse(Business_Email, {
  s1q1: 4,
  s1q1_comment: 'I have clarity now',
  s1q1: 3,
  s1q1_comment: 'What the fuck is this question'
});

