// Imports
import React, { useState, useEffect, useRef } from 'react';
import { User, ArrowRight, Mail, Mic, MicOff, Plus, Check, Send, X, Sparkles } from 'lucide-react';
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  fetchAuthSession,
  confirmSignIn,
  signIn
} from '@aws-amplify/auth';
import { toast } from 'react-hot-toast';
import ToastMessage from '../library/BookCreation/ToastMessage';
import Typewriter from './utils/Typewriter.jsx';
import AddPersonFlow from '../peopleView/subcomponents/AddPersonFlow.jsx'; // Import the new AddPersonFlow component
import { useUser } from '../../context/UserContext';
import { usePeople } from '../../context/PeopleContext';

// Assets
import logo from '../../assets/wellsaid.svg';
import WellSaidIconOnboarding from '../../assets/icons/WellSaidIconOnboarding';

const RelationshipModal = ({ name, onSelect, onClose }) => {
  const relationships = [
    'Daughter',
    'Son',
    'Relative',
    'Student',
    'Camper',
    'Friend',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Who is {name} to you?
        </h2>
        <p className="text-gray-500 text-center mb-6">Choose the closest option</p>

        <div className="space-y-3">
          {relationships.map((relationship) => (
            <button
              key={relationship}
              onClick={() => onSelect(relationship)}
              className="w-full p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{relationship}</span>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const OnboardingAddPersonFlow = ({ onComplete, onCancel }) => {
  const { userData } = useUser();
  const { refetchPeople } = usePeople();
  const [conversationState, setConversationState] = useState('ask_name');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [newPerson, setNewPerson] = useState({ name: '', relationship: '', context: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typeMessage = (message, isBot = true, options = {}) => {
    const { delay = 0, typeSpeed = 10 } = options; // default to 10ms per character

    return new Promise((resolve) => {
      setTimeout(() => {
        // Avoid duplicate messages
        const messageExists = messages.some(
          (msg) => msg.text === message && msg.isBot === isBot
        );

        if (!messageExists) {
          setIsTyping(true);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                text: message,
                isBot,
                timestamp: Date.now(),
              },
            ]);
            setIsTyping(false);
          }, Math.min(1000, message.length * typeSpeed));
        }

        resolve();
      }, delay);
    });
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      typeMessage("Let's add someone important to you.", true, 500);
      typeMessage("What's their name?", true, 1500);
    }
  }, []);

  const savePerson = async (personData) => {
    try {
      setIsSubmitting(true);
      await typeMessage("Saving...", true, 0);

      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("Missing ID token");

      const response = await fetch('https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken
        },
        body: JSON.stringify({
          name: personData.name,
          relationship: personData.relationship,
          context: personData.context
        })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const newPerson = await response.json();

      await typeMessage(`All set! ${personData.name} has been added.`, true, 0);
      await new Promise(resolve => setTimeout(resolve, 1200));
      await refetchPeople();

      // Return the saved person data
      return newPerson;

    } catch (err) {
      console.error('❌ Error adding person:', err);
      await typeMessage("Something went wrong. Please try again later.", true);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = inputValue.trim();
    if (!value) return;

    setMessages(prev => [...prev, { text: value, isBot: false, timestamp: Date.now() }]);
    setInputValue('');

    if (conversationState === 'ask_name') {
      setNewPerson(prev => ({ ...prev, name: value }));
      setShowRelationshipModal(true);
      await typeMessage(`Got it. What's your relationship with ${value}?`, true, { typeSpeed: 3 });
    } else if (conversationState === 'ask_relationship') {
      setNewPerson(prev => ({ ...prev, relationship: value }));
      await typeMessage(`Thanks. Anything else you'd like us to know about ${newPerson.name}?`, true, 500);
      setConversationState('ask_context');
    } else if (conversationState === 'ask_context') {
      setNewPerson(prev => ({ ...prev, context: value }));
      setConversationState('saving');

      // Save the person to backend first
      const savedPerson = await savePerson({
        ...newPerson,
        context: value
      });

      // Only proceed if save was successful
      if (savedPerson) {
        onComplete(savedPerson);
      } else {
        // If save failed, reset to ask_name state
        setConversationState('ask_name');
      }
    }
  };

  const handleRelationshipSelect = async (relationship) => {
    setShowRelationshipModal(false);
    setMessages(prev => [...prev, { text: relationship, isBot: false, timestamp: Date.now() }]);

    if (relationship === 'Other') {
      setConversationState('ask_relationship');
      await typeMessage(`How would you describe who ${newPerson.name} is to you?`, true, 500);
    } else {
      setNewPerson(prev => ({ ...prev, relationship }));
      await typeMessage(`Thanks. Anything else you'd like us to know about ${newPerson.name}?`, true, 500);
      setConversationState('ask_context');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-40 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-3">
            <WellSaidIconOnboarding size={50} />
            <div>
              <img src={logo} alt="WellSaid" className="h-7 w-25" />
              <p className="text-sm text-gray-500">Add a Person</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                  msg.isBot ? 'bg-gray-100 text-gray-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                }`}>
                  {msg.isBot ? (
                    <Typewriter text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-4"
        >
          <div className="flex gap-2 items-end">
            {conversationState === 'ask_name' ? (
              <>
                <div className="flex-1 relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter their name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSubmitting}
                  className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    conversationState === 'ask_relationship'
                      ? `What's your relationship with ${newPerson.name}?`
                      : "Anything else we should know?"
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSubmitting}
                  className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </form>

        {/* Relationship modal */}
        {showRelationshipModal && (
          <RelationshipModal
            name={newPerson.name}
            onSelect={handleRelationshipSelect}
            onClose={() => setShowRelationshipModal(false)}
          />
        )}
      </div>
    </div>
  );
};

const NameInputStep = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onSubmit('name', trimmedValue);
      setInputValue('');
    }
  };

  return (
    <>
      <div className="flex-1 relative">
        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your name"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </>
  );
};

const EmailInputStep = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onSubmit('email', trimmedValue);
      setInputValue('');
    }
  };

  return (
    <>
      <div className="flex-1 relative">
        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          inputMode="email"
          autoComplete="email"
          placeholder="your@email.com"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </>
  );
};

