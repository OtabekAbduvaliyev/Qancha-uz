import React from 'react';
import { PageContextProvider } from './usePageContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AlertProvider } from '../src/contexts/AlertContext';
import '../src/index.css';

export function PageShell({ children, pageContext }) {
  return (
    <PageContextProvider pageContext={pageContext}>
      <AuthProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </AuthProvider>
    </PageContextProvider>
  );
}
