import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './vault.css'
import { VaultApp } from './VaultApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VaultApp />
  </StrictMode>,
)
