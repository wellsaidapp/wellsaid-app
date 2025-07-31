// Imports
import React, { useState, useEffect, useRef } from 'react';
import { User, ArrowRight, Mail, Mic, MicOff, Plus, Check, Send } from 'lucide-react';
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  fetchAuthSession,
  confirmSignIn,
  signIn
} from '@aws-amplify/auth';

// Assets
import logo from '../../assets/wellsaid.svg';
import WellSaidIconOnboarding from '../../assets/icons/WellSaidIconOnboarding';
// Components
import Typewriter from './utils/Typewriter.jsx';

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

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newDigits = pastedData.split('').slice(0, 6);
      setDigits(newDigits);
      handleSubmit(newDigits.join(''));
    }
  };

  // Handle digit change
  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError(null);

    // Auto-focus next if a digit was entered
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit if last digit entered
    if (index === 5 && value) {
      handleSubmit(newDigits.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Submit handler
  const handleSubmit = async (fullCode = digits.join('')) => {
    if (fullCode.length !== 6) return;

    setIsSubmitting(true);
    try {
      // First try to confirm the sign up
      await confirmSignUp({
        username: email,
        confirmationCode: fullCode
      });

      // Then authenticate (using the temp password we generated earlier)
      // await signIn({
      //   username: email,
      //   password: password
      // });

      // Success flow
      setIsVerifyingPin(false);
      onSuccess();
      // Continue with your onboarding flow...

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

  // Resend code handler
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
  // Start directly with registration
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
  // const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [currentPersonInput, setCurrentPersonInput] = useState('');
  const [currentPerson, setCurrentPerson] = useState(null);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const messagesEndRef = useRef(null);
  const [showChatInput, setShowChatInput] = useState(true);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    else if (currentStep === 'people') {
      if (currentPersonQuestions) {
        return `What questions for ${currentPerson?.name || 'them'}?`;
      }
      return "Describe them to me";
    }
    return "Type your response...";
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const hasGreeted = useRef(false);

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
          resolve(); // ✅ Resolve after message is added
        }, 1500); // Simulated typing time
      }, delay); // Initial delay before typing starts
    });
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
        // Always try to sign up first (will work for new users)
        const tempPassword = generateTempPassword();

        await signUp({
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
        }));

      } catch (err) {
        // If user exists, that's fine - we'll just resend the code
        if (err.name !== 'UsernameExistsException') {
          console.error('Error during sign up:', err);
          typeMessage("Oops, something went wrong. Please try again.", true, 0);
          return;
        }
        // No need to show error for existing users
      }

      // For both new and existing users, send verification code
      try {
        await resendSignUpCode({ username: value });
        typeMessage("A verification code has been sent to your email. Please enter it below:", true, 500);
        setShowPinInput(true);
      } catch (resendError) {
        console.error('Error resending code:', resendError);
        typeMessage("Failed to send verification code. Please try again.", true, 0);
      }
    }
  };

  const generateTempPassword = () => {
    return `TempPass${Math.floor(100000 + Math.random() * 900000)}!`;
  };

  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // const handlePinChange = (index, value) => {
  //   if (value.length <= 1 && /^\d*$/.test(value)) {
  //     const newPin = [...pinDigits];
  //     newPin[index] = value;
  //     setPinDigits(newPin);
  //
  //     if (value && index < 5) {
  //       document.getElementById(`pin-${index + 1}`)?.focus();
  //     }
  //
  //     if (newPin.every(digit => digit !== '')) {
  //       const fullPin = newPin.join('');
  //       setUserData(prev => ({ ...prev, pin: fullPin }));
  //       setIsVerifyingPin(true);
  //       setShowPinInput(false);
  //
  //       const runSequence = async () => {
  //         const username = userData.email;
  //         const confirmationCode = fullPin;
  //         const password = userData.password;
  //
  //         console.log('Attempting confirmSignUp with:', {
  //           username,
  //           password,
  //           confirmationCode,
  //           userData: {
  //             ...userData,
  //             pin: '***' // Don’t log full pin
  //           }
  //         });
  //
  //         try {
  //           await typeMessage("Verifying your code...", true, 0);
  //
  //           const confirmResult = await confirmSignUp({
  //             username,
  //             confirmationCode
  //           });
  //           console.log('✅ confirmSignUp successful! Result:', confirmResult);
  //
  //           const signInResult = await signIn({ username, password });
  //           console.log("📨 signIn() completed:", signInResult);
  //
  //           // ⏳ Wait for session to hydrate
  //           let sessionReady = false;
  //           for (let i = 0; i < 10; i++) {
  //             try {
  //               const session = await fetchAuthSession();
  //               const idToken = session.tokens?.idToken?.toString();
  //
  //               console.log(
  //                 `🔍 Session check ${i + 1}:`,
  //                 idToken ? '✅ ID token present' : '❌ No ID token yet'
  //               );
  //
  //               if (idToken) {
  //                 sessionReady = true;
  //                 break;
  //               }
  //             } catch (err) {
  //               console.warn(`⚠️ Error during session fetch on attempt ${i + 1}:`, err);
  //             }
  //
  //             await new Promise(res => setTimeout(res, 250));
  //           }
  //
  //           if (!sessionReady) {
  //             console.error("❌ Session was not ready after retries");
  //           } else {
  //             console.log("🎉 Session is ready — continuing to onboarding completion");
  //           }
  //
  //           await typeMessage("✓ Verified successfully!", true, 0);
  //           setIsVerifyingPin(false);
  //
  //           await new Promise(res => setTimeout(res, 1500));
  //           setMessages([]);
  //           setCurrentStep('conversation');
  //
  //           await new Promise(res => setTimeout(res, 300));
  //           await typeMessage("Great! Now let's get to work...", true, 0);
  //         } catch (err) {
  //           console.error('❌ Verification failed:', {
  //             errorName: err.name,
  //             errorMessage: err.message,
  //             errorStack: err.stack,
  //             errorDetails: err,
  //             inputValues: {
  //               username,
  //               confirmationCode
  //             }
  //           });
  //
  //           await typeMessage("The code was invalid. Please double-check and try again.", true, 0);
  //           setIsVerifyingPin(false);
  //           setShowPinInput(true);
  //         }
  //       };
  //
  //       runSequence();
  //     }
  //   }
  // };

  const handleConversationSubmit = () => {
    if (!currentInput.trim()) return;

    if (currentStep === 'people') {
      if (currentPersonQuestions) {
        handlePersonQuestionSubmit();
      } else {
        handlePersonSubmit();
      }
      return;
    }

    // Original conversation flow
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
        typeMessage("Would you like to add someone to your circle now?...", true, 1500);
      }, 2000);
      setCurrentStep('people');
      setShowChatInput(false); // Hide input initially
    }
  };

  // Enhanced person parser
  const parsePerson = (input) => {
    const person = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      age: '',
      interests: '',
      questionPreferences: ''
    };

    // Basic parsing logic - you can enhance this
    const lowerInput = input.toLowerCase();

    // Extract relationship
    if (lowerInput.includes('daughter')) person.relationship = 'daughter';
    else if (lowerInput.includes('son')) person.relationship = 'son';
    else if (lowerInput.includes('wife')) person.relationship = 'wife';
    else if (lowerInput.includes('husband')) person.relationship = 'husband';
    else if (lowerInput.includes('mother')) person.relationship = 'mother';
    else if (lowerInput.includes('father')) person.relationship = 'father';
    else if (lowerInput.includes('friend')) person.relationship = 'friend';
    else person.relationship = 'family member';

    // Extract name
    const nameMatch = input.match(/(?:my\s+(?:daughter|son|wife|husband|mother|father|friend)?\s*)([A-Za-z]+)/i);
    if (nameMatch) person.name = nameMatch[1];

    // Extract age
    const ageMatch = input.match(/age\s+(\d+)|(\d+)\s+years?\s+old/i);
    if (ageMatch) person.age = ageMatch[1] || ageMatch[2];

    // Extract interests
    const interestsMatch = input.match(/loves?\s+([^,]+)/i);
    if (interestsMatch) person.interests = interestsMatch[1];

    return person;
  };

  // You'll also need to add this state variable to track current person questions
  const [currentPersonQuestions, setCurrentPersonQuestions] = useState(null);

  // Modified handleConversationSubmit to handle the people step questions
  const modifiedHandleConversationSubmit = () => {
    if (!currentInput.trim()) return;

    // If we're in people step and collecting question preferences
    if (currentStep === 'people' && currentPersonQuestions) {
      handlePersonQuestionSubmit();
      return;
    }

    // If we're in people step but not collecting questions, treat as person input
    if (currentStep === 'people' && !currentPersonQuestions) {
      // This would be handled by handlePersonSubmit instead
      return;
    }

    // Original conversation flow
    const input = currentInput.trim();
    setMessages(prev => [...prev, { text: input, isBot: false, timestamp: Date.now() }]);
    setCurrentInput('');

    if (!userData.motivation) {
      setUserData(prev => ({ ...prev, motivation: input }));
      typeMessage("Thanks for sharing! Let's talk about the topics you want to cover. Can you spend a few moments telling me about the types of questions or topics you'd like to answer, or use your input to guide our future interactions within the app? Questions and topics can evolve over time, but this will give us a starting point. What kinds of insight would you like to capture?", true, 1000);
    } else if (!userData.topics) {
      setUserData(prev => ({ ...prev, topics: input }));
      typeMessage("Great! Now how can I help you stay on track? How would you like to use this app? Is it something you'd like to use daily or weekly or something you plan to use when preparing for a special occasion? Would you like me to push notifications to you so you stay committed to your plan? How can I help you make use of this app?", true, 1000);
    } else if (!userData.helpStyle) {
      setUserData(prev => ({ ...prev, helpStyle: input }));
      typeMessage("We're on the last step! Your insight is meant to be shared with the people you care most about. WellSaid gives you the opportunity to say what matters to the people who matter. You can add people now using the interface below.", true, 1000);
      setTimeout(() => {
        typeMessage("Can you tell me about the person you would like to add?", true, 1500);
      }, 2000);
      setCurrentStep('people');
      setShowPersonForm(true);
    }
  };

  // Enhanced person submission handler
  const handlePersonSubmit = () => {
    if (!currentInput.trim()) return;

    const personInput = currentInput.trim();
    setMessages(prev => [...prev, { text: personInput, isBot: false, timestamp: Date.now() }]);
    setCurrentInput('');

    // Parse the person input
    const person = parsePerson(personInput);

    // Store the person temporarily (don't add to userData yet)
    setCurrentPerson(person);

    // Ask about question preferences
    typeMessage(`Thanks! What kinds of questions would you like to answer for ${person.name || 'them'}?`, true, 500);

    // Set flag to collect question preferences
    setCurrentPersonQuestions(true);
  };

  // New handler for person question preferences
  const handlePersonQuestionSubmit = () => {
    if (!currentInput.trim()) return;

    const questionInput = currentInput.trim();
    setMessages(prev => [...prev, { text: questionInput, isBot: false, timestamp: Date.now() }]);
    setCurrentInput('');

    // Create the complete person object
    const completePerson = {
      ...currentPerson,
      questionPreferences: questionInput
    };

    // Show confirmation message
    const confirmationMessage = `Got it! I'll add ${completePerson.name || 'this person'}, your ${completePerson.relationship}${
      completePerson.age ? ` (age ${completePerson.age})` : ''
    }${
      completePerson.interests ? ` who loves ${completePerson.interests}` : ''
    }. They'll receive insights about: ${questionInput}.`;

    typeMessage(confirmationMessage, true, 500);
    setShowChatInput(false);
    setTimeout(() => {
      typeMessage("Would you like to add another person?", true, 1000);
    }, 1500);

    // Add the person to userData
    setUserData(prev => ({
      ...prev,
      people: [...prev.people, completePerson]
    }));

    // Reset the current person state
    setCurrentPerson(null);
    setCurrentPersonQuestions(false);
  };

  const extractName = (text) => {
    const nameMatch = text.match(/(?:my |named |called )([A-Za-z]+)/i);
    return nameMatch ? nameMatch[1] : '';
  };

  const extractRelationship = (text) => {
    const relationships = ['daughter', 'son', 'wife', 'husband', 'mother', 'father', 'friend', 'partner', 'spouse'];
    const found = relationships.find(rel => text.toLowerCase().includes(rel));
    return found || 'person';
  };

  const extractAge = (text) => {
    const ageMatch = text.match(/(\d+)\s*(?:years?\s*old|yr)/i);
    return ageMatch ? parseInt(ageMatch[1]) : null;
  };

  const extractTopics = (text) => {
    const topics = [];
    if (text.includes('school') || text.includes('education')) topics.push('education');
    if (text.includes('career') || text.includes('work')) topics.push('career');
    if (text.includes('health') || text.includes('wellness')) topics.push('health');
    return topics;
  };

  // Modify the completeOnboarding function
  const completeOnboarding = () => {
    // Clear the messages and set loading state
    setMessages([]);
    setIsTyping(true);
    setCurrentStep("summary");
    // After a brief delay, start typing the summary
    setTimeout(() => {
      setIsTyping(false);

      let summary = `You're ${userData.name}, and you're here because ${userData.motivation.toLowerCase()}. `;
      summary += `You're interested in ${userData.topics.toLowerCase()}, and you'd like me to ${userData.helpStyle.toLowerCase()}. `;

      if (userData.people.length > 0) {
        summary += `You want to share insights with ${userData.people.length} special ${userData.people.length === 1 ? 'person' : 'people'} in your life. `;
      }

      summary += "I'm excited to help you on this journey!";

      // Type the summary message
      typeMessage(summary, true, 0);

      // After the summary is displayed, show the welcome card
      setTimeout(() => {
        setIsShowingSummary(true);
      }, 2000 + summary.length * 30); // Adjust timing based on typewriter speed
    }, 500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you'd implement actual voice recording here
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setCurrentInput("This would be transcribed speech...");
      }, 2000);
    }
  };
  // ... (keep all your existing helper functions like handlePinChange, handleConversationSubmit, etc.)

  // const handlePaste = (e) => {
  //   e.preventDefault();
  //   const pasted = e.clipboardData.getData('text').trim();
  //
  //   if (/^\d{6}$/.test(pasted)) {
  //     const newDigits = pasted.split('');
  //     setPinDigits(newDigits);
  //
  //     // Optionally save to userData
  //     const fullPin = newDigits.join('');
  //     setUserData((prev) => ({ ...prev, pin: fullPin }));
  //
  //     // Trigger your PIN verification flow
  //     runSequence(); // Or verifyCode(fullPin), if that's what you're using
  //   }
  // };

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
                          // Update message to mark typing as complete
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

        {/* Enhanced PIN Verification */}
        {showPinInput && currentStep === 'registration' && (
          <PinVerification
            email={userData.email}
            typeMessage={typeMessage}
            setIsVerifyingPin={setIsVerifyingPin}
            onSuccess={async () => {
              await typeMessage("✓ Verified successfully!", true, 0);
              setIsVerifyingPin(false);

              // Your existing success flow:
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
                throw err; // Let PinVerification handle the error display
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

        {/* Conversation Input - Always show when in conversation or people steps */}
        {(currentStep === 'conversation' || (currentStep === 'people' && showChatInput)) && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleConversationSubmit();
                    }
                  }}
                />
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
        {currentStep === 'people' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">People in your circle</h3>
              <span className="text-sm text-gray-500">{userData.people.length} added</span>
            </div>

            {userData.people.length > 0 ? (
              userData.people.map((person, index) => (
                <div key={person.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
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
                onClick={() => {
                  setShowChatInput(true); // Show input
                  setCurrentInput('');
                  typeMessage("Great! Please tell me about the person. Their name, their age, your relationship to them...anything that will be useful for me to know as I build their profile.", true, 500);
                  setCurrentPersonQuestions(false);
                }}
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
                // Set authentication state
                localStorage.setItem('wellsaid-auth-state', 'loggedIn');
                // Store user data if needed
                localStorage.setItem('wellsaid-user-data', JSON.stringify(userData));
                // Call the completion handler
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
