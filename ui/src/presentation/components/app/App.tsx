import './App.css'
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme.ts';
import Container from '../main_container/container';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container/>
    </ThemeProvider>
  )
}

export default App
