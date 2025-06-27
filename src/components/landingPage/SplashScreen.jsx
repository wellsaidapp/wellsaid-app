// Imports
import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';

import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox, Trash2, Save, GripVertical, Bookmark, CheckCircle,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download, ImageIcon,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';

// Assets
import logo from '../../assets/wellsaid.svg';
import animationData from '../../assets/animations/TypeBounce.json';

import LandingPage from './LandingPage';
import WellSaidOnboarding from './WellSaidOnboarding';

const SplashScreen = ({ onComplete }) => {
  const animationRef = useRef();
  const [showLanding, setShowLanding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  // Remove password state since we're not using it anymore
  const [pin, setPin] = useState(''); // New state for PIN
  const [loginStep, setLoginStep] = useState('email'); // 'email' or 'pin'

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const WellSaidLogo = () => (
    <img
      src={logo}
      alt="WellSaid"
      className="h-10 w-auto"
    />
  );

  const handleDevLogin = (e) => {
    e.preventDefault(); // Prevent form reload
    localStorage.setItem('wellsaid-auth-state', 'loggedIn');
    onComplete();
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend to generate/send the PIN
    setLoginStep('pin');
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    // Here you would validate the PIN with your backend
    handleDevLogin(e); // Or your actual login logic
  };

  if (showLogin) {
    if (loginStep === 'pin') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-2">
                <WellSaidLogo />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">Enter your PIN</h2>
              <p className="text-gray-600 mt-2">We've sent a 4-digit code to {email}</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">4-digit PIN</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                    setPin(value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                  placeholder="••••"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
              >
                Verify PIN
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setLoginStep('email')}
                className="text-blue-600 text-sm font-medium"
              >
                Back to email entry
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default email entry step
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <WellSaidLogo />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
            >
              Continue
            </button>
          </form>

          <button
            onClick={() => setShowLogin(false)}
            className="w-full text-blue-600 text-sm font-medium mt-4"
          >
            Back to welcome
          </button>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <WellSaidOnboarding onComplete={onComplete} skipWelcome={true} />;
  }

  if (showLanding) {
    return (
      <LandingPage
        onGetStarted={() => setShowOnboarding(true)}
        onShowLogin={() => setShowLogin(true)}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50 overflow-y-auto">
      {/* Developer bypass button */}
      <button
        onClick={handleDevLogin}
        className="absolute bottom-4 right-4 p-2 bg-gray-800/60 text-white rounded-full z-50"
        title="Developer Login Bypass"
      >
        <KeyRound className="w-5 h-5" />
      </button>

      <div className="w-full max-w-[90vw] aspect-[16/9]">
        <Lottie
          lottieRef={animationRef}
          animationData={animationData}
          loop={false}
          autoplay={true}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet'
          }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
