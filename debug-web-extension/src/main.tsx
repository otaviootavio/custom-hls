import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MockHashChainExtensionProvider } from './context/MockChainExtensionProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MockHashChainExtensionProvider>
      <App />
    </MockHashChainExtensionProvider>
  </React.StrictMode>,
)