import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const toasterOptions = {
  position: "bottom-right",
  toastOptions: {
    style: {
      background: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #334155',
    },
  },
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster {...toasterOptions} />
  </BrowserRouter>
)
