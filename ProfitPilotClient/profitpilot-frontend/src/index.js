import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Select the root element from the HTML
const container = document.getElementById('root');

// Create a root using ReactDOM.createRoot
const root = ReactDOM.createRoot(container);

// Render the application using the new API
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
