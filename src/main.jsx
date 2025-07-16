import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext';
import { PeopleProvider } from './context/PeopleContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PeopleProvider>
          <App />
        </PeopleProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
