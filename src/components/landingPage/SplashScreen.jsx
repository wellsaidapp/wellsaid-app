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

// import {
//   signIn,
//   confirmSignIn,
//   fetchAuthSession
// } from '@aws-amplify/auth';
// ERROR: SplashScreen.jsx:79 signIn error: EmptySignInUsername: username is required to signIn
    // at assertValidationError (http://localhost:5173/node_modules/.vite/deps/chunk-JMU2AT7J.js?v=c71e8a31:8044:11)
    // at signInWithSRP (http://localhost:5173/node_modules/.vite/deps/chunk-JMU2AT7J.js?v=c71e8a31:10654:3)
    // at signIn (http://localhost:5173/node_modules/.vite/deps/chunk-JMU2AT7J.js?v=c71e8a31:10896:14)
    // at async handleEmailSubmit (http://localhost:5173/src/components/landingPage/SplashScreen.jsx?t=1752373144062:129:20)

// import { signIn, sendCustomChallengeAnswer, fetchAuthSession } from 'aws-amplify/auth';
// ERROR: Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/aws-amplify_auth.js?t=1752372823947&v=c71e8a31' does not provide an export named 'sendCustomChallengeAnswer' (at SplashScreen.jsx:26:3)

// import { Auth } from 'aws-amplify';
// ERROR: Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/aws-amplify.js?v=c71e8a31' does not provide an export named 'Auth' (at SplashScreen.jsx:23:10)


// ERROR: Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/aws-amplify_auth.js?t=1752373144172&v=c71e8a31' does not provide an export named 'sendCustomChallengeAnswer' (at SplashScreen.jsx:34:3)

// import {
//   signIn,
//   signOut,
//   confirmSignIn,
//   fetchAuthSession,
//   getCurrentUser,
// } from '@aws-amplify/auth';
//
// import { signIn, confirmSignIn } from '@aws-amplify/auth'; // ✅ correct for Amplify v6+
// import { Amplify } from 'aws-amplify';
// import { Auth } from '@aws-amplify/auth'; // v6+ modular import
// import amplifyconfig from '../../aws-exports';
//
// Amplify.configure({
//   ...amplifyconfig,
//   Auth: {
//     ...amplifyconfig, // preserves your pool ID and region
//     authenticationFlowType: 'CUSTOM_AUTH', // this is key!
//   }
// });

import { Amplify } from 'aws-amplify';
import {
  signIn,
  confirmSignIn,
  fetchAuthSession,
  signOut
} from '@aws-amplify/auth';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);


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
  const [userData, setUserData] = useState({});
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

  const handleEmailSubmit = async (e) => {
    console.log("User clicked");
    e.preventDefault();
    await signOut(); // clear any prior session
    const user = await signIn({
      username: email,
      options: {
        authFlowType: 'CUSTOM_WITHOUT_SRP'
      }
    });
    setUserData({ user });
    setLoginStep('pin');
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: pin
      });

      if (isSignedIn) {
        const session = await fetchAuthSession();
        console.log('Logged in!', session);
        localStorage.setItem('wellsaid-auth-state', 'loggedIn');
        onComplete();
      }
    } catch (err) {
      console.error('PIN validation error:', err);
      // Handle incorrect PIN or other errors
    }
  };

  // Helper function to generate random passwords
  const generateRandomPassword = () => {
    return Array(16).fill(0).map(() =>
      Math.random().toString(36).charAt(2)
    ).join('');
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
              <p className="text-gray-600 mt-2">We've sent a 6-digit code to {email}</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">6-digit PIN</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                    setPin(value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                  placeholder="••••••"
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
