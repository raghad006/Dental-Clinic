import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from './state/AppContext';     // old context
import { UserProvider } from './context/UserContext'; // new context

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
