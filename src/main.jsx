import React from 'react'
import ReactDOM from 'react-dom/client'
// import { HelmetProvider } from 'react-helmet'
import './index.css'
import App from './App.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
    // <HelmetProvider>
      <App />
    // </HelmetProvider>
  // </React.StrictMode>
)
