import React, { useState, useEffect } from 'react';
import SplashAnimation from './SplashAnimation';
import LoginScreen from './LoginScreen';
import WellSaidOnboarding from './WellSaidOnboarding';
import LandingPage from './LandingPage';

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState('animation'); // animation | landing | login | onboarding

  useEffect(() => {
    if (stage === 'animation') {
      const timer = setTimeout(() => {
        setStage('landing');
      }, 3000); // Match the animation length
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleLoginSuccess = () => {
    localStorage.setItem('wellsaid-auth-state', 'loggedIn');
    onComplete(); // Let parent know auth is complete
  };

  if (stage === 'animation') {
    return <SplashAnimation onComplete={() => setStage('landing')} />;
  }

  if (stage === 'login') {
    return <LoginScreen onSuccess={handleLoginSuccess} onBack={() => setStage('landing')} />;
  }

  if (stage === 'onboarding') {
    return <WellSaidOnboarding onComplete={onComplete} skipWelcome={true} />;
  }

  return (
    <LandingPage
      onGetStarted={() => setStage('onboarding')}
      onShowLogin={() => setStage('login')}
    />
  );
};

export default SplashScreen;
