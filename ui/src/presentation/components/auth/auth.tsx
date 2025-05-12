import { Button } from '@mui/material';
import Login from '../login/loginModalForm';
import Signup from "../signup/signupModalForm";
import { useState } from 'react';
import './auth.css';
import { UserData } from '@/application/interfaces/IUserData';
interface AuthProps {
  isLoggedIn: boolean;
  onLoginSuccess: (user: UserData) => void;  
  onLogout: () => void;
}
const Auth = ({ isLoggedIn, onLoginSuccess, onLogout }: AuthProps) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  return (
    <div className="header-buttons">
      {!isLoggedIn ? (
        <>
          <Button variant="contained" size="small" onClick={() => setOpenLogin(true)}>
            Log In
          </Button>
          <Button variant="contained" size="small" onClick={() => setOpenSignIn(true)}>
            Sign In
          </Button>
        </>
      ) : (
        <Button variant="contained" size="small" onClick={onLogout}>
          Exit
        </Button>
      )}

      <Login open={openLogin} setOpen={setOpenLogin} onLoginSuccess={onLoginSuccess} />
      <Signup open={openSignIn} setOpen={setOpenSignIn} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default Auth; 