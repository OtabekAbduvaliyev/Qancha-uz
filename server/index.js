import express from 'express';
import compression from 'compression';
import { renderPage } from 'vite-plugin-ssr/server';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import sirv from 'sirv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(__dirname, '..');

const app = express();

app.use(compression());

// Serve static files
if (isProduction) {
  app.use(sirv(`${root}/dist/client`, { 
    maxAge: 31536000, 
    immutable: true 
  }));
}

app.get('*', async (req, res, next) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl
  };

  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;

  if (!httpResponse) {
    return next();
  }

  const { body, statusCode, contentType, earlyHints } = httpResponse;
  if (res.writeEarlyHints) {
    res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
  }
  res.status(statusCode).type(contentType).send(body);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if (!isProduction) {
  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

// For Vercel
export default app;
