import React from 'react';
import ReactDOM from 'react-dom/client';
import { PageShell } from './PageShell';
import { HelmetProvider } from 'react-helmet-async';

export async function render(pageContext) {
  const { Page, pageProps } = pageContext;
  
  ReactDOM.hydrateRoot(
    document.getElementById('root'),
    <HelmetProvider>
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>
    </HelmetProvider>
  );
}
