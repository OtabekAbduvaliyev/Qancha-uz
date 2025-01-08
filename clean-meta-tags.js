import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the correct file path
const filePath = path.join(__dirname, 'dist', 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Use a regular expression to remove unwanted meta tags
  const cleanedData = data.replace(/<meta .*?(unwanted-keyword|another-keyword).*?>/g, '');

  fs.writeFile(filePath, cleanedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing index.html:', err);
    } else {
      console.log('Unwanted meta tags removed successfully!');
    }
  });
});
