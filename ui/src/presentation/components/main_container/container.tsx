import { Box } from '@mui/material';
import './container.css';
import Auth from '../auth/auth';
import Home from '../home/home';
import DownloadPage from '../downloadPage/downloadPage';
import { useAuth } from '@/application/context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


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
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/downloadPage" element={<DownloadPage />} />
              </Routes>
          </Router>
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

