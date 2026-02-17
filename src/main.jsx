import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // <--- IF THIS LINE IS MISSING, THE APP IS BLACK & WHITE.
<h1 className="text-4xl font-bold text-red-500">
  Tailwind Working
</h1>


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)