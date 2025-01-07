import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

async function createServer() {
  const app = express();

  try {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // Compression middleware
    app.use(compression());
    
    // Serve static files
    app.use(express.static(resolve('../dist/client')));

    app.use('*', async (req, res, next) => {
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
        const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

        // Render the app
        const { html: appHtml, helmet } = await render(url);

        // Insert meta tags and app HTML
        const finalHtml = template
          .replace('</head>', `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}</head>`)
          .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

        // Send the rendered HTML back
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e) {
        // If an error is caught, let Vite fix the stack trace
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

    // Error handling
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (e) {
    console.error(e);
  }
}

createServer();
