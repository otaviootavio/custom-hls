import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashchainProvider } from './context/HashchainProvider'
import { ExtensionStorage } from './storage/ExtensionStorage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashchainProvider storage={new ExtensionStorage()}>
      <App />
    </HashchainProvider>
  </React.StrictMode>,
)