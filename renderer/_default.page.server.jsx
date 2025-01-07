import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { PageShell } from './PageShell';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server';
import { HelmetProvider } from 'react-helmet-async';

export { render };
export { passToClient };

const passToClient = ['pageProps', 'urlPathname'];

async function render(pageContext) {
  const { Page, pageProps } = pageContext;
  const helmetContext = {};

  const pageHtml = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet.htmlAttributes.toString())}>
      <head>
        ${dangerouslySkipEscape(helmet.title.toString())}
        ${dangerouslySkipEscape(helmet.meta.toString())}
        ${dangerouslySkipEscape(helmet.link.toString())}
      </head>
      <body ${dangerouslySkipEscape(helmet.bodyAttributes.toString())}>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some custom pageContext here if needed
    }
  };
}
