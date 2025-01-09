import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')
const render = (Component) => {
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(
      rootElement,
      <React.StrictMode>
        <HelmetProvider>
          <Component />
        </HelmetProvider>
      </React.StrictMode>
    )
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <HelmetProvider>
          <Component />
        </HelmetProvider>
      </React.StrictMode>
    )
  }
  document.dispatchEvent(new Event('render-event'))
}

render(App)
