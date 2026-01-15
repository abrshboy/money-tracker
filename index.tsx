
import React from 'react';
import ReactDOM from 'react-dom/client';
// In browser-only mode with Babel, we often need to specify the extension if not bundled
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
