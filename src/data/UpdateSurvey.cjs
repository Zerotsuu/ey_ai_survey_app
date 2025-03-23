const fs = require('fs');
const path = require('path');

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

// Function to register a new respondent
function registerRespondent(newRespondent) {
  const filePath = path.join(__dirname, 'SurveyResponse.json');

  // Check if the file exists
  let data = [];
  if (fs.existsSync(filePath)) {
    // Read existing data
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  // Add the new respondent to the data
  data.push(newRespondent);

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`New respondent added: ${newRespondent.Business_Email}`);
}

// Example of Register Repsondent
const newRespondent = {
  Business_Email: "john.doe@example.com",
  First_Name: "John",
  Last_Name: "Doe",
  Company: "Tech Solutions",
  Job_Title: "Software Engineer",
  Industry: "Technology",
  Industry_Category: "Software Development",
  Employee_Count: 200,
  Annual_Revenue: 10000000
};
registerRespondent(newRespondent);

//Example of Updating Survey
const updateResponseData = {
  s1q1: 1,
  s1q1_comment: 'I have clarity now',
  s1q1: 2,
  s1q1_comment: 'What the fuck is this question',
  s2q1: 3,
  s2q1_comment: 'I have clarity now',
  s2q5: 4,
  s2q5_comment: 'What the fuck is this question'
}
updateSurveyResponse('arnold.carlmar.v.silva@ph.ey.com', updateResponseData)

