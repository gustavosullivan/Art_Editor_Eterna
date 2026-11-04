import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { listenForInstallPrompt, registerAppServiceWorker } from './downloadAppLauncher'
import './index.css'
import './art.css'

registerAppServiceWorker()
listenForInstallPrompt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
