// Imports
import React, { useState, useEffect } from 'react';
import {
  Send, Plus, User, BookOpen, ChevronLeft, ChevronRight,
  ChevronDown, Home, Bell, Settings, Users, Wand2, Lock
} from 'lucide-react';

// Components actually used
import SplashScreen from './components/landingPage/SplashScreen';
import Header from './components/appLayout/Header';
import BottomNav from './components/appLayout/BottomNav';
import HomeView from './components/home/HomeView';
import CaptureView from './components/capture/CaptureView';
import LibraryView from './components/library/LibraryView';
import ProfileView from './components/profileView/ProfileView';
import PeopleView from './components/peopleView/PeopleView';

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

  // Simulate checking auth status - in a real app this would check Cognito
  useEffect(() => {
    // For demo purposes, we'll use localStorage to simulate auth states
    const simulatedAuthState = localStorage.getItem('wellsaid-auth-state') || 'new';
    setAuthState(simulatedAuthState);
  }, []);

  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [newInsight, setNewInsight] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView
          showCaptureOptions={showCaptureOptions}
          setShowCaptureOptions={setShowCaptureOptions}
          setCurrentView={setCurrentView}
          setCaptureMode={setCaptureMode}
          currentView={currentView}
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
    if (showSplash) {
      return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }
    switch (authState) {
      case 'checking':
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-white overflow-y-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      case 'new':
        return (
          <WellSaidOnboarding
            onComplete={() => {
              localStorage.setItem('wellsaid-auth-state', 'loggedIn');
              setShowSplash(false);
            }}
          />
        );
      case 'returning':
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            </div>
          </div>
        );
      case 'loggedIn':
      default:
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
  };
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }
  return renderContent();
};

export default WellSaidApp;
