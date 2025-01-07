import React from 'react';
import { PageContextProvider } from './usePageContext';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AlertProvider } from '../src/contexts/AlertContext';
import '../src/index.css';

export function PageShell({ children, pageContext }) {
  return (
    <PageContextProvider pageContext={pageContext}>
      <BrowserRouter>
        <AuthProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </AuthProvider>
      </BrowserRouter>
    </PageContextProvider>
  );
}
