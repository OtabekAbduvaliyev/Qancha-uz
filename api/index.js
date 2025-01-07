import express from 'express';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import helmetAsync from 'react-helmet-async';
const { HelmetProvider } = helmetAsync;
import reactRouterDom from 'react-router-dom/dist/server.js';
const { StaticRouter } = reactRouterDom;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

const app = express();

// Middleware
app.use(compression());

// Serve static files from both dist/client and public directories
app.use(express.static(resolve('../dist/client')));
app.use(express.static(resolve('../public')));

// SSR handler
app.use('*', async (req, res) => {
  const url = req.originalUrl;

  // Handle static file requests first
  const staticFiles = ['/site.webmanifest', '/favicon.ico', '/favicon-16x16.png', '/favicon-32x32.png'];
  if (staticFiles.includes(url)) {
    const filePath = resolve(`../public${url}`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  try {
    // Read the static index.html file
    const template = fs.readFileSync(
      resolve('../dist/client/index.html'),
      'utf-8'
    );

    // Import the server entry point
    const { render } = await import('../dist/server/entry-server.js');

    // Render the app
    const { html: appHtml, helmet } = await render(url);

    // Insert meta tags and app HTML
    const finalHtml = template
      .replace('</head>', `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    // Send the rendered HTML back
    res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
  } catch (e) {
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
