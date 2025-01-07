import { renderPage } from 'vite-plugin-ssr/server';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
  const pageContextInit = {
    urlOriginal: req.url
  };

  try {
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const { body, statusCode, contentType, earlyHints } = httpResponse;
    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    }

    res.statusCode = statusCode;
    res.setHeader('Content-Type', contentType);
    res.end(body);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
