import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import App from './src/App.jsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function prerender() {
  const helmetContext = {};
  const app = React.createElement(
    HelmetProvider,
    { context: helmetContext },
    React.createElement(App)
  );

  try {
    // Render the app to string
    ReactDOMServer.renderToString(app);

    // Get the helmet data
    const { helmet } = helmetContext;

    if (!helmet) {
      console.log('No helmet context found. Skipping meta tag injection.');
      return;
    }

    // Read the template
    const templatePath = path.resolve(__dirname, 'dist', 'index.html');
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Insert the meta tags
    const html = template.replace(
      '</head>',
      `${helmet.title ? helmet.title.toString() : ''}
      ${helmet.meta ? helmet.meta.toString() : ''}
      ${helmet.link ? helmet.link.toString() : ''}
      </head>`
    );

    // Write the final HTML
    fs.writeFileSync(templatePath, html);
    console.log('Successfully injected meta tags into index.html');
  } catch (error) {
    console.error('Error during prerendering:', error);
  }
}

prerender().catch(console.error);
