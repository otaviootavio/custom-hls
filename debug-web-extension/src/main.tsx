import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashchainProvider } from './context/HashchainProvider'
import { MockStorage } from './storage/MockStorage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashchainProvider storage={MockStorage}>
      <App />
    </HashchainProvider>
  </React.StrictMode>,
)