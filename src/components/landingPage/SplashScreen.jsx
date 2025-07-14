// Imports
import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { toast } from 'react-hot-toast';
import ToastMessage from '../library/BookCreation/ToastMessage'; // Update this path to match your project structure

import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox, Trash2, Save, GripVertical, Bookmark, CheckCircle,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download, ImageIcon,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';

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
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isPinSubmitting, setIsPinSubmitting] = useState(false);
  const [isResendingPin, setIsResendingPin] = useState(false);
  const [lastEmailSent, setLastEmailSent] = useState(null);
  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  const canResendPin = !lastEmailSent || Date.now() - lastEmailSent > 30000;
  const [pinVerificationFailed, setPinVerificationFailed] = useState(false);
  useEffect(() => {
    if (!lastEmailSent) return;

    const remainingTime = 30000 - (Date.now() - lastEmailSent);
    if (remainingTime <= 0) {
      setSecondsUntilResend(0);
      return;
    }

    setSecondsUntilResend(Math.ceil(remainingTime / 1000));

    const interval = setInterval(() => {
      setSecondsUntilResend(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastEmailSent]);

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
    e.preventDefault();

    // Basic validation
    if (!email.includes('@') || !email.includes('.')) {
      toast.custom(
        (t) => (
          <ToastMessage
            type="error"
            title="Invalid Email"
            message="Please enter a valid email address"
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        { duration: 4000 }
      );
      return;
    }

    setIsEmailSubmitting(true);
    try {
      await signOut(); // Clear any prior session
      const user = await signIn({
        username: email,
        options: { authFlowType: 'CUSTOM_WITHOUT_SRP' }
      });
      setUserData({ user });
      setLoginStep('pin');
      setLastEmailSent(Date.now());
      toast.success("PIN sent to your email");
    } catch (error) {
      console.error('Email submission error:', error);
      const message = error.name === 'UserNotFoundException'
        ? "No account found with this email address"
        : "Failed to send PIN. Please try again.";

      toast.custom(
        (t) => (
          <ToastMessage
            type="error"
            title="Login Failed"
            message={message}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        { duration: 4000 }
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      toast.custom(
        (t) => (
          <ToastMessage
            type="error"
            title="Invalid PIN"
            message="Please enter a 6-digit number"
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        { duration: 4000 }
      );
      return;
    }

    setIsPinSubmitting(true);
    try {
      const { isSignedIn } = await confirmSignIn({
        challengeResponse: pin
      });

      if (isSignedIn) {
        const session = await fetchAuthSession();
        localStorage.setItem('wellsaid-auth-state', 'loggedIn');
        toast.success("Login successful!");
        onComplete();
      }
    } catch (err) {
      console.error('PIN validation error:', err);
      setPin(''); // Clear the PIN field
      setPinVerificationFailed(true); // Mark verification as failed

      // Immediately allow resend on failure
      setSecondsUntilResend(0);

      toast.custom(
        (t) => (
          <ToastMessage
            type="error"
            title="Invalid PIN"
            message="Please request a new PIN and try again"
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        { duration: 4000 }
      );
    } finally {
      setIsPinSubmitting(false);
    }
  };

  // Updated handleResendPin function
  const handleResendPin = async () => {
    if (secondsUntilResend > 0) {
      toast.error(`Please wait ${secondsUntilResend} seconds before requesting a new PIN`);
      return;
    }

    setIsResendingPin(true);
    try {
      await signOut();
      await signIn({
        username: email,
        options: { authFlowType: 'CUSTOM_WITHOUT_SRP' }
      });
      setLastEmailSent(Date.now());
      setSecondsUntilResend(30); // Reset to 30 seconds
      setPinVerificationFailed(false); // Reset failed state
      toast.custom(
        (t) => (
          <ToastMessage
            type="success"
            title="PIN Sent"
            message="New PIN sent to your email"
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        { duration: 4000 }
      );
    } catch (error) {
      console.error('Resend PIN error:', error);
      toast.custom(
        (t) => (
          <ToastMessage
            type="error"
            title="Error"
            message="Failed to resend PIN. Please try again."
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        { duration: 4000 }
      );
    } finally {
      setIsResendingPin(false);
    }
  };

  // Update the back to email button handler
  const handleBackToEmail = () => {
    setLoginStep('email');
    setPin('');
    setPinVerificationFailed(false);
  };

  if (showLogin) {
    if (loginStep === 'pin') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            {/* ... keep existing header ... */}

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  6-digit PIN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPin(value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                    placeholder="••••••"
                    autoComplete="one-time-code"
                    autoFocus
                    required
                    disabled={isPinSubmitting} // Disable input after submission
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isPinSubmitting || pinVerificationFailed ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-600'
                }`}
                disabled={isPinSubmitting || pinVerificationFailed}
              >
                {isPinSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify PIN'
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3 text-center">
                <button
                  onClick={handleBackToEmail}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                >
                  Back to email entry
                </button>

                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={handleResendPin}
                    disabled={secondsUntilResend > 0 || isResendingPin}
                    className={`text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors ${
                      secondsUntilResend > 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isResendingPin ? 'Sending...' : 'Resend PIN'}
                  </button>
                  {secondsUntilResend > 0 && (
                    <span className="text-xs text-gray-500">
                      (Available in {secondsUntilResend}s)
                    </span>
                  )}
                </div>
              </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
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
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center justify-center"
              disabled={isEmailSubmitting}
            >
              {isEmailSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowLogin(false)}
              className="text-blue-600 text-sm font-medium"
            >
              Back to welcome
            </button>
          </div>
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
