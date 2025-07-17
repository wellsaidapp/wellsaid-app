import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext';
import { PeopleProvider } from './context/PeopleContext';
import { SystemCollectionsProvider } from './context/SystemCollectionsContext';
import { UserCollectionsProvider } from './context/UserCollectionsContext';
import { InsightProvider } from './context/InsightContext';
import { BooksProvider } from './context/BooksContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PeopleProvider>
          <SystemCollectionsProvider>
            <UserCollectionsProvider>
              <InsightProvider>
                <BooksProvider>
                  <App />
                </BooksProvider>
              </InsightProvider>
            </UserCollectionsProvider>
          </SystemCollectionsProvider>
        </PeopleProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
