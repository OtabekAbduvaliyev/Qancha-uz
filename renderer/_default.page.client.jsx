import React from 'react';
import ReactDOM from 'react-dom/client';
import { PageShell } from './PageShell';
import { HelmetProvider } from 'react-helmet-async';

export async function render(pageContext) {
  const { Page, pageProps } = pageContext;
  
  const root = document.getElementById('root');
  
  if (!root.innerHTML) {
    // First render
    const rootElement = ReactDOM.createRoot(root);
    rootElement.render(
      <React.StrictMode>
        <HelmetProvider>
          <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
          </PageShell>
        </HelmetProvider>
      </React.StrictMode>
    );
  } else {
    // Hydration
    ReactDOM.hydrateRoot(
      root,
      <React.StrictMode>
        <HelmetProvider>
          <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
          </PageShell>
        </HelmetProvider>
      </React.StrictMode>
    );
  }
}
