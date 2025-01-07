import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  app.use(compression());
  app.use(serveStatic(resolve('dist/client')));

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      // Read index.html
      let template = fs.readFileSync(
        resolve('../index.html'),
        'utf-8'
      );

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      // Load your server entry
      const { default: App } = await vite.ssrLoadModule('/src/App.jsx');

      // Create a fresh Helmet context for each request
      const helmetContext = {};

      // Render the app
      const appHtml = renderToString(
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      );

      // Get Helmet data
      const { helmet } = helmetContext;

      // Insert helmet meta tags
      const head = `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      `;

      // Replace meta tags in template
      const html = template
        .replace('</head>', `${head}</head>`)
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      // Send the rendered HTML back
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

createServer();
