
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure React is imported and used correctly
const root = createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