const PinVerification = ({
  email,
  password,
  cognitoUsername,
  onSuccess,
  onResend,
  initialErrorMessage,
  typeMessage,
  setIsVerifyingPin
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(initialErrorMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef([]);

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newDigits = pastedData.split('').slice(0, 6);
      setDigits(newDigits);
      handleSubmit(newDigits.join(''));
    }
  };

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError(null);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      handleSubmit(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (fullCode = digits.join('')) => {
    if (fullCode.length !== 6) return;

    setIsSubmitting(true);
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: fullCode
      });

      const signInResult = await signIn({
        username: cognitoUsername,
        password
      });

      let sessionReady = false;
      for (let i = 0; i < 5; i++) {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          sessionReady = true;
          break;
        }
        await new Promise(res => setTimeout(res, 250));
      }

      if (!sessionReady) throw new Error('Session not ready');
      setIsVerifyingPin(false);
      onSuccess();
    } catch (err) {
      console.error('Verification failed:', err);

      if (err.name === 'CodeMismatchException') {
        setError('Invalid code. Please try again or request a new code.');
      } else if (err.name === 'ExpiredCodeException') {
        setError('Code expired. A new one has been sent.');
        await handleResend();
      } else {
        setError('Verification failed. Please try again.');
      }

      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setError('A new code has been sent to your email.');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
      {error && (
        <div className={`mb-4 p-3 rounded-lg ${
          error.includes('new code') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
        }`}>
          {error}
        </div>
      )}

      <p className="text-center text-gray-600 mb-4">Enter your 6-digit code:</p>

      <div className="flex justify-center gap-2 mb-6">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="tel"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onPaste={handlePaste}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            maxLength={1}
            disabled={isSubmitting}
          />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
        >
          {isResending ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

const WellSaidOnboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState('registration');
  const [isShowingSummary, setIsShowingSummary] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    pin: '',
    motivation: '',
    topics: '',
    helpStyle: '',
    people: []
  });
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showChatInput, setShowChatInput] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const messagesEndRef = useRef(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const hasGreeted = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasGreeted.current && messages.length === 0) {
      hasGreeted.current = true;
      typeMessage("Hi there! I'm your AI assistant and I'm here to help you get familiar with the app. What's your name?", true, 500);
    }
  }, []);

  const typeMessage = (message, isBot = true, delay = 1000) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: message,
            isBot,
            timestamp: Date.now(),
            isTyping: false
          }]);
          setIsTyping(false);
          resolve();
        }, 1500);
      }, delay);
    });
  };

  const saveOnboardingContext = async (summary) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        console.error('No authentication token available');
        return null;
      }

      const response = await fetch(
        'https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/users/onboarding',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({
            contextText: summary,
            event: 'onboarding' // Explicitly set event type
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
          errorData.message ||
          `Request failed with status ${response.status}`
        );
      }

      console.log("SAVE ONBOARDING CONTEXT:", response.json);
      return await response.json();
    } catch (err) {
      console.error('Error saving onboarding context:', err.message || err);
      return null;
    }
  };

  const generateTempPassword = () => {
    return `TempPass${Math.floor(100000 + Math.random() * 900000)}!`;
  };

  const handleRegistrationSubmit = async (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));

    if (field === 'name') {
      setMessages(prev => [...prev, { text: value, isBot: false, timestamp: Date.now() }]);
      typeMessage(`Nice to meet you, ${value}! What's your email address?`, true, 500);
    }
    else if (field === 'email') {
      setMessages(prev => [...prev, { text: value, isBot: false, timestamp: Date.now() }]);

      try {
        const tempPassword = generateTempPassword();

        const signUpResult = await signUp({
          username: value,
          password: tempPassword,
          options: {
            userAttributes: {
              email: value,
              name: userData.name,
            },
          },
        });

        setUserData(prev => ({
          ...prev,
          email: value,
          password: tempPassword,
          cognitoUsername: signUpResult.userId
        }));

        typeMessage("A verification code has been sent to your email. Please enter it below:", true, 500);
        setShowPinInput(true);

      } catch (err) {
        if (err.name === 'UsernameExistsException') {
          try {
            await resendSignUpCode({ username: value });
            typeMessage("A verification code has been sent to your email. Please enter it below:", true, 500);
            setShowPinInput(true);
          } catch (resendError) {
            if (
              resendError.name === 'InvalidParameterException' &&
              resendError.message.includes('already confirmed')
            ) {
              console.warn('User is already confirmed, redirecting to login.');

              toast.custom((t) => (
                <ToastMessage
                  type="cancel"
                  title="Already Registered"
                  message="We found your account! Redirecting you to login..."
                  onDismiss={() => toast.dismiss(t.id)}
                />
              ));

              setTimeout(() => {
                window.dispatchEvent(new Event('forceShowLogin'));
              }, 2000);

              return;
            }

            console.error('Error resending code:', resendError);
            typeMessage("Failed to send verification code. Please try again.", true, 0);
          }
        } else {
          console.error('Error during sign up:', err);
          typeMessage("Oops, something went wrong. Please try again.", true, 0);
        }
      }
    }
  };

  // New function to generate AI summary
  const generateAISummary = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        console.error('No authentication token available');
        return null;
      }

      // Validate we have required data
      if (!userData?.name || !userData?.motivation || !userData?.topics || !userData?.helpStyle) {
        console.error('Missing required user data for summary generation');
        return null;
      }

      const response = await fetch(
        'https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/ai/onboardingContext',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({
            name: userData.name,
            motivation: userData.motivation,
            topics: userData.topics,
            helpStyle: userData.helpStyle,
            people: userData.people || [] // Ensure people is always an array
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
          errorData.message ||
          `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log("AI ONBOARDING CONTEXT:", data);

      if (!data?.summary) {
        throw new Error('Received empty summary from server');
      }

      return data.summary;
    } catch (err) {
      console.error('Error generating AI summary:', err.message || err);
      // You might want to add error handling/show toast notification here
      return null;
    }
  };

  const handleConversationSubmit = async () => {
    if (!currentInput.trim()) return;

    const input = currentInput.trim();
    setMessages(prev => [...prev, { text: input, isBot: false, timestamp: Date.now() }]);
    setCurrentInput('');

    if (!userData.motivation) {
      setUserData(prev => ({ ...prev, motivation: input }));
      typeMessage("Thanks for sharing! Let's talk about the topics you want to cover...", true, 1000);
    } else if (!userData.topics) {
      setUserData(prev => ({ ...prev, topics: input }));
      typeMessage("Great! Now how can I help you stay on track?...", true, 1000);
    } else if (!userData.helpStyle) {
      setUserData(prev => ({ ...prev, helpStyle: input }));
      typeMessage("We're on the last step! Your insight is meant to be shared...", true, 1000);
      setTimeout(() => {
        typeMessage("Would you like to add someone to your circle now?", true, 1500);
      }, 2000);
      setCurrentStep('people');
      setShowChatInput(false); // Hide input initially
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setCurrentInput("This would be transcribed speech...");
      }, 2000);
    }
  };

  const handleAddPersonClick = () => {
    setShowPersonForm(true);
  };

  const handleAddPersonComplete = (newPerson) => {
    setUserData(prev => ({
      ...prev,
      people: [...prev.people, newPerson]
    }));
    setShowPersonForm(false);
    typeMessage(`${newPerson.name} has been added to your circle. Would you like to add another person?`, true, 500);
  };

  const handleAddPersonCancel = () => {
    setShowPersonForm(false);
    hasInitialized.current = false; // Reset initialization
    typeMessage("Would you like to complete your profile now?", true, 500);
  };

  const completeOnboarding = async () => {
    setMessages([]);
    setIsTyping(true);
    setCurrentStep("summary");
    setIsGeneratingSummary(true);

    let aiSummary = null;
    try {
      aiSummary = await generateAISummary();
      if (!aiSummary) {
        console.warn("⚠️ AI summary generation returned null or empty string.");
      } else {
        console.log("✅ AI summary generated successfully.");
      }
    } catch (err) {
      console.error("❌ Error calling generateAISummary:", err);
    }

    setIsGeneratingSummary(false);

    // Fallback summary if AI failed
    const summary = aiSummary || `You're ${userData.name}, and you're here because ${userData.motivation.toLowerCase()}.
      You're interested in ${userData.topics.toLowerCase()}, and you'd like me to ${userData.helpStyle.toLowerCase()}.
      ${userData.people.length > 0 ? `You want to share insights with ${userData.people.length} special ${userData.people.length === 1 ? 'person' : 'people'} in your life. ` : ''}
      I'm excited to help you on this journey!`;

    try {
      const result = await saveOnboardingContext(summary);
      if (!result) {
        console.warn("⚠️ saveOnboardingContext returned no result object.");
      } else {
        console.log("✅ Onboarding context saved successfully.");
      }
    } catch (err) {
      console.error("❌ Failed to save onboarding context:", err);
    }

    await typeMessage(summary, true, { typeSpeed: 5 });
    setIsShowingSummary(true);
  };

  const getPlaceholderText = () => {
    if (currentStep === 'registration') {
      if (!userData.name) return "Enter your name";
      if (!userData.email) return "Enter your email";
    }
    else if (currentStep === 'conversation') {
      if (!userData.motivation) return "What brings you to this app?";
      if (!userData.topics) return "What topics do you want to cover?";
      if (!userData.helpStyle) return "How can I help you stay on track?";
    }
    return "Type your response...";
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-4">
          <div>
            <WellSaidIconOnboarding size={50} />
          </div>
          <div>
            <img src={logo} alt="WellSaid" className="h-7 w-25" />
            <p className="text-sm text-gray-500">AI Assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isBot
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                }`}>
                  {message.isBot && message.isTyping ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  ) : (
                    message.isBot ? (
                      <Typewriter
                        text={message.text}
                        onComplete={() => {
                          setMessages(prev => prev.map((msg, i) =>
                            i === index ? {...msg, isTyping: false} : msg
                          ));
                        }}
                      />
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* PIN Verification */}
        {showPinInput && currentStep === 'registration' && (
          <PinVerification
            email={userData.email}
            password={userData.password}
            cognitoUsername={userData.cognitoUsername}
            typeMessage={typeMessage}
            setIsVerifyingPin={setIsVerifyingPin}
            onSuccess={async () => {
              await typeMessage("✓ Verified successfully!", true, 0);
              setIsVerifyingPin(false);
              await new Promise(res => setTimeout(res, 1500));
              setMessages([]);
              setCurrentStep('conversation');
              await new Promise(res => setTimeout(res, 300));
              await typeMessage("Great! Now let's get to work...", true, 0);
            }}
            onResend={async () => {
              try {
                await resendSignUpCode({ username: userData.email });
              } catch (err) {
                console.error('Resend failed:', err);
                throw err;
              }
            }}
            initialErrorMessage={isVerifyingPin ? 'Verifying...' : null}
          />
        )}

        {/* Registration Input */}
        {currentStep === 'registration' && !showPinInput && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex gap-2">
              {!userData.name ? (
                <NameInputStep onSubmit={handleRegistrationSubmit} />
              ) : !userData.email ? (
                <EmailInputStep onSubmit={handleRegistrationSubmit} />
              ) : null}
            </div>
          </div>
        )}

        {/* Conversation Input */}
        {(currentStep === 'conversation' || (currentStep === 'people' && showChatInput)) && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleConversationSubmit();
                    }
                  }}
                />
                {isRecording && (
                  <div className="absolute right-10 bottom-3 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-xs text-red-500">Recording</span>
                  </div>
                )}
              </div>
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-xl transition-colors ${
                  isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={handleConversationSubmit}
                disabled={!currentInput.trim()}
                className={`p-3 rounded-xl transition-colors ${
                  currentInput.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* People Management */}
        {currentStep === 'people' && showPersonForm && (
          <OnboardingAddPersonFlow
            onComplete={handleAddPersonComplete}
            onCancel={handleAddPersonCancel}
          />
        )}

        {currentStep === 'people' && !showPersonForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">People in your circle</h3>
              <span className="text-sm text-gray-500">{userData.people.length} added</span>
            </div>

            {userData.people.length > 0 ? (
              userData.people.map((person, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {person.name || `Person ${index + 1}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {person.relationship} {person.age && `• ${person.age} years old`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No people added yet
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddPersonClick}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {userData.people.length > 0 ? "Add Another" : "Add Person"}
              </button>
              <button
                onClick={completeOnboarding}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        {currentStep === 'summary' && isShowingSummary && (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to WellSaid!</h2>
            <p className="text-gray-600 mb-6">
              Your profile is set up and ready to go. Let's start capturing your insights!
            </p>
            <button
              onClick={() => {
                localStorage.setItem('wellsaid-auth-state', 'loggedIn');
                localStorage.setItem('wellsaid-user-data', JSON.stringify(userData));
                onComplete();
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-8 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
            >
              Start Using WellSaid
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellSaidOnboarding;
