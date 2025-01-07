import React from 'react';
import { PageContextProvider } from './usePageContext';

export function PageShell({ children, pageContext }) {
  return (
    <PageContextProvider pageContext={pageContext}>
      {children}
    </PageContextProvider>
  );
}
