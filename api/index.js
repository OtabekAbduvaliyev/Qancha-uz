import { renderPage } from 'vite-plugin-ssr/server';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const app = express();
app.use(compression());

// Serve static files
app.use(sirv(`${root}/dist/client`, {
  maxAge: 31536000,
  immutable: true
}));

app.all('*', async (req, res) => {
  try {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    };

    const pageContext = await renderPage(pageContextInit);
    
    if (!pageContext.httpResponse) {
      res.status(404).send('Not Found');
      return;
    }

    const { body, statusCode, contentType, earlyHints } = pageContext.httpResponse;

    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    }

    res.status(statusCode).type(contentType).send(body);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Only start server if we're not in Vercel
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

export default app;
