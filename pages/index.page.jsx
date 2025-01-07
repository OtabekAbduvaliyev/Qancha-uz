import React from 'react';
import App from '../src/App';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AlertProvider } from '../src/contexts/AlertContext';

export { Page };

function Page() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AlertProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AlertProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
