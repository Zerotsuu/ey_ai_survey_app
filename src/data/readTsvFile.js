import fs from 'fs';
import path from 'path';

// Hardcoded fileName and filePath
const fileName = "QuestionList.tsv";
const filePath = "c:\\Users\\bh473ep\\OneDrive - EY\\Documents\\Projects\\EY AI Maturity Campaign\\ey_ai_survey_app\\src\\data";

// Function to read the TSV file and convert it to JSON
const readTsvFile = () => {
  const tsvFilePath = path.join(filePath, fileName);

  // Read the TSV file
  const tsvData = fs.readFileSync(tsvFilePath, 'utf-8');

  // Parse the TSV file into JSON
  const lines = tsvData.trim().split('\n');
  const headers = lines[0].split('\t');
  const jsonData = lines.slice(1).map((line) => {
    const values = line.split('\t');
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index];
      return acc;
    }, {});
  });

  // Write the JSON file
  const jsonFilePath = path.join(filePath, 'QuestionList.json');
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
  console.log(`Converted ${fileName} to QuestionList.json at ${filePath}`);
};

// Run the function
readTsvFile();