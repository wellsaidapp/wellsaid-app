// Imports
import React, { useState, useEffect } from 'react';
import {
  Send, Plus, User, BookOpen, ChevronLeft, ChevronRight, Sparkles, Book, X,
  ChevronDown, Home, Bell, Settings, Users, Wand2, Lock, CheckCircle
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { Amplify } from 'aws-amplify';
import amplifyconfig from './aws-exports';

Amplify.configure({
  ...amplifyconfig,
  Auth: {
    region: amplifyconfig.aws_cognito_region,
    userPoolId: amplifyconfig.aws_user_pools_id,
    userPoolWebClientId: amplifyconfig.aws_user_pools_web_client_id,
    authenticationFlowType: 'CUSTOM_AUTH',
    oauth: amplifyconfig.oauth,
    // Add this explicit configuration:
    signUpVerificationMethod: 'code', // For custom auth
    passwordPolicy: {
      minLength: 8,
      requireLowercase: false,
      requireUppercase: false,
      requireNumbers: false,
      requireSpecialCharacters: false,
    }
  }
});

// Components actually used
import SplashScreen from './components/landingPage/SplashScreen';
import Header from './components/appLayout/Header';
import BottomNav from './components/appLayout/BottomNav';
import HomeView from './components/home/HomeView';
import CaptureView from './components/capture/CaptureView';
import LibraryView from './components/library/LibraryView';
import ProfileView from './components/profileView/ProfileView';
import PeopleView from './components/peopleView/PeopleView';
import WellSaidOnboarding from './components/landingPage/WellSaidOnboarding';

// Only keep constants you actually use
import { INDIVIDUALS } from './constants/individuals';
import { INSIGHTS } from './constants/insights';
import { CUSTOM_COLLECTIONS } from './constants/collections';
import { USER } from './constants/user';
import { SHARED_BOOKS } from './constants/sharedBooks';

const WellSaidApp = () => {

  const [authState, setAuthState] = useState('checking');
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [captureMode, setCaptureMode] = useState('quick');
  const [individuals, setIndividuals] = useState(INDIVIDUALS);
  const [insights, setInsights] = useState(INSIGHTS);
  const [libraryDefaultViewMode, setLibraryDefaultViewMode] = useState('collections');
  const [books, setBooks] = useState(SHARED_BOOKS);

  useEffect(() => {
    const storedAuthState = localStorage.getItem('wellsaid-auth-state');
    setAuthState(storedAuthState || 'new');

    // Skip splash if already logged in
    if (storedAuthState === 'loggedIn') {
      setShowSplash(false);
    }
  }, []);

  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [newInsight, setNewInsight] = useState('');
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView
          showCaptureOptions={showCaptureOptions}
          setShowCaptureOptions={setShowCaptureOptions}
          setCurrentView={setCurrentView}
          setCaptureMode={setCaptureMode}
          currentView={currentView}
          setLibraryDefaultViewMode={setLibraryDefaultViewMode}
          books={books}
          setBooks={setBooks}
        />;
      case 'capture':
        return <CaptureView
          captureMode={captureMode}
          setCurrentView={setCurrentView}
        />;
      case 'library':
        return <LibraryView
          insights={insights}
          individuals={individuals}
          setCurrentView={setCurrentView}
          setInsights={setInsights}
          setIndividuals={setIndividuals}
          defaultViewMode={libraryDefaultViewMode}
        />;
      case 'people':
        return <PeopleView
          insights={insights}
          individuals={individuals}
          collections={CUSTOM_COLLECTIONS}
          setCurrentView={setCurrentView}
          sharedBooks={SHARED_BOOKS}
        />;
      case 'profile':
        return <ProfileView
          insights={insights}
          individuals={individuals}
          collections={CUSTOM_COLLECTIONS}
          user={USER}
          setCurrentView={setCurrentView}
        />;
      default:
        return <HomeView />;
    }
  };

  // Determine which component to render
  const renderContent = () => {
    if (authState === 'checking') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white overflow-y-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (authState === 'new') {
      return (
        <WellSaidOnboarding
          onComplete={() => {
            localStorage.setItem('wellsaid-auth-state', 'loggedIn');
            setAuthState('loggedIn');
            setShowSplash(false); // Ensure splash is hidden
          }}
        />
      );
    }

    // For all logged in states
    return (
      <div className="relative min-h-screen overflow-y-auto">
        <main className="flex-grow">
          {renderView()}
        </main>
        <BottomNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          setShowCaptureOptions={setShowCaptureOptions}
        />
      </div>
    );
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'toast-card',
          duration: 4000,
          style: {
            padding: '0',
            background: 'transparent',
            boxShadow: 'none',
            maxWidth: 'calc(100% - 2rem)',
            width: 'auto',
          },
          success: { icon: null },
          error: { icon: null },
          loading: { icon: null },
          custom: { icon: null }
        }}
      />

      {/* Rest of your rendering logic */}
      {showSplash && authState !== 'loggedIn' ? (
        <SplashScreen
          onComplete={() => {
            const authState = localStorage.getItem('wellsaid-auth-state') || 'new';
            setAuthState(authState);
            setShowSplash(false);
          }}
        />
      ) : (
        renderContent()
      )}
    </>
  );
};

export default WellSaidApp;
