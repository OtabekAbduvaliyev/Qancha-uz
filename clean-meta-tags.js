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

  // Only remove specific meta tags that might conflict
  const cleanedData = data.replace(/<meta\s+name="description"[^>]*>/g, '')
                         .replace(/<meta\s+name="keywords"[^>]*>/g, '');

  fs.writeFile(filePath, cleanedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to index.html:', err);
      return;
    }
    console.log('Unwanted meta tags removed successfully!');
  });
});
