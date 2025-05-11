import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, Stack
} from '@mui/material';
import { useState, useEffect } from 'react';
import ILoginProps from '@/application/interfaces/ILoginProps';

/* ——— util ——— */
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

const Signup = ({ open, setOpen }: ILoginProps) => {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  /** локальні помилки / success */
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* --------- валідація полів --------- */
  const emailError    = email && !gmailRegex.test(email)
    ? 'Must be a valid @gmail.com address'
    : '';
  const passwordError = password && password.length < 5
    ? 'Password must be ≥ 5 characters'
    : '';
  const formValid = !!username && !emailError && !passwordError;

  /* --------- обробник реєстрації --------- */
  const handleRegister = async () => {
    setError(''); setSuccess('');
    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password })
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: 'Failed to register' }));
        throw new Error(message);
      }

      setSuccess('Registration successful!');
      /* очищаємо форму */
      setUsername(''); setEmail(''); setPassword('');
      setTimeout(() => setOpen(false), 1000);
    } catch (err: unknown) {
  if (err instanceof Error) {
     setError(err.message);
    } else {
      setError('Registration failed');
    }
   }
  };

  /* --------- скидання стану при відкритті/закритті --------- */
  useEffect(() => {
    if (!open) {
      setUsername(''); setEmail(''); setPassword('');
      setError(''); setSuccess('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Sign Up</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />

          {error   && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!formValid}
          onClick={handleRegister}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Signup;
