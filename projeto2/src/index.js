// index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Importe a função createRoot
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DataProvider } from './DataContext';

const root = createRoot(document.getElementById('root')); 

root.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);

reportWebVitals();
