import { Box } from '@mui/material';
import './container.css';
import Auth from '../auth/auth';
import { useState } from 'react';


const firstTitle = 'Transfer and have your files travel for free';
const lowerTitle = 'FastShare is a simple and free way to securely share your files and folders.';
const appName = 'FastShare';

const Container = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Box className="main-container">
      <Box className="header">
        <div className="header-logo">
          <p>{appName}</p>
        </div>
        <Auth isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
      </Box>
      <Box className="container-main">
        <div className="upload-button-container">
          <div className="upload-button-text">
            <h1>{firstTitle}</h1>
            <h2>{lowerTitle}</h2>
          </div>
        </div>
      </Box>
      <Box className="footer">
        <div className="footer-content">
          <p className="copyright">FastShare © {new Date().getFullYear()}</p>
          <div className="footer-links">
            <a href="#privacy">Telegram</a>
            <a href="#terms">FAQ</a>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Container;




