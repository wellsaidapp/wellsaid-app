// Imports
import React, { useState, useEffect } from 'react';
import {
  Send, Plus, User, BookOpen, ChevronLeft, ChevronRight, Sparkles, Book, X,
  ChevronDown, Home, Bell, Settings, Users, Wand2, Lock, CheckCircle
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useUser } from './context/UserContext';
import { usePeople } from './context/PeopleContext';
import { useUserCollections } from './context/UserCollectionsContext';
import { useInsights } from './context/InsightContext';
import { useBooks } from './context/BooksContext';

const MyComponent = () => {
  const { userCollections, loading } = useUserCollections();

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {userCollections.map((col) => (
        <li key={col.id}>{col.name}</li>
      ))}
    </ul>
  );
};

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

const WellSaidApp = () => {
  const { userData, loadingUser } = useUser();
  const { userCollections, loading } = useUserCollections();
  const { people, loadingPeople } = usePeople();
  const [authState, setAuthState] = useState('checking');
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [captureMode, setCaptureMode] = useState('quick');
  const { insights, loadingInsights } = useInsights();
  const [libraryDefaultViewMode, setLibraryDefaultViewMode] = useState('collections');
  const { books } = useBooks();
  const { refetchUser } = useUser();
  useEffect(() => {
    const storedAuthState = localStorage.getItem('wellsaid-auth-state');

    // Scenario 1: Already logged in user
    if (storedAuthState === 'loggedIn') {
      // Show splash while UserContext loads
      setAuthState('loggedIn');
      return;
    }

    // Scenario 2 & 3: New or returning user
    setAuthState(storedAuthState || 'new');

    // For new users, we'll let SplashScreen handle the flow
    if (storedAuthState !== 'loggedIn') {
      setShowSplash(true);
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
        />;
      case 'capture':
        return <CaptureView
          captureMode={captureMode}
          setCurrentView={setCurrentView}
        />;
      case 'library':
        return <LibraryView
          insights={insights}
          individuals={people}
          setCurrentView={setCurrentView}
          defaultViewMode={libraryDefaultViewMode}
          user={userData}
        />;
      case 'people':
        if (loadingPeople) return null;
        return <PeopleView
          insights={insights}
          individuals={people}
          collections={userCollections}
          setCurrentView={setCurrentView}
          sharedBooks={books}
        />;
      case 'profile':
        return <ProfileView
          insights={insights}
          individuals={people}
          collections={userCollections}
          user={userData}
          setCurrentView={setCurrentView}
        />;
      default:
        return <HomeView />;
    }
  };

  const handleAuthComplete = async () => {
    localStorage.setItem('wellsaid-auth-state', 'loggedIn');
    await refetchUser(); // ✅ Now valid
    setAuthState('loggedIn');
    setShowSplash(true); // Force splash to show again
  };

  const shouldShowSplash = () => {
    // Show splash in these cases:
    // 1. Initial app load (showSplash = true)
    // 2. After login (authState = 'loggedIn' and loadingUser)
    // 3. During user context hydration
    return showSplash || (authState === 'loggedIn' && loadingUser);
  };

  const renderContent = () => {
    if (authState === 'checking') {
      return <LoadingSpinner />;
    }

    if (authState === 'loggedIn' && !loadingUser) {
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
    }

    return null;
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

      {shouldShowSplash() ? (
        <SplashScreen
          authState={authState}
          onAuthComplete={handleAuthComplete}
          onSkipSplash={() => setShowSplash(false)}
        />
      ) : (
        renderContent()
      )}
    </>
  );
};

export default WellSaidApp;
