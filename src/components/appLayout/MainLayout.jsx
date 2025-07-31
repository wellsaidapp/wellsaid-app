// src/components/appLayout/MainLayout.jsx
import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

const MainLayout = ({
  children,
  currentView,
  setCurrentView,
  setShowCaptureOptions
}) => {
  // Define which views should hide the bottom nav
  const hideNavViews = [
    'capture',
    'insightBuilder',
    'quickCreate'
  ];

  // Calculate if nav should be visible
  const isNavVisible = !hideNavViews.includes(currentView);

  return (
    <div className={`relative min-h-screen overflow-y-auto ${
      !isNavVisible ? 'pb-0' : 'pb-16'
    }`}>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <BottomNav
        visible={isNavVisible}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowCaptureOptions={setShowCaptureOptions}
      />
    </div>
  );
};

export default MainLayout;
