import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import ILoginProps from "@/application/interfaces/ILoginProps";

const Login = ({ open, setOpen, onLoginSuccess }: ILoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter all required fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password 
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.user);
        setOpen(false);
      } else {
        setErrorMessage(data.message || "Wrong email or password");
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => !isLoading && setOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Вхід в систему</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          autoComplete="email"
        />
        <TextField
          label="Пароль"
          fullWidth
          margin="dense"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="current-password"
        />
        
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setOpen(false)}
          disabled={isLoading}
          color="secondary"
        >
          Reject
        </Button>
        <Button 
          onClick={handleLogin} 
          variant="contained"
          disabled={isLoading}
          endIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Loading..." : "Log in"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;