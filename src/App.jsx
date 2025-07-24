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
import PullToRefresh from 'pulltorefreshjs';
import MainLayout from './components/appLayout/MainLayout';
import SelectPersonView from './components/capture/SpecialOccasion/SelectPersonView';
import CollectionSelectionView from './components/capture/SpecialOccasion/CollectionSelectionView';

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
  const { people, loadingPeople, refetchPeople } = usePeople();
  const [authState, setAuthState] = useState('checking');
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [captureMode, setCaptureMode] = useState('quick');
  const { insights, loadingInsights } = useInsights();
  const [libraryDefaultViewMode, setLibraryDefaultViewMode] = useState('collections');
  const { books, refreshBooks } = useBooks();
  const { refetchUser } = useUser();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [specialOccasionData, setSpecialOccasionData] = useState({
    person: null,
    collections: []
  });

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

  // 🚫 Disable scroll when certain views are treated as modals
  useEffect(() => {
    const modalViews = [
      'specialOccasionSelectPerson',
      'specialOccasionSelectCollections',
      'capture'
    ];

    const modalIsOpen = modalViews.includes(currentView);

    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [currentView]);

  useEffect(() => {
    const modalViews = [
      'specialOccasionSelectPerson',
      'specialOccasionSelectCollections',
      'capture'
    ];

    // Initialize PullToRefresh
    const ptr = PullToRefresh.init({
      mainElement: 'body',
      onRefresh() {
        window.location.reload();
      },
      shouldPullToRefresh() {
        return window.scrollY === 0 && !modalViews.includes(currentView);
      },
      distThreshold: 60,
      resistance: 2.5,
      iconArrow: '↓',
      iconRefreshing: '⟳',
    });

    // Cleanup function
    return () => {
      if (ptr && typeof ptr.destroy === 'function') {
        ptr.destroy();
      } else {
        // Fallback if destroy isn't available
        try {
          PullToRefresh.destroyAll();
        } catch (e) {
          console.warn('Failed to destroy PullToRefresh:', e);
        }
      }
    };
  }, [currentView]);

  useEffect(() => {
    console.log('Body scroll/touch styles:', {
      overflow: document.body.style.overflow,
      touchAction: document.body.style.touchAction
    });
  }, [currentView]);

  useEffect(() => {
    // Reset selectedPerson when leaving people view
    if (currentView !== 'people') {
      setSelectedPerson(null);
    }
  }, [currentView]);

  useEffect(() => {
    console.log('currentView changed to:', currentView);
  }, [currentView]); // Dependency array - runs whenever currentView changes

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
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
        />;
      case 'profile':
        return <ProfileView
          insights={insights}
          individuals={people}
          collections={userCollections}
          user={userData}
          setCurrentView={setCurrentView}
        />;
      case 'specialOccasionSelectPerson':
        return (
          <SelectPersonView
            individuals={people}
            onSelectPerson={(person) => {
              setSpecialOccasionData(prev => ({
                ...prev,
                person
              }));
              setCurrentView('specialOccasionSelectCollections');
            }}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'specialOccasionSelectCollections':
        return (
          <CollectionSelectionView
          selectedPerson={specialOccasionData.person}
          onCollectionsSelected={(collections) => {
            setSpecialOccasionData(prev => ({
              ...prev,
              collections
            }));
            setCurrentView('capture');
            setCaptureMode('milestone');
          }}
          onBack={() => setCurrentView('specialOccasionSelectPerson')}
        />
        );
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
        <MainLayout
          currentView={currentView}
          setCurrentView={setCurrentView}
          setShowCaptureOptions={setShowCaptureOptions}
        >
          {renderView()}
        </MainLayout>
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
          refreshBooks={refreshBooks}
        />
      ) : (
        renderContent()
      )}
    </>
  );
};

export default WellSaidApp;
