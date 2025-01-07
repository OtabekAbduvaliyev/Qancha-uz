import express from 'express';
import prerender from 'prerender-node';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable compression
app.use(compression());

// Configure prerender-node
app.use(prerender.set('prerenderToken', 'wCd7mtJB2q50Hdag6L75'));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
