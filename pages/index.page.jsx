import React from 'react';
import { Helmet } from 'react-helmet-async';
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
            <Helmet>
              <title>Qancha.uz - Home</title>
              <meta name="description" content="Welcome to Qancha.uz - Your trusted marketplace" />
              <meta property="og:title" content="Qancha.uz - Home" />
              <meta property="og:description" content="Welcome to Qancha.uz - Your trusted marketplace" />
            </Helmet>
            <h1>Welcome to Qancha.uz</h1>
            <App />
          </BrowserRouter>
        </AlertProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
