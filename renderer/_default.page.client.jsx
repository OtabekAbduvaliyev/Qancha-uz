import React from 'react';
import ReactDOM from 'react-dom/client';
import { PageShell } from './PageShell';
import { HelmetProvider } from 'react-helmet-async';

export async function render(pageContext) {
  const { Page, pageProps } = pageContext;
  
  const root = document.getElementById('root');
  
  if (!root.innerHTML) {
    // First render
    ReactDOM.createRoot(root).render(
      <HelmetProvider>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </HelmetProvider>
    );
  } else {
    // Hydration
    ReactDOM.hydrateRoot(
      root,
      <HelmetProvider>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </HelmetProvider>
    );
  }
}
