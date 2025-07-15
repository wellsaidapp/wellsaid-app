import React, { useState, useEffect } from 'react';
import SplashAnimation from './SplashAnimation';
import LoginScreen from './LoginScreen';
import WellSaidOnboarding from './WellSaidOnboarding';
import LandingPage from './LandingPage';

const SplashScreen = ({ authState, onAuthComplete, onSkipSplash }) => {
  const [stage, setStage] = useState('animation');

  // Scenario 1: Already logged in - just show animation while UserContext loads
  useEffect(() => {
    if (authState === 'loggedIn') {
      setStage('postLoginSplash');
      const timer = setTimeout(() => {
        onSkipSplash?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authState, onSkipSplash]);

  // Scenario 2 & 3: New user flow
  useEffect(() => {
    if (authState !== 'loggedIn' && stage === 'animation') {
      const timer = setTimeout(() => setStage('landing'), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, authState]);

  // Handle all rendering cases
  if (authState === 'loggedIn') {
    return <SplashAnimation onComplete={onSkipSplash || (() => {})} />;
  }

  if (stage === 'animation') {
    return <SplashAnimation onComplete={() => setStage('landing')} />;
  }

  if (stage === 'postLoginSplash') {
    return <SplashAnimation onComplete={onSkipSplash || (() => {})} />;
  }

  if (stage === 'login') {
    return (
      <LoginScreen
        onSuccess={() => {
          // This triggers the authState change in App.jsx
          onAuthComplete(); 
        }}
        onBack={() => setStage('landing')}
      />
    );
  }

  if (stage === 'onboarding') {
    return (
      <WellSaidOnboarding
        onComplete={() => {
          setStage('animation');
          onAuthComplete();
        }}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={() => setStage('onboarding')}
      onShowLogin={() => setStage('login')}
    />
  );
};

export default SplashScreen;
