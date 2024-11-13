import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import reportWebVitals from './reportWebVitals'; // Importa reportWebVitals

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="carlossolorzano.eu.auth0.com"
      clientId="VJZ6R9dML8Md2TaXqeXvFRZUUcUIuNOR"
      redirectUri={window.location.origin}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);

// Llama a reportWebVitals si deseas reportar el rendimiento
reportWebVitals();