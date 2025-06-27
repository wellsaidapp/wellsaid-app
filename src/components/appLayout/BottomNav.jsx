// Imports
import React, { useState, useEffect, useRef } from 'react';
import { Home, Edit3, Library, Users, User } from 'lucide-react';



const BottomNav = ({ currentView, setCurrentView, setShowCaptureOptions }) => {

  const handleCaptureClick = () => {
    if (currentView === 'home') {
      // If we're already on home, just show the capture options
      setShowCaptureOptions(true);
    } else {
      // If we're not on home, go to home and then show capture options
      setCurrentView('home');
      // Use a slight delay to ensure HomeView is rendered before showing modal
      setTimeout(() => setShowCaptureOptions(true), 100);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-1 bg-white border-t border-gray-100 backdrop-blur-lg bg-white/95 z-50 overflow-y-auto">
      <div className="flex">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          {
            id: 'capture',
            icon: Edit3,
            label: 'Capture',
            onClick: handleCaptureClick
          },
          { id: 'library', icon: Library, label: 'Library' },
          { id: 'people', icon: Users, label: 'People' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(item => (
          <button
            key={item.id}
            onClick={item.onClick || (() => setCurrentView(item.id))}
            className={`flex-1 p-3 flex flex-col items-center transition-colors ${
              currentView === item.id ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
