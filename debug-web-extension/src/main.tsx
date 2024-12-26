import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashChainExtensionProvider } from './context/HashChainExtensionProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashChainExtensionProvider>
      <App />
    </HashChainExtensionProvider>
  </React.StrictMode>,
)