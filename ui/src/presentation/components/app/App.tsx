import './App.css'
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme.ts';
import Container from '../main_container/container';
import { AuthProvider } from '@/application/context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Container/>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
