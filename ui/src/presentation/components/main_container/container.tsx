import { Box } from '@mui/material';
import './container.css';
import Auth from '../auth/auth';
import ActionButton from '../launch/actionBtn';
import { useAuth } from '@/application/context/AuthContext';

const firstTitle = 'Transfer and have your files travel for free';
const lowerTitle = 'FastShare is a simple and free way to securely share your files and folders.';
const appName = 'FastShare';

const Container = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Box className="main-container">
      <Box className="header">
        <div className="header-logo">
          <p>{appName}</p>
        </div>
 
        <Auth
          isLoggedIn={isAuthenticated}
          onLogout={logout}
          onLoginSuccess={login}
        />
      </Box>

      <Box className="container-main">
        <div className="upload-button-container">
          <div className="upload-button-text">
            <h1>{firstTitle}</h1>
            <h2>{lowerTitle}</h2>
          </div>

          {isAuthenticated && <ActionButton />}
        </div>
      </Box>

      <Box className="footer">
        <div className="footer-content">
          <p className="copyright">FastShare © {new Date().getFullYear()}</p>
        </div>
      </Box>
    </Box>
  );
};

export default Container;

