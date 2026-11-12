import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Connect Frontend to Live Render Backend
axios.defaults.baseURL = 'https://aeroguard-0f2q.onrender.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
