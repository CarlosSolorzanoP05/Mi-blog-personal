import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './componentes/Login';
import { LogoutButton } from './componentes/Logout';
import { Profile } from './componentes/Profile';
import './App.css';
import React from 'react';
import Info from './componentes/info';
import BlogManager from "./componentes/BlogManager";
import facebookIcon from './componentes/icons/facebook.png';
import youtubeIcon from './componentes/icons/youtube.png';
import xIcon from './componentes/icons/x.png';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          Historia y cultura <strong>UNEMI</strong>
        </div>
        <div className="header-right">
          {isAuthenticated ? (
            <>
              <div className="profile-container">
                <Profile />
              </div>
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </header>
      <main className="App-content">
        {isAuthenticated ? (
          <>
            <Info />
            <BlogManager />
          </>
        ) : (
          <p>Por favor, inicia sesión para acceder a la información y los miniblog.</p>
        )}
      </main>

      {/* Sección de redes sociales */}
      <footer className="App-footer">
  <p>Síguenos en</p>
  <div className="social-icons">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
      <img src={facebookIcon} alt="Facebook" />
    </a>
    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
      <img src={youtubeIcon} alt="YouTube" />
    </a>
    <a href="https://x.com" target="_blank" rel="noopener noreferrer">
      <img src={xIcon} alt="X" />
    </a>
  </div>
</footer>

    </div>
  );
}

export default App;
