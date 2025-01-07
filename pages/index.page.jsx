import React from 'react';
import { Helmet } from 'react-helmet-async';

export { Page };

function Page() {
  return (
    <>
      <Helmet>
        <title>Qancha.uz - Home</title>
        <meta name="description" content="Welcome to Qancha.uz - Your trusted marketplace" />
        <meta property="og:title" content="Qancha.uz - Home" />
        <meta property="og:description" content="Welcome to Qancha.uz - Your trusted marketplace" />
      </Helmet>
      <h1>Welcome to Qancha.uz</h1>
    </>
  );
}
