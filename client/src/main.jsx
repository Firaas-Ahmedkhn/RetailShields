import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NetworkWrapper from './Pages/Components/NetworkWrapper.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NetworkWrapper>
    <App />
    </NetworkWrapper>
  </StrictMode>,
)
