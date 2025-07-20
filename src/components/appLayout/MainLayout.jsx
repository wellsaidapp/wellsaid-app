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
  return (
    <div className="relative min-h-screen overflow-y-auto">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowCaptureOptions={setShowCaptureOptions}
      />
    </div>
  );
};

export default MainLayout;
