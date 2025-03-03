import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import App from './presentation/components/app/App.tsx'

createRoot(document.getElementById('root')!).render(

  
  <StrictMode>
    <App />
  </StrictMode>,
)
