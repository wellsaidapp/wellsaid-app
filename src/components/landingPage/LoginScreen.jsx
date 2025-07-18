import React, { useState, useEffect } from 'react';
import { signIn, confirmSignIn, fetchAuthSession, signOut } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsconfig from '../../aws-exports';

import ToastMessage from '../library/BookCreation/ToastMessage';
import { toast } from 'react-hot-toast';
import logo from '../../assets/wellsaid.svg';

Amplify.configure(awsconfig);

const LoginScreen = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loginStep, setLoginStep] = useState('email'); // 'email' or 'pin'
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isPinSubmitting, setIsPinSubmitting] = useState(false);
  const [isResendingPin, setIsResendingPin] = useState(false);
  const [lastEmailSent, setLastEmailSent] = useState(null);
  const [pinVerificationFailed, setPinVerificationFailed] = useState(false);

  const secondsUntilResend = lastEmailSent
    ? Math.max(0, Math.ceil((30_000 - (Date.now() - lastEmailSent)) / 1000))
    : 0;

  useEffect(() => {
    if (!lastEmailSent) return;
    const interval = setInterval(() => {
      const remaining = 30_000 - (Date.now() - lastEmailSent);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastEmailSent]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes('@') || !email.includes('.')) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Invalid Email"
          message="Please enter a valid email address"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
      return;
    }

    setIsEmailSubmitting(true);
    try {
      await signOut(); // Clear any prior session
      await signIn({ username: email, options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } });

      setLoginStep('pin');
      setLastEmailSent(Date.now());

      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="Success!"
          message="PIN sent to your email"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
    } catch (error) {
      console.error('Email submit error:', error);

      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Login Failed"
          message={
            error.name === 'UserNotFoundException'
              ? 'No account found with this email address'
              : 'Failed to send PIN. Please try again.'
          }
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Invalid PIN"
          message="Please enter a 6-digit number"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
      return;
    }

    setIsPinSubmitting(true);
    try {
      const { isSignedIn } = await confirmSignIn({ challengeResponse: pin });

      if (isSignedIn) {
        await fetchAuthSession(); // Optional but confirms session is ready
        localStorage.setItem('wellsaid-auth-state', 'loggedIn'); // Set auth state
        window.dispatchEvent(new Event('authChange'));
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Success!"
            message="Login successful!"
            onDismiss={() => toast.dismiss(t.id)}
          />
        ));
        onSuccess();
      }
    } catch (err) {
      console.error('PIN validation error:', err);
      setPin('');
      setPinVerificationFailed(true);
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Invalid PIN"
          message="Please request a new PIN and try again"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
    } finally {
      setIsPinSubmitting(false);
    }
  };

  const handleResendPin = async () => {
    if (secondsUntilResend > 0) return;

    setIsResendingPin(true);
    try {
      await signOut();
      await signIn({ username: email, options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } });
      setLastEmailSent(Date.now());
      setPinVerificationFailed(false);
      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="PIN Sent"
          message="New PIN sent to your email"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
    } catch (err) {
      console.error('Resend PIN error:', err);
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Error"
          message="Failed to resend PIN. Please try again."
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
    } finally {
      setIsResendingPin(false);
    }
  };

  const WellSaidLogo = () => (
    <img src={logo} alt="WellSaid" className="h-10 w-auto mb-4 mx-auto" />
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <WellSaidLogo />

        {loginStep === 'email' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-6">Sign in to continue your journey</p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mt-1"
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
                disabled={isEmailSubmitting}
              >
                {isEmailSubmitting ? 'Processing...' : 'Continue'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={onBack} className="text-blue-600 text-sm font-medium">
                Back to welcome
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Enter PIN</h2>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                6-digit PIN
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest mt-1"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </label>

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium transition-colors ${
                  isPinSubmitting || pinVerificationFailed ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-600'
                }`}
                disabled={isPinSubmitting || pinVerificationFailed}
              >
                {isPinSubmitting ? 'Verifying...' : 'Verify PIN'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <button
                onClick={() => {
                  setLoginStep('email');
                  setPin('');
                  setPinVerificationFailed(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Back to email entry
              </button>

              <div>
                <button
                  onClick={handleResendPin}
                  disabled={secondsUntilResend > 0 || isResendingPin}
                  className={`text-sm text-blue-600 hover:text-blue-700 ${
                    secondsUntilResend > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isResendingPin ? 'Sending...' : 'Resend PIN'}
                </button>
                {secondsUntilResend > 0 && (
                  <span className="text-xs text-gray-500 ml-2">(Available in {secondsUntilResend}s)</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
