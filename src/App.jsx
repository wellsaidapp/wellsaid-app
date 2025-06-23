import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';
import logo from './assets/wellsaid.svg';
import Lottie from 'lottie-react';
import animationData from './assets/animations/TypeBounce.json';
import { motion } from 'framer-motion';

const LandingPage = ({ onGetStarted, onShowLogin }) => {
  const [messages, setMessages] = useState([
    { id: 1, show: false, text: '', typing: false, complete: false, bold: true },
    { id: 2, show: false, text: '', typing: false, complete: false },
    { id: 3, show: false, text: '', typing: false, complete: false }
  ]);
  const [showButton, setShowButton] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const cancelAnimationRef = useRef(false);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const WellSaidIconLanding = ({ size = 24 }) => (
    <div
      className="rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 831.63 816.56"
        className="w-full h-full"
      >
        <defs>
          <style>{`.cls-1{fill:#4c89fe}.cls-2{fill:#fff}`}</style>
        </defs>
        <path className="cls-1" d="M406.54,84.52c-175.35,0-317.5,142.15-317.5,317.5s142.15,317.5,317.5,317.5h264.86c29.07,0,52.63-23.56,52.63-52.63v-264.86c0-175.35-142.15-317.5-317.5-317.5Z"/>
        <path className="cls-2" d="M245.15,458.27c-2.1,0-3.93-.52-5.48-1.58-1.55-1.05-2.77-2.72-3.67-5.02l-22.05-58.35c-.8-2-1.05-3.77-.75-5.33.3-1.55,1.07-2.77,2.33-3.67,1.25-.9,2.87-1.35,4.88-1.35,1.8,0,3.27.43,4.42,1.27,1.15.85,2.12,2.48,2.93,4.88l19.65,55.35h-3.6l20.4-55.95c.7-1.9,1.65-3.3,2.85-4.2,1.2-.9,2.75-1.35,4.65-1.35s3.47.45,4.73,1.35c1.25.9,2.17,2.3,2.77,4.2l19.95,55.95h-3.3l19.95-55.65c.8-2.3,1.82-3.85,3.08-4.65,1.25-.8,2.67-1.2,4.27-1.2,2,0,3.52.5,4.57,1.5,1.05,1,1.65,2.28,1.8,3.83.15,1.55-.13,3.22-.83,5.02l-22.05,58.35c-.9,2.2-2.13,3.85-3.68,4.95-1.55,1.1-3.33,1.65-5.32,1.65-2.1,0-3.93-.55-5.48-1.65-1.55-1.1-2.77-2.75-3.67-4.95l-21-56.85h7.5l-20.85,56.85c-.8,2.2-1.98,3.85-3.52,4.95-1.55,1.1-3.38,1.65-5.48,1.65Z"/>
        <path className="cls-2" d="M400.53,458.57c-8,0-14.88-1.52-20.62-4.57-5.75-3.05-10.2-7.4-13.35-13.05-3.15-5.65-4.73-12.38-4.73-20.17s1.55-14.25,4.65-19.95c3.1-5.7,7.35-10.15,12.75-13.35,5.4-3.2,11.55-4.8,18.45-4.8,5.1,0,9.65.82,13.65,2.47,4,1.65,7.43,4.05,10.28,7.2,2.85,3.15,5,6.97,6.45,11.47,1.45,4.5,2.18,9.55,2.18,15.15,0,1.7-.5,2.98-1.5,3.83-1,.85-2.5,1.27-4.5,1.27h-50.4v-9.3h46.2l-2.55,2.1c0-5-.73-9.25-2.18-12.75-1.45-3.5-3.6-6.17-6.45-8.02-2.85-1.85-6.38-2.78-10.58-2.78-4.7,0-8.68,1.1-11.92,3.3-3.25,2.2-5.73,5.25-7.43,9.15-1.7,3.9-2.55,8.45-2.55,13.65v.9c0,8.8,2.07,15.43,6.23,19.88,4.15,4.45,10.17,6.68,18.07,6.68,3,0,6.17-.4,9.52-1.2,3.35-.8,6.53-2.15,9.53-4.05,1.7-1,3.22-1.45,4.57-1.35,1.35.1,2.45.55,3.3,1.35.85.8,1.37,1.8,1.57,3,.2,1.2,0,2.43-.6,3.67-.6,1.25-1.65,2.38-3.15,3.38-3.4,2.3-7.35,4.03-11.85,5.17s-8.85,1.72-13.05,1.72Z"/>
        <path className="cls-2" d="M501.32,458.57c-7.8,0-13.68-2.27-17.62-6.82-3.95-4.55-5.93-11.12-5.93-19.73v-73.95c0-2.5.65-4.4,1.95-5.7,1.3-1.3,3.15-1.95,5.55-1.95s4.28.65,5.62,1.95c1.35,1.3,2.03,3.2,2.03,5.7v73.05c0,5,1.02,8.73,3.08,11.18,2.05,2.45,5.02,3.67,8.92,3.67.9,0,1.7-.02,2.4-.08.7-.05,1.4-.12,2.1-.22,1.2-.1,2.05.22,2.55.97.5.75.75,2.28.75,4.58,0,2.1-.45,3.73-1.35,4.88-.9,1.15-2.35,1.88-4.35,2.17-.9.1-1.85.17-2.85.23-1,.05-1.95.07-2.85.07Z"/>
        <path className="cls-2" d="M583.01,458.57c-7.8,0-13.68-2.27-17.62-6.82-3.95-4.55-5.92-11.12-5.92-19.73v-73.95c0-2.5.65-4.4,1.95-5.7s3.15-1.95,5.55-1.95,4.27.65,5.62,1.95c1.35,1.3,2.02,3.2,2.02,5.7v73.05c0,5,1.02,8.73,3.08,11.17,2.05,2.45,5.03,3.67,8.92,3.67.9,0,1.7-.02,2.4-.08.7-.05,1.4-.12,2.1-.22,1.2-.1,2.05.22,2.55.97.5.75.75,2.28.75,4.58,0,2.1-.45,3.73-1.35,4.88s-2.35,1.88-4.35,2.17c-.9.1-1.85.17-2.85.23-1,.05-1.95.07-2.85.07Z"/>
      </svg>
    </div>
  );

  // Clean typewriter effect without stuttering
  const typewriter = async (messageIndex, text, speed = 50) => {
    return new Promise((resolve) => {
      let currentText = '';
      let i = 0;

      const type = () => {
        if (i < text.length) {
          currentText += text.charAt(i);
          setMessages(prev => prev.map((msg, idx) =>
            idx === messageIndex ? { ...msg, text: currentText } : msg
          ));
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  };

  // Animation sequence
  useEffect(() => {
    const startAnimation = async () => {
      setShowLogo(true);
      await delay(1000);
      if (cancelAnimationRef.current) return;

      setMessages(prev => prev.map((msg, idx) =>
        idx === 0 ? { ...msg, show: true } : msg
      ));
      await typewriter(0, 'Say what matters, to those that matter.', 10);
      if (cancelAnimationRef.current) return;

      await delay(400);

      setMessages(prev => prev.map((msg, idx) =>
        idx === 1 ? { ...msg, show: true } : msg
      ));
      await typewriter(1, 'Share the lessons, perspectives, and values that have shaped you—so they can shape others.', 10);
      if (cancelAnimationRef.current) return;

      await delay(400);

      setMessages(prev => prev.map((msg, idx) =>
        idx === 2 ? { ...msg, show: true } : msg
      ));
      await typewriter(2, 'One thoughtful prompt at a time, you\'re creating a living archive of insight and connection.', 10);
      if (cancelAnimationRef.current) return;

      await delay(800);
      if (cancelAnimationRef.current) return;

      setShowButton(true);
    };

    startAnimation();
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo - using your actual WellSaid logo */}
        <div className={`mb-4 transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center">
            <WellSaidIconLanding size={100} /> {/* Use your actual logo component */}
            <div className="ml-3">
              <img src={logo} alt="WellSaid" className="h-12" /> {/* Use your actual logo image */}
              <p className="text-sm text-gray-500">AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="w-full bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`transition-all duration-500 ease-out ${
                  message.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                {message.text && (
                  <div className={`text-lg leading-relaxed ${message.bold ? 'font-bold' : 'font-medium'}`}>
                    {message.text}
                    {!message.complete && (
                      <span className="border-r-2 border-blue-500 animate-pulse" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl py-5 px-6 text-lg font-semibold shadow-lg transition-all duration-300 ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          } hover:scale-105 hover:shadow-xl active:scale-95`}
        >
          Begin Your Journey <ArrowRight className="inline ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
        {showButton && (
          <button
            onClick={() => {
              cancelAnimationRef.current = true;
              onShowLogin();
            }}
            className="w-full text-blue-600 text-sm font-medium mt-2"
          >
            Already have an account? Log in
          </button>
        )}
      </div>
    </div>
  );
};

const Typewriter = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete && !hasCompleted) {
      setHasCompleted(true);
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, hasCompleted]);

  return <span>{displayedText}</span>;
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
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
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

  const handleRegistrationSubmit = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));

    if (field === 'name') {
      setMessages(prev => [...prev, { text: value, isBot: false, timestamp: Date.now() }]);
      typeMessage(`Nice to meet you, ${value}! What's your email address?`, true, 500);
    } else if (field === 'email') {
      setMessages(prev => [...prev, { text: value, isBot: false, timestamp: Date.now() }]);
      typeMessage("Perfect! I've sent you a 4-digit code. Please enter it below:", true, 500);
      setShowPinInput(true);
    }
  };


  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const handlePinChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pinDigits];
      newPin[index] = value;
      setPinDigits(newPin);

      if (value && index < 3) {
        document.getElementById(`pin-${index + 1}`)?.focus();
      }

      if (newPin.every(digit => digit !== '')) {
        const fullPin = newPin.join('');
        setUserData(prev => ({ ...prev, pin: fullPin }));
        setIsVerifyingPin(true);
        setShowPinInput(false);

        const runSequence = async () => {
          // Step 1: show verifying message
          await typeMessage("Verifying your code...", true, 0);

          // Step 2: show success
          await new Promise(res => setTimeout(res, 1000));
          await typeMessage("✓ Verified successfully!", true, 0);

          // Step 3: pause and clear before new step
          setIsVerifyingPin(false);
          await new Promise(res => setTimeout(res, 1500));
          setMessages([]);
          setCurrentStep('conversation');

          // Step 4: continue onboarding
          await new Promise(res => setTimeout(res, 300));
          await typeMessage(
            "Great! Now let's get to work. Over the next few minutes, I'd like to hear more about you and how you would like to use this app. This will help me help you! You can speak or type your answers using the area below. What brings you to this app?",
            true,
            0
          );
        };

        runSequence(); // Start the async onboarding sequence
      }
    }
  };

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

  const WellSaidIconOnboard = ({ size = 24 }) => (
    <div
      className="rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 831.63 816.56"
        className="w-full h-full"
      >
        <defs>
          <style>{`.cls-1{fill:#4c89fe}.cls-2{fill:#fff}`}</style>
        </defs>
        <path className="cls-1" d="M406.54,84.52c-175.35,0-317.5,142.15-317.5,317.5s142.15,317.5,317.5,317.5h264.86c29.07,0,52.63-23.56,52.63-52.63v-264.86c0-175.35-142.15-317.5-317.5-317.5Z"/>
        <path className="cls-2" d="M245.15,458.27c-2.1,0-3.93-.52-5.48-1.58-1.55-1.05-2.77-2.72-3.67-5.02l-22.05-58.35c-.8-2-1.05-3.77-.75-5.33.3-1.55,1.07-2.77,2.33-3.67,1.25-.9,2.87-1.35,4.88-1.35,1.8,0,3.27.43,4.42,1.27,1.15.85,2.12,2.48,2.93,4.88l19.65,55.35h-3.6l20.4-55.95c.7-1.9,1.65-3.3,2.85-4.2,1.2-.9,2.75-1.35,4.65-1.35s3.47.45,4.73,1.35c1.25.9,2.17,2.3,2.77,4.2l19.95,55.95h-3.3l19.95-55.65c.8-2.3,1.82-3.85,3.08-4.65,1.25-.8,2.67-1.2,4.27-1.2,2,0,3.52.5,4.57,1.5,1.05,1,1.65,2.28,1.8,3.83.15,1.55-.13,3.22-.83,5.02l-22.05,58.35c-.9,2.2-2.13,3.85-3.68,4.95-1.55,1.1-3.33,1.65-5.32,1.65-2.1,0-3.93-.55-5.48-1.65-1.55-1.1-2.77-2.75-3.67-4.95l-21-56.85h7.5l-20.85,56.85c-.8,2.2-1.98,3.85-3.52,4.95-1.55,1.1-3.38,1.65-5.48,1.65Z"/>
        <path className="cls-2" d="M400.53,458.57c-8,0-14.88-1.52-20.62-4.57-5.75-3.05-10.2-7.4-13.35-13.05-3.15-5.65-4.73-12.38-4.73-20.17s1.55-14.25,4.65-19.95c3.1-5.7,7.35-10.15,12.75-13.35,5.4-3.2,11.55-4.8,18.45-4.8,5.1,0,9.65.82,13.65,2.47,4,1.65,7.43,4.05,10.28,7.2,2.85,3.15,5,6.97,6.45,11.47,1.45,4.5,2.18,9.55,2.18,15.15,0,1.7-.5,2.98-1.5,3.83-1,.85-2.5,1.27-4.5,1.27h-50.4v-9.3h46.2l-2.55,2.1c0-5-.73-9.25-2.18-12.75-1.45-3.5-3.6-6.17-6.45-8.02-2.85-1.85-6.38-2.78-10.58-2.78-4.7,0-8.68,1.1-11.92,3.3-3.25,2.2-5.73,5.25-7.43,9.15-1.7,3.9-2.55,8.45-2.55,13.65v.9c0,8.8,2.07,15.43,6.23,19.88,4.15,4.45,10.17,6.68,18.07,6.68,3,0,6.17-.4,9.52-1.2,3.35-.8,6.53-2.15,9.53-4.05,1.7-1,3.22-1.45,4.57-1.35,1.35.1,2.45.55,3.3,1.35.85.8,1.37,1.8,1.57,3,.2,1.2,0,2.43-.6,3.67-.6,1.25-1.65,2.38-3.15,3.38-3.4,2.3-7.35,4.03-11.85,5.17s-8.85,1.72-13.05,1.72Z"/>
        <path className="cls-2" d="M501.32,458.57c-7.8,0-13.68-2.27-17.62-6.82-3.95-4.55-5.93-11.12-5.93-19.73v-73.95c0-2.5.65-4.4,1.95-5.7,1.3-1.3,3.15-1.95,5.55-1.95s4.28.65,5.62,1.95c1.35,1.3,2.03,3.2,2.03,5.7v73.05c0,5,1.02,8.73,3.08,11.18,2.05,2.45,5.02,3.67,8.92,3.67.9,0,1.7-.02,2.4-.08.7-.05,1.4-.12,2.1-.22,1.2-.1,2.05.22,2.55.97.5.75.75,2.28.75,4.58,0,2.1-.45,3.73-1.35,4.88-.9,1.15-2.35,1.88-4.35,2.17-.9.1-1.85.17-2.85.23-1,.05-1.95.07-2.85.07Z"/>
        <path className="cls-2" d="M583.01,458.57c-7.8,0-13.68-2.27-17.62-6.82-3.95-4.55-5.92-11.12-5.92-19.73v-73.95c0-2.5.65-4.4,1.95-5.7s3.15-1.95,5.55-1.95,4.27.65,5.62,1.95c1.35,1.3,2.02,3.2,2.02,5.7v73.05c0,5,1.02,8.73,3.08,11.17,2.05,2.45,5.03,3.67,8.92,3.67.9,0,1.7-.02,2.4-.08.7-.05,1.4-.12,2.1-.22,1.2-.1,2.05.22,2.55.97.5.75.75,2.28.75,4.58,0,2.1-.45,3.73-1.35,4.88s-2.35,1.88-4.35,2.17c-.9.1-1.85.17-2.85.23-1,.05-1.95.07-2.85.07Z"/>
      </svg>
    </div>
  );

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

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-4">
          <div>
            <WellSaidIconOnboard size={50} />
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

        {/* PIN Input */}
        {showPinInput && currentStep === 'registration' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <p className="text-center text-gray-600 mb-4">Enter your 4-digit code:</p>
            <div className="flex justify-center gap-2">
              {pinDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  maxLength={1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Registration Input */}
        {currentStep === 'registration' && !showPinInput && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex gap-2">
              {!userData.name ? (
                <>
                  <div className="flex-1 relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleRegistrationSubmit('name', e.target.value.trim());
                          e.target.value = ''; // Clear the input after submission
                        }
                      }}
                      ref={(input) => {
                        // Auto-focus the name input when it appears
                        if (input && !userData.name) input.focus();
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      if (input.value.trim()) {
                        handleRegistrationSubmit('name', input.value.trim());
                        input.value = ''; // Clear the input after submission
                      }
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : !userData.email ? (
                <>
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email" // Proper email type for better mobile keyboards and validation
                      inputMode="email" // Additional hint for mobile devices
                      autoComplete="email" // Helps with autofill
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleRegistrationSubmit('email', e.target.value.trim());
                        }
                      }}
                      ref={(input) => {
                        // Auto-focus the email input when it appears
                        if (input && userData.name && !userData.email) input.focus();
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      if (input.value.trim()) {
                        handleRegistrationSubmit('email', input.value.trim());
                      }
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
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
              onClick={onComplete}
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

// ... (keep all your existing components like LandingPage, OnboardingFlow, etc.)

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
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
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
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
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
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50 overflow-hidden">
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


const QuickCaptureFlow = ({ onClose }) => {
  const questions = [
    "What's one lesson you learned this week?",
    "What made you feel grateful today?",
    "What would you tell your younger self?"
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-blue-50 rounded-xl p-6 mb-4 min-h-[120px] flex items-center justify-center">
          <p className="text-lg font-medium">{questions[currentQuestionIndex]}</p>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestionIndex(i)}
              className={`w-2 h-2 rounded-full ${i === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <textarea
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={4}
        placeholder="Type your thoughts here..."
      />

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // Handle submission
            onClose();
          }}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const MilestoneFlow = ({ onClose }) => {
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const occasions = [
    { type: 'Birthday', icon: <Cake size={18} /> },
    { type: 'Wedding', icon: <Orbit size={18} /> },
    { type: 'Graduation', icon: <GraduationCap size={18} /> },
    { type: 'Holiday', icon: <Gift size={18} /> }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {occasions.map((occasion) => (
          <button
            key={occasion.type}
            onClick={() => setSelectedOccasion(occasion.type)}
            className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
              selectedOccasion === occasion.type
                ? 'border-indigo-500 bg-indigo-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-indigo-500">{occasion.icon}</span>
            <span>{occasion.type}</span>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Or enter custom occasion"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        value={selectedOccasion?.startsWith('Custom:') ? selectedOccasion.substring(8) : ''}
        onChange={(e) => setSelectedOccasion(`Custom: ${e.target.value}`)}
      />

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // Handle milestone creation
            onClose();
          }}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600"
          disabled={!selectedOccasion}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const WellSaidApp = () => {
  const [authState, setAuthState] = useState('checking'); // 'checking', 'new', 'returning', 'loggedIn'
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simulate checking auth status - in a real app this would check Cognito
  useEffect(() => {
    // For demo purposes, we'll use localStorage to simulate auth states
    const simulatedAuthState = localStorage.getItem('wellsaid-auth-state') || 'new';
    setAuthState(simulatedAuthState);
  }, []);

  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [user, setUser] = useState({
    name: 'Brad Blanchard',
    topics: ['Finances', 'Relationships', 'Career', 'Health', 'Education', 'Family Values'],
    dailyGoal: 2,
    streak: 12
  });
  const [showCapture, setShowCapture] = useState(false);
  const [captureMode, setCaptureMode] = useState('quick');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [individuals, setIndividuals] = useState([
    { id: 1, name: 'Sage', age: 15, relationship: 'Daughter', avatar: 'S', gender: 'female', color: 'bg-blue-500' },
    { id: 2, name: 'Cohen', age: 16, relationship: 'Son', avatar: 'C', gender: 'male', color: 'bg-blue-500' },
    { id: 3, name: 'Truett', age: 12, relationship: 'Son', avatar: 'T', gender: 'male', color: 'bg-blue-500' }
  ]);
  const [insights, setInsights] = useState([
    // Entry for Sage's Summer Intensive
    {
      id: 1,
      question: "What are you most excited about for your summer intensive?",
      text: "I'm really looking forward to learning new techniques from professional dancers and pushing myself beyond my current limits.",
      date: '2025-06-01',
      collections: ['sage-summer-intensive', 'fitness-sports', 'personal-growth'],
      topics: ["Dance", "Growth"],
      recipients: [1] // Assuming ID 1 is Sage
    },

    // Entry for Cohen's Birthday
    {
      id: 2,
      question: "What would make your 17th birthday truly special?",
      text: "I'd love a small gathering with close friends, maybe some video games and pizza. No big party this year.",
      date: '2025-11-15',
      collections: ['cohens-birthday', 'personal-growth', 'family'],
      topics: ["Celebration", "Family"],
      recipients: [2] // Assuming ID 2 is Cohen
    },

    // Unorganized entries (voice note and draft examples)
    {
      id: 3,
      question: "Any concerns about being away for the summer intensive?",
      content: "[Voice note about being nervous but excited]",
      collections: ['sage-summer-intensive', 'fitness-sports', 'personal-growth'],
      date: '2025-05-28',
      isVoiceNote: true,
      topics: ["Dance", "Nerves"]
    },
    {
      id: 4,
      question: "Birthday gift ideas for Cohen?",
      text: "",
      date: '2025-11-10',
      collections: ['family'],
      isDraft: true,
      topics: ["Gifts"]
    }
  ]);
  const resetForm = () => {
    setNewInsight('');
    setSelectedRecipients([]);
    setSelectedTopics([]);
  };
  // Sample data for occasions and questions
  const occasions = [
    { id: 'wedding', name: 'Wedding', icon: '💒', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'first-child', name: 'First Child', icon: '👶', color: 'bg-gradient-to-br from-blue-400 to-teal-400' },
    { id: 'graduation', name: 'Graduation', icon: '🎓', color: 'bg-gradient-to-br from-indigo-500 to-blue-500' },
    { id: 'milestone-birthday', name: 'Milestone Birthday', icon: '🎂', color: 'bg-gradient-to-br from-amber-500 to-pink-500' },
  ];
  const occasionQuestions = {
    wedding: [
      "What's the most important lesson about love you've learned?",
      "What advice would you give about building a strong partnership?",
      "What moment made you realize they were 'the one'?"
    ],
    'first-child': [
      "What hopes do you have for your child's future?",
      "What value is most important to pass down?",
      "How has becoming a parent changed your perspective?"
    ],
    graduation: [
      "What's the most valuable lesson from this chapter?",
      "How have you grown during this time?",
      "What advice would you give to someone starting this journey?"
    ],
    'milestone-birthday': [
      "What hopes do you have for your child's future?",
      "What value is most important to pass down?",
      "How has becoming a parent changed your perspective?"
    ]
  };
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [questionSet, setQuestionSet] = useState([]);
  const [newInsight, setNewInsight] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const resetCaptureForm = () => {
    setNewInsight('');
    setSelectedRecipients([]);
    setSelectedTopics([]);
  };

  const [availableTopics] = useState([
    'Finances', 'Relationships', 'Marriage', 'School', 'Friends', 'Work', 'Career',
    'Health', 'Family Values', 'Personal Growth', 'Resilience', 'Education',
    'Life Skills', 'Character', 'Faith', 'Traditions', 'Dreams', 'Challenges'
  ]);
  // Add this to your component's state or props
  const [collections, setCollections] = useState([
    {
      id: 'sage-summer-intensive',
      name: "Sage's Summer Intensive",
      color: 'bg-purple-500',
      type: 'occasion',
      recipient: 'Sage',
      created: '2025-05-01'
    },
    {
      id: 'cohens-birthday',
      name: "Cohen's 17th Birthday",
      color: 'bg-blue-500',
      type: 'occasion',
      recipient: 'Cohen',
      created: '2025-10-01'
    }
  ]);
  const [prompts] = useState([
    "What's the most important lesson you've learned recently?",
    "What's something your children should know about handling failure?",
    "What do you wish someone had told you at their age?",
    "What's a family tradition you want to continue?",
    "What's your best advice about friendship?"
  ]);
  const upcomingEvents = [
    {
      id: 1,
      name: "Sage's Summer Intensive",
      type: "trip", // Explicit type
      date: '2025-06-15',
      daysAway: 27
    },
    {
      id: 2,
      name: "Cohen's 17th Birthday", // Will be matched via name
      date: '2025-11-20',
      daysAway: 103
    }
  ];

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView
          showCaptureOptions={showCaptureOptions}
          setShowCaptureOptions={setShowCaptureOptions}
          setCurrentView={setCurrentView}
          setCaptureMode={setCaptureMode}
        />;
      case 'capture':
        return <CaptureView
          captureMode={captureMode}
          setCurrentView={setCurrentView}
          resetForm={resetForm}
        />;
      case 'library':
        return <OrganizeView />;
      case 'people':
        return <LibraryView resetForm={resetForm} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  // Determine which component to render
  const renderContent = () => {
    if (showSplash) {
      return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    switch (authState) {
      case 'checking':
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );

      case 'new':
        return (
          <WellSaidOnboarding
            onComplete={() => {
              localStorage.setItem('wellsaid-auth-state', 'loggedIn');
              setShowSplash(false);
            }}
          />
        );

      case 'returning':
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
              {/* Login form content */}
            </div>
          </div>
        );

      case 'loggedIn':
      default:
        return (
          <div className="relative">
            {renderView()}
            <BottomNav
              currentView={currentView}
              setCurrentView={setCurrentView}
              setShowCaptureOptions={setShowCaptureOptions}
            />
          </div>
        );
    }
  };

  const BookPreviewModal = ({ book, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const flipPage = (direction) => {
      if (isFlipping) return;
      setIsFlipping(true);

      if (direction === 'next' && currentPage < book.pages.length - 1) {
        setTimeout(() => setCurrentPage(currentPage + 1), 150);
      } else if (direction === 'prev' && currentPage > 0) {
        setTimeout(() => setCurrentPage(currentPage - 1), 150);
      }

      setTimeout(() => setIsFlipping(false), 300);
    };

    if (!book) return null;

    const currentPageData = book.pages[currentPage];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">

          {/* Header - Blue themed */}
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${book.color || 'bg-blue-500'} rounded-lg flex items-center justify-center shadow-lg`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800 tracking-wide">
                    {book.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">
                    For {book.recipient}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Book Content - Blue themed */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8 relative overflow-hidden">

            <div className="relative w-full max-w-md">
              <div className={`relative bg-white rounded-lg shadow-xl border border-blue-200 transition-all duration-300 ${isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>

                <div className="p-8 aspect-square flex flex-col">

                  {currentPageData.type === 'question' ? (
                    <>
                      <div className="mb-6">
                        <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                            Question
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute -top-4 -left-4 text-6xl text-blue-100">"</div>
                          <p className="text-lg text-blue-800 text-center leading-relaxed italic px-4">
                            {currentPageData.content}
                          </p>
                          <div className="absolute -bottom-4 -right-4 text-6xl text-blue-100 rotate-180">"</div>
                        </div>
                      </div>

                      <div className="flex justify-center mt-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                            Your Insight
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <p className="text-blue-800 leading-relaxed">
                          {currentPageData.content.text}
                        </p>

                        <div className="space-y-3">
                          {currentPageData.content.points.map((point, idx) => (
                            <div key={idx} className="flex items-start space-x-3 group">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                              <span className="text-blue-700 leading-relaxed flex-1">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-center mt-6">
                        <Heart className="w-4 h-4 text-blue-400 fill-blue-400" />
                      </div>
                    </>
                  )}

                  <div className="absolute bottom-4 right-6">
                    <span className="text-xs text-blue-300 font-medium">
                      {currentPageData.pageNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {currentPage > 0 && (
              <button
                onClick={() => flipPage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {currentPage < book.pages.length - 1 && (
              <button
                onClick={() => flipPage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Page Indicators */}
          <div className="flex justify-center py-3 bg-blue-50 border-t border-blue-100">
            <div className="flex space-x-2">
              {book.pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => !isFlipping && setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === currentPage
                      ? 'bg-blue-600 scale-125'
                      : 'bg-blue-200 hover:bg-blue-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 p-6">
            <div className="flex justify-center space-x-4">
              <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Download PDF</span>
              </button>

              <button className="group flex items-center space-x-2 px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 rounded-xl shadow-lg hover:shadow-xl border border-blue-200 transition-all duration-200 transform hover:scale-105">
                <Printer className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Print Book</span>
              </button>

              <button className="group flex items-center space-x-2 px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 rounded-xl shadow-lg hover:shadow-xl border border-blue-200 transition-all duration-200 transform hover:scale-105">
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Share</span>
              </button>
            </div>

            <p className="text-center text-xs text-blue-500 mt-4 font-medium">
              Perfect for 6" × 6" printing • Premium gift quality
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const WellSaidLogo = () => (
    <img
      src={logo}
      alt="WellSaid"
      className="h-10 w-auto"
    />
  );

  const WellSaidIcon = ({ size = 24 }) => (
    <div
      className="rounded-full flex items-center justify-center shadow-sm"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 831.63 816.56"
        className="w-full h-full"
      >
        <defs>
          <style>{`.cls-1{fill:#4c89fe}.cls-2{fill:#fff}`}</style>
        </defs>
        <path className="cls-1" d="M406.54,84.52c-175.35,0-317.5,142.15-317.5,317.5s142.15,317.5,317.5,317.5h264.86c29.07,0,52.63-23.56,52.63-52.63v-264.86c0-175.35-142.15-317.5-317.5-317.5Z"/>
        <path className="cls-2" d="M245.15,458.27c-2.1,0-3.93-.52-5.48-1.58-1.55-1.05-2.77-2.72-3.67-5.02l-22.05-58.35c-.8-2-1.05-3.77-.75-5.33.3-1.55,1.07-2.77,2.33-3.67,1.25-.9,2.87-1.35,4.88-1.35,1.8,0,3.27.43,4.42,1.27,1.15.85,2.12,2.48,2.93,4.88l19.65,55.35h-3.6l20.4-55.95c.7-1.9,1.65-3.3,2.85-4.2,1.2-.9,2.75-1.35,4.65-1.35s3.47.45,4.73,1.35c1.25.9,2.17,2.3,2.77,4.2l19.95,55.95h-3.3l19.95-55.65c.8-2.3,1.82-3.85,3.08-4.65,1.25-.8,2.67-1.2,4.27-1.2,2,0,3.52.5,4.57,1.5,1.05,1,1.65,2.28,1.8,3.83.15,1.55-.13,3.22-.83,5.02l-22.05,58.35c-.9,2.2-2.13,3.85-3.68,4.95-1.55,1.1-3.33,1.65-5.32,1.65-2.1,0-3.93-.55-5.48-1.65-1.55-1.1-2.77-2.75-3.67-4.95l-21-56.85h7.5l-20.85,56.85c-.8,2.2-1.98,3.85-3.52,4.95-1.55,1.1-3.38,1.65-5.48,1.65Z"/>
        <path className="cls-2" d="M400.53,458.57c-8,0-14.88-1.52-20.62-4.57-5.75-3.05-10.2-7.4-13.35-13.05-3.15-5.65-4.73-12.38-4.73-20.17s1.55-14.25,4.65-19.95c3.1-5.7,7.35-10.15,12.75-13.35,5.4-3.2,11.55-4.8,18.45-4.8,5.1,0,9.65.82,13.65,2.47,4,1.65,7.43,4.05,10.28,7.2,2.85,3.15,5,6.97,6.45,11.47,1.45,4.5,2.18,9.55,2.18,15.15,0,1.7-.5,2.98-1.5,3.83-1,.85-2.5,1.27-4.5,1.27h-50.4v-9.3h46.2l-2.55,2.1c0-5-.73-9.25-2.18-12.75-1.45-3.5-3.6-6.17-6.45-8.02-2.85-1.85-6.38-2.78-10.58-2.78-4.7,0-8.68,1.1-11.92,3.3-3.25,2.2-5.73,5.25-7.43,9.15-1.7,3.9-2.55,8.45-2.55,13.65v.9c0,8.8,2.07,15.43,6.23,19.88,4.15,4.45,10.17,6.68,18.07,6.68,3,0,6.17-.4,9.52-1.2,3.35-.8,6.53-2.15,9.53-4.05,1.7-1,3.22-1.45,4.57-1.35,1.35.1,2.45.55,3.3,1.35.85.8,1.37,1.8,1.57,3,.2,1.2,0,2.43-.6,3.67-.6,1.25-1.65,2.38-3.15,3.38-3.4,2.3-7.35,4.03-11.85,5.17s-8.85,1.72-13.05,1.72Z"/>
        <path className="cls-2" d="M501.32,458.57c-7.8,0-13.68-2.27-17.62-6.82-3.95-4.55-5.93-11.12-5.93-19.73v-73.95c0-2.5.65-4.4,1.95-5.7,1.3-1.3,3.15-1.95,5.55-1.95s4.28.65,5.62,1.95c1.35,1.3,2.03,3.2,2.03,5.7v73.05c0,5,1.02,8.73,3.08,11.18,2.05,2.45,5.02,3.67,8.92,3.67.9,0,1.7-.02,2.4-.08.7-.05,1.4-.12,2.1-.22,1.2-.1,2.05.22,2.55.97.5.75.75,2.28.75,4.58,0,2.1-.45,3.73-1.35,4.88-.9,1.15-2.35,1.88-4.35,2.17-.9.1-1.85.17-2.85.23-1,.05-1.95.07-2.85.07Z"/>
        <path className="cls-2" d="M583.01,458.57c-7.8,0-13.68-2.27-17.62-6.82-3.95-4.55-5.92-11.12-5.92-19.73v-73.95c0-2.5.65-4.4,1.95-5.7s3.15-1.95,5.55-1.95,4.27.65,5.62,1.95c1.35,1.3,2.02,3.2,2.02,5.7v73.05c0,5,1.02,8.73,3.08,11.17,2.05,2.45,5.03,3.67,8.92,3.67.9,0,1.7-.02,2.4-.08.7-.05,1.4-.12,2.1-.22,1.2-.1,2.05.22,2.55.97.5.75.75,2.28.75,4.58,0,2.1-.45,3.73-1.35,4.88s-2.35,1.88-4.35,2.17c-.9.1-1.85.17-2.85.23-1,.05-1.95.07-2.85.07Z"/>
      </svg>
    </div>
  );

  const Header = () => (
    <div className="bg-white px-4 py-4 flex items-center justify-center border-b border-gray-100">
      <WellSaidLogo />
    </div>
  );

  const BottomNav = ({ currentView, setCurrentView, setShowCaptureOptions }) => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 backdrop-blur-lg bg-white/95">
        <div className="flex">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            {
              id: 'capture',
              icon: Edit3,
              label: 'Capture',
              onClick: () => {
                // Always show capture options when clicking the capture button
                setShowCaptureOptions(true);
                // Also set current view to home if not already there
                if (currentView !== 'home') {
                  setCurrentView('home');
                }
              }
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

  const HomeView = () => {

    // Calculate metrics
    const todayInsights = insights.filter(i => i.date === '2025-06-16' && i.shared).length;
    const weekInsights = insights.filter(i => i.shared).length;
    const weeklyGoal = 5;
    const progressPercent = (weekInsights / weeklyGoal) * 100;
    const [isShuffling, setIsShuffling] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const flipPage = (direction) => {
        if (isFlipping) return;
        setIsFlipping(true);

        if (direction === 'next' && currentPage < selectedBook?.pages?.length - 1) {
            setTimeout(() => setCurrentPage(currentPage + 1), 150);
        } else if (direction === 'prev' && currentPage > 0) {
            setTimeout(() => setCurrentPage(currentPage - 1), 150);
        }

        setTimeout(() => setIsFlipping(false), 300);
    };

    // Sample shared books data (you can move this to your constants or state)
    const sharedBooks = [
        {
            id: 1,
            name: "Truett's Scofield Graduation",
            recipient: "Truett",
            description: "Advice for Truett as he graduates from Scofield",
            count: 5,
            color: "bg-purple-500",
            lastUpdated: "2 days ago",
            type: "book",
            pages: [
                {
                    type: "question",
                    content: "What are your hopes for Sage during this summer intensive?",
                    pageNumber: 1
                },
                {
                    type: "answer",
                    content: {
                        text: "My hopes for Sage during this transformative experience:",
                        points: [
                            "That she discovers new strengths in herself",
                            "She makes lasting connections with fellow dancers",
                            "She learns to push through challenges with grace"
                        ]
                    },
                    pageNumber: 2
                }
            ]
        },
        {
            id: 2,
            name: "Cohen's 16th Birthday",
            recipient: "Cohen",
            description: "Thoughts and advice for Cohen as he turns 16",
            count: 4,
            color: "bg-blue-500",
            lastUpdated: "1 week ago",
            type: "book",
            pages: [
                {
                    type: "question",
                    content: "What do you remember most about Cohen at age 15?",
                    pageNumber: 1
                },
                {
                    type: "answer",
                    content: {
                        text: "Memories that stand out from this past year:",
                        points: [
                            "His dedication to learning guitar",
                            "How he stepped up as a big brother",
                            "His growing sense of humor and wit"
                        ]
                    },
                    pageNumber: 2
                }
            ]
        }
    ];

    const CaptureOptionsModal = ({ setShowCaptureOptions, setCurrentView, setCaptureMode }) => (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end">
        <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">How would you like to capture today?</h2>
          <p className="text-gray-600 text-center mb-8">Choose the experience that fits</p>

          <div className="space-y-4">
            {/* Insight Builder Option */}
            <button
              onClick={() => {
                setCaptureMode('insight');
                setShowCaptureOptions(false);
                setCurrentView('capture');
              }}
              className="w-full bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Lightbulb size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Insight Builder</h3>
                    <p className="text-green-100 text-sm">Start with an idea</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-white/70" />
              </div>
              <p className="text-green-100 text-sm leading-relaxed mb-2">
                Begin with your raw thoughts and let the AI help shape them into meaningful takeaways
              </p>
              <div className="flex items-center text-green-100 text-xs">
                <Pencil size={14} className="mr-1" />
                <span>10-15 minutes</span>
              </div>
            </button>

            {/* Quick Capture Option */}
            <button
              onClick={() => {
                setCaptureMode('quick');
                setShowCaptureOptions(false);
                setCurrentView('capture');
              }}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Quick Capture</h3>
                    <p className="text-blue-100 text-sm">Thoughtful prompts</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-white/70" />
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-2">
                Answer 1-2 thoughtful questions to quickly capture what's on your mind
              </p>
              <div className="flex items-center text-blue-100 text-xs">
                <Clock size={14} className="mr-1" />
                <span>5-10 minutes</span>
              </div>
            </button>

            {/* Special Occasion Option */}
            <button
              onClick={() => {
                // 🧼 Clear previous occasion-related state
                setSelectedOccasion(null);
                setQuestionSet([]);
                setCurrentQuestion('');
                setCurrentQuestionIndex(0);
                resetForm(); // optional, if you have form state

                // 🚀 Start fresh
                setCaptureMode('milestone');
                setShowCaptureOptions(false);
                setCurrentView('capture');
              }}
              className="w-full bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Special Occasion</h3>
                    <p className="text-purple-100 text-sm">Deep & comprehensive</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-white/70" />
              </div>
              <p className="text-purple-100 text-sm leading-relaxed mb-2">
                Prepare meaningful insights for upcoming milestones, celebrations, or life events
              </p>
              <div className="flex items-center text-purple-100 text-xs">
                <Calendar size={14} className="mr-1" />
                <span>20-45 minutes</span>
              </div>
            </button>
          </div>

          <button
            onClick={() => setShowCaptureOptions(false)}
            className="w-full mt-6 py-3 text-gray-500 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
        <Header showLogo={true} />

        <div className="p-4">
          {/* Hero Section - Now Clickable */}
          <div
            onClick={() => setShowCaptureOptions(true)}
            className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h1 className="text-xl font-bold mb-3">Good morning, {user.name.split(' ')[0]}!</h1>
              <p className="text-blue-100 text-base leading-relaxed mb-6">
                Use today to <strong>say what matters</strong>, so that it's there when it matters most.
              </p>

              {/* Visual CTA Indicator */}
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full animate-pulse mx-auto mt-4">
                <Plus size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Calendar size={20} className="mr-2 text-white/90" />
                <h3 className="font-semibold text-white drop-shadow-md">Upcoming Occasions</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 2).map(event => (
                  <button
                    key={event.id}
                    onClick={() => {
                      console.log('--- STARTING OCCASION FLOW ---');
                      console.log('Event clicked:', event.name);
                      // Determine occasion type based on event name
                      let occasionType = 'custom';
                      if (event.name.includes('Birthday')) occasionType = 'milestone-birthday';
                      if (event.name.includes('Graduation')) occasionType = 'graduation';
                      if (event.name.includes('Wedding')) occasionType = 'wedding';
                      console.log('Determined occasion type:', occasionType);
                      // Find the matching occasion
                      const occasion = occasions.find(o => o.id === occasionType) || {
                        id: 'custom',
                        name: event.name,
                        icon: '✨',
                        color: 'bg-gradient-to-br from-purple-500 to-pink-500'
                      };
                      console.log('Selected occasion:', occasion);
                      // Initialize multi-mode directly with this occasion
                      console.log('Setting capture mode to milestone');
                      setCaptureMode('milestone');
                      console.log('Setting selected occasion:', occasion);
                      setSelectedOccasion(occasion);

                      // Get the appropriate questions or use default ones
                      const questions = occasionQuestions[occasionType] || [
                        `What do you want to share about ${event.name}?`,
                        `What makes ${event.name} special?`,
                        `What advice would you give about ${event.name}?`
                      ];
                      console.log('Question set:', questions);
                      setQuestionSet(questions);
                      setCurrentQuestion(questions[0] || '');
                      setCurrentQuestionIndex(0);
                      resetForm();
                      console.log('Navigating to capture view');
                      // Go directly to capture view
                      setCurrentView('capture');
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 backdrop-blur-sm transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-purple-100 text-sm">{event.daysAway} days away</p>
                      </div>
                      <div className="flex items-center text-purple-100">
                        <Sparkles size={16} className="mr-1" />
                        <span className="text-sm">Prepare</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Weekly Progress</h3>
              <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                <Zap size={16} className="mr-1" />
                <span className="font-bold text-sm">{user.streak} week streak!</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{weekInsights} of {weeklyGoal} insights shared this week</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            {weekInsights >= weeklyGoal ? (
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <Trophy className="text-blue-500 mx-auto mb-2" size={24} />
                <p className="text-blue-700 font-medium">Weekly goal achieved! Streak continues!</p>
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                {weeklyGoal - weekInsights} more insight{weeklyGoal - weekInsights !== 1 ? 's' : ''} to maintain your streak
              </p>
            )}
          </div>

          {/* NEW: Book Preview Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Shared Books</h3>
              <p className="text-sm text-gray-600 mb-4">
                  Books you've prepared for special occasions and milestones.
              </p>

              <div className="space-y-4">
                  {sharedBooks.map(book => (
                      <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                          <div className="p-4">
                              <div className="flex items-start">
                                  <div className={`w-12 h-12 rounded-lg ${book.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                                      <Book className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                      <h3 className="font-semibold text-gray-800 mb-1">{book.name}</h3>
                                      <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                                      <div className="flex items-center gap-3 text-xs text-gray-500">
                                          <span>{book.pages.length / 2} chapters</span>
                                          <span>•</span>
                                          <span>For {book.recipient}</span>
                                          <span>•</span>
                                          <span>Updated {book.lastUpdated}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="px-4 pb-3 border-t border-gray-100">
                              <div className="flex items-center justify-between pt-3">
                                  <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                          <span className="text-xs font-medium text-blue-600">
                                              {book.recipient.charAt(0)}
                                          </span>
                                      </div>
                                      <span className="text-xs text-gray-600">
                                          Shared with {book.recipient}
                                      </span>
                                  </div>
                                  <button
                                      onClick={() => {
                                          setSelectedBook(book);
                                          setCurrentPage(0);
                                      }}
                                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                  >
                                      View Book
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Legacy Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{insights.filter(i => i.shared).length}</div>
                <div className="text-sm text-gray-600">Insights</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{individuals.length}</div>
                <div className="text-sm text-gray-600">People</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{collections.length}</div>
                <div className="text-sm text-gray-600">Books</div>
              </div>
            </div>
          </div>
        </div>

        {/* Capture Options Modal */}
        {showCaptureOptions && (
          <CaptureOptionsModal
            setShowCaptureOptions={setShowCaptureOptions}
            setCurrentView={setCurrentView}
            setCaptureMode={setCaptureMode}
          />
        )}
        {/* NEW: Book Preview Modal */}
        {selectedBook && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${selectedBook.color} rounded-lg flex items-center justify-center shadow-lg`}>
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-blue-800 tracking-wide">
                                        {selectedBook.name}
                                    </h3>
                                    <p className="text-sm text-blue-600 font-medium">
                                        For {selectedBook.recipient}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedBook(null)}
                                className="w-10 h-10 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Book Content */}
                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
                        <div className="relative w-full max-w-md h-[500px]">
                            <div className={`relative bg-white rounded-lg shadow-xl border border-blue-200 h-full overflow-y-auto ${isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
                                {/* Current Page Content */}
                                <div className="p-8 h-full flex flex-col">
                                    {selectedBook.pages[currentPage].type === 'question' ? (
                                        <>
                                            <div className="mb-6">
                                                <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                                                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                                        Question
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex items-center justify-center min-h-[300px]">
                                                <p className="text-lg text-blue-800 text-center italic">
                                                    {selectedBook.pages[currentPage].content}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-6">
                                                <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                                                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                                        Your Insight
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-h-[300px]">
                                                <p className="text-blue-800 mb-4">
                                                    {selectedBook.pages[currentPage].content.text}
                                                </p>
                                                <ul className="space-y-2 text-blue-700">
                                                    {selectedBook.pages[currentPage].content.points.map((point, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <span className="text-blue-500 mr-2">•</span>
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    )}

                                    <div className="mt-auto pt-4 text-center">
                                        <span className="text-xs text-blue-300 font-medium">
                                            Page {selectedBook.pages[currentPage].pageNumber}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {currentPage > 0 && (
                            <button
                                onClick={() => flipPage('prev')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}

                        {currentPage < selectedBook.pages.length - 1 && (
                            <button
                                onClick={() => flipPage('next')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Page Indicators */}
                    <div className="flex justify-center py-3 bg-blue-50 border-t border-blue-100">
                        <div className="flex space-x-2">
                            {selectedBook.pages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !isFlipping && setCurrentPage(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        idx === currentPage
                                            ? 'bg-blue-600 scale-125'
                                            : 'bg-blue-200 hover:bg-blue-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 p-4 bg-blue-50 border-t border-blue-100">
                        <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Download PDF">
                            <Download className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Print">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Order">
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        )}
        <style>{`
          @keyframes slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  };



  const CaptureView = ({ captureMode, setCurrentView }) => {
      // Chat state
      const [messages, setMessages] = useState([]);
      const [currentInput, setCurrentInput] = useState('');
      const [isTyping, setIsTyping] = useState(false);
      const [isRecording, setIsRecording] = useState(false);
      const [conversationState, setConversationState] = useState('init');
      const [autoTags, setAutoTags] = useState({ topics: [], people: [] });
      const [currentInsight, setCurrentInsight] = useState(null);
      const messagesEndRef = useRef(null);
      const [currentTopic, setCurrentTopic] = useState(null); // Add this line
      // User profile data with topics
      const userProfile = {
          topics: [
              {
                  name: 'Relationships',
                  prompt: "What's one moment that challenged how you show love—and what did it teach you about staying connected?",
                  tags: ['Love', 'Connection', 'Growth']
              },
              {
                  name: 'Health',
                  prompt: "When did you realize your approach to health needed to change—and what's stuck with you since?",
                  tags: ['Wellness', 'Habits', 'Self-care']
              },
              {
                  name: 'Money',
                  prompt: "What's a financial decision you struggled with—but now see as a turning point in how you manage money?",
                  tags: ['Finance', 'Lessons', 'Decision-making']
              }
          ],
          people: [
              { id: '1', name: 'Sarah', relationship: 'daughter' },
              { id: '2', name: 'Michael', relationship: 'son' }
          ]
      };

      // Sample data
      const people = [
        { id: '1', name: 'Sarah', relationship: 'daughter', interests: 'soccer, art' },
        { id: '2', name: 'Michael', relationship: 'son', interests: 'science, basketball' }
      ];

      // NEW: Special Occasion state
      const [occasion, setOccasion] = useState({
          type: '',
          date: '',
          person: {
              name: '',
              relationship: ''
          },
          reflections: [],
          currentQuestionIndex: 0,  // Add this line
          questions: [],           // Add this line
          finalMessage: ''
      });

      // Occasion types with suggested questions
      const occasionTypes = {
          wedding: {
              name: "Wedding",
              questions: [
                  "What's one childhood memory with them that feels especially meaningful now?",
                  "What quality do you most admire in their partnership?",
                  "What advice would you give about maintaining a strong relationship?"
              ]
          },
          birthday: {
              name: "Milestone Birthday",
              questions: [
                  "What's something you appreciate about them at this stage of life?",
                  "How have you seen them grow in the past decade?",
                  "What hope do you have for their next chapter?"
              ]
          },
          graduation: {
              name: "Graduation",
              questions: [
                  "What's been their most impressive accomplishment during this time?",
                  "How have you seen them overcome challenges?",
                  "What advice would you give as they start this new phase?"
              ]
          }
      };

      const topics = ['Life Lessons', 'Love', 'Career', 'Parenting', 'Personal Growth', 'Health', 'Routines', 'Sleep Habits'];

      const hasInitialized = useRef(false);

      useEffect(() => {
        if (!hasInitialized.current && messages.length === 0) {
          hasInitialized.current = true;

          if (captureMode === 'quick') {
            startQuickCapture();
          } else if (captureMode === 'milestone') {
            startMilestoneSelection();
          } else if (captureMode === 'insight') {
            startInsightBuilder();
          } else {
            startOpenCapture();
          }
        }
      }, []);

      const extractThemes = (reflections) => {
          // Simple theme extraction from responses
          const commonThemes = [
              'love', 'growth', 'support', 'memory',
              'pride', 'advice', 'family', 'change',
              'celebration', 'achievement', 'future'
          ];

          // Combine all reflection answers
          const allText = reflections.map(r => r.answer.toLowerCase()).join(' ');

          // Find matching themes
          const foundThemes = commonThemes.filter(theme =>
              allText.includes(theme)
          );

          // Fallback themes if none detected
          return foundThemes.length > 0
              ? foundThemes.slice(0, 3)
              : ['meaningful occasion'];
      };

      const typeMessage = (text, isBot = true, delay = 1000) => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { text, isBot, timestamp: Date.now() }]);
          setIsTyping(false);
          scrollToBottom();
        }, delay);
      };

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      // NEW: Insight Builder specific functions
      const startInsightBuilder = () => {
        setConversationState('init_insight');
        typeMessage("Let's shape your idea into a meaningful insight.", true);
        typeMessage("What's something you've been thinking about lately—an experience, a lesson, or a question worth unpacking?", true, 1500);
      };

      const handleInsightInit = (input) => {
        setCurrentInsight({ rawIdea: input });
        setConversationState('clarify_question');
        typeMessage(`"${input}" - sounds interesting!`, true);
        typeMessage("Would you say the core question is something like... [suggested question]? Or would you phrase it differently?", true, 1500);
      };

      const handleQuestionClarification = (input) => {
        if (input.toLowerCase().includes('differently') || input.toLowerCase().includes('no')) {
          setConversationState('user_question');
          typeMessage("How would you phrase the core question?", true);
        } else {
          setCurrentInsight(prev => ({
            ...prev,
            question: "What's a habit I've changed that improved my sleep?"
          }));
          setConversationState('elaborate_insight');
          typeMessage("Great—go ahead and share your response.", true);
          typeMessage("What habit did you change, and what impact did it have?", true, 1500);
        }
      };

      const handleUserQuestion = (input) => {
        setCurrentInsight(prev => ({
          ...prev,
          question: input
        }));
        setConversationState('elaborate_insight');
        typeMessage("Thanks for clarifying. Now please share your response to that question.", true);
      };

      const handleInsightElaboration = (input) => {
        setCurrentInsight(prev => ({
          ...prev,
          answer: input
        }));
        setConversationState('confirm_insight');

        // Analyze content for tags
        const tags = analyzeContent(input);
        setAutoTags(tags);

        // Create summary
        const summary = `Here's what I'm hearing: ${input}. It's a small change that led to better rest and a calmer end to your day. Would you say that captures it?`;
        typeMessage(summary, true);
      };

      const handleInsightConfirmation = (input) => {
        if (input.toLowerCase().startsWith('y') || input.toLowerCase().includes('yes')) {
          const tagsList = autoTags.topics.join(', ');
          typeMessage(`Perfect! We'll tag this insight with ${tagsList} so it's easy to revisit later.`, true);
          typeMessage("All set!", true);

          // In a real app, you would save the insight here
          setTimeout(() => setCurrentView('home'), 2000);
        } else {
          setConversationState('revise_insight');
          typeMessage("How would you like to adjust it?", true);
        }
      };

      const handleInsightRevision = (input) => {
        setCurrentInsight(prev => ({
          ...prev,
          answer: input
        }));
        setConversationState('confirm_insight');
        typeMessage("Got it. Here's the revised version:", true);
        typeMessage(input, true);
        typeMessage("Does this look correct now?", true, 1500);
      };

      // NEW: Special Occasion Flow Functions
      const startMilestoneSelection = () => {
          setConversationState('milestone_init');
          typeMessage("Hey there! Let's get started shaping something meaningful.", true);
          typeMessage("Is there a special occasion coming up that you'd like to reflect on or capture something for?", true, 1500);
      };

      const handleMilestoneInit = (input) => {
          // Simple occasion type detection
          const detectedType =
              input.includes('wedding') ? 'wedding' :
              input.includes('birthday') ? 'birthday' :
              input.includes('graduation') ? 'graduation' : 'custom';

          setOccasion(prev => ({
              ...prev,
              type: detectedType
          }));

          setConversationState('milestone_confirm');
          typeMessage(`That sounds wonderful! Just to confirm — the occasion is ${detectedType === 'custom' ? 'this special event' : `a ${occasionTypes[detectedType].name.toLowerCase()}`}`, true);
          typeMessage("Can you tell me who this is for and when it's happening? (e.g., 'Emily's wedding in October')", true, 1500);
      };

      const handleMilestoneConfirm = (input) => {
          // Extract date and name from input
          const dateMatch = input.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/i);
          const nameMatch = input.match(/(\b[A-Z][a-z]*'s\b|\bmy\s[A-Z][a-z]*\b)/i);

          const date = dateMatch ? dateMatch[0] : '';
          const name = nameMatch ? nameMatch[0].replace("'s", "").replace("my ", "") : '';

          setOccasion(prev => ({
              ...prev,
              date,
              person: {
                  ...prev.person,
                  name: name || ''
              }
          }));

          setConversationState('milestone_relationship');
          typeMessage("Got it. What's your relationship with them?", true);
          typeMessage("(e.g., 'older sibling', 'parent', 'close friend')", true, 1000);
      };

      const handleMilestoneRelationship = (input) => {
          setOccasion(prev => ({
              ...prev,
              person: {
                  ...prev.person,
                  relationship: input
              }
          }));

          setConversationState('milestone_theme');
          typeMessage("Beautiful. Would you like help reflecting on something specific?", true);
          typeMessage("Like a memory, advice, or how you've seen them grow? Or should I guide you with questions?", true, 1500);
      };

      const handleMilestoneTheme = (input) => {
          if (input.includes('guide') || input.includes('questions')) {
              setConversationState('milestone_guided');
              beginGuidedReflection();
          } else {
              setConversationState('milestone_freeform');
              typeMessage("What would you like to share about this occasion?", true);
          }
      };

      const handleMilestoneComplete = (input) => {
          const normalizedInput = input.toLowerCase().trim();

          if (normalizedInput.includes('save') || normalizedInput.includes('keep')) {
              // In a real app, you would save to database here
              typeMessage("Your reflection has been saved to your library!", true);
              typeMessage("You can find it in your Milestones collection.", true, 1000);
              setTimeout(() => setCurrentView('home'), 2000);
          }
          else if (normalizedInput.includes('share')) {
              // In a real app, you would implement sharing logic here
              typeMessage("Ready to share this meaningful reflection!", true);
              typeMessage("Would you like to send it via message, email, or create a shareable link?", true, 1500);
              setConversationState('milestone_sharing');
          }
          else if (normalizedInput.includes('edit')) {
              setConversationState('milestone_editing');
              typeMessage("Let's edit your reflection. What would you like to change?", true);
              typeMessage("You can edit: 1) Occasion details 2) Reflections 3) Final message", true, 1500);
          }
          else {
              typeMessage("I didn't quite catch that. Please choose 'save', 'share', or 'edit'.", true);
          }
      };

      const handleMilestoneSharing = (input) => {
          // Handle sharing method selection
          typeMessage(`Great! Preparing your reflection for ${input}.`, true);
          typeMessage("Your shareable content is ready. We'll return you to the home screen.", true, 1500);
          setTimeout(() => setCurrentView('home'), 3000);
      };

      const handleMilestoneEditing = (input) => {
          // Handle editing flow
          if (input.includes('1') || input.includes('details')) {
              setConversationState('milestone_confirm');
              typeMessage("Let's update the occasion details. What should we change?", true);
          }
          else if (input.includes('2') || input.includes('reflect')) {
              setConversationState('milestone_editing_reflections');
              showReflectionsForEditing();
          }
          else if (input.includes('3') || input.includes('message')) {
              setConversationState('milestone_editing_message');
              typeMessage("What would you like your final message to say instead?", true);
          }
      };

      const handleMilestoneFreeform = (input) => {
          setOccasion(prev => ({
              ...prev,
              reflections: [
                  ...prev.reflections,
                  {
                      question: "Freeform reflection",
                      answer: input
                  }
              ]
          }));

          setConversationState('milestone_summary');
          generateSummary();
      };

      // Add this helper function for editing
      const showReflectionsForEditing = () => {
          typeMessage("Here are your reflections:", true);
          occasion.reflections.forEach((reflection, index) => {
              typeMessage(`${index + 1}. ${reflection.question}`, true, 500);
              typeMessage(`   "${reflection.answer}"`, true, 500);
          });
          typeMessage("Which number would you like to edit? Or say 'back' to return.", true, 1000);
      };

      const beginGuidedReflection = () => {
          const questions = occasionTypes[occasion.type]?.questions || [
              "What makes this occasion special?",
              "What's your favorite memory with this person?",
              "What hopes do you have for them in this next chapter?"
          ];

          setOccasion(prev => ({
              ...prev,
              currentQuestionIndex: 0,
              questions
          }));

          typeMessage("Of course. Let's start here:", true);
          typeMessage(questions[0], true, 1000);
      };

      const handleGuidedReflectionResponse = (input) => {
          const { currentQuestionIndex, questions } = occasion;

          // Save reflection
          setOccasion(prev => ({
              ...prev,
              reflections: [
                  ...prev.reflections,
                  {
                      question: questions[currentQuestionIndex],
                      answer: input
                  }
              ]
          }));

          // Check if we have more questions
          if (currentQuestionIndex < questions.length - 1) {
              setOccasion(prev => ({
                  ...prev,
                  currentQuestionIndex: currentQuestionIndex + 1
              }));
              typeMessage(questions[currentQuestionIndex + 1], true, 1500);
          } else {
              setConversationState('milestone_summary');
              generateSummary();
          }
      };

      const generateSummary = () => {
          const { person, reflections } = occasion;
          const themes = extractThemes(reflections);

          setConversationState('milestone_summary');

          typeMessage("Here's what we've gathered so far:", true);
          typeMessage(`• Occasion: ${person.name}'s ${occasionTypes[occasion.type]?.name || 'Special Event'}`, true, 500);
          typeMessage(`• Relationship: ${person.relationship}`, true, 500);
          typeMessage(`• Themes: ${themes.join(', ')}`, true, 500);

          // Show one example reflection
          if (reflections.length > 0) {
              typeMessage(`• Reflection: "${reflections[0].answer.substring(0, 50)}${reflections[0].answer.length > 50 ? '...' : ''}"`, true, 500);
          }

          typeMessage("Would you like to add a final message or wrap up?", true, 1000);
      };

      // Add this new state handler for the summary phase
      const handleMilestoneSummary = (input) => {
          if (input.toLowerCase().includes('done') || input.toLowerCase().includes('wrap')) {
              typeMessage("Your milestone reflection is complete!", true);
              typeMessage("Would you like to save this, share it, or keep editing?", true, 1500);
              setConversationState('milestone_complete');
          } else {
              // Treat as final message
              setOccasion(prev => ({
                  ...prev,
                  finalMessage: input
              }));
              typeMessage("Beautiful message. I've added that as the closing thought.", true);
              generateSummary(); // Show updated summary
          }
      };

      // Modified handleInputSubmit to include insight builder flow
      const handleInputSubmit = () => {
        if (!currentInput.trim()) return;

        const input = currentInput.trim();
        setMessages(prev => [...prev, { text: input, isBot: false }]);
        setCurrentInput('');
        scrollToBottom();

        // Milestone states
        if (conversationState === 'milestone_complete') {
            handleMilestoneComplete(input);
        }
        else if (conversationState === 'milestone_sharing') {
            handleMilestoneSharing(input);
        }
        else if (conversationState === 'milestone_editing') {
            handleMilestoneEditing(input);
        }
        else if (conversationState === 'milestone_summary') {
            handleMilestoneSummary(input);
        }
        else if (conversationState === 'milestone_freeform') {
            handleMilestoneFreeform(input);
        }
        else if (conversationState === 'milestone_init') {
            handleMilestoneInit(input);
        } else if (conversationState === 'milestone_confirm') {
            handleMilestoneConfirm(input);
        } else if (conversationState === 'milestone_relationship') {
            handleMilestoneRelationship(input);
        } else if (conversationState === 'milestone_theme') {
            handleMilestoneTheme(input);
        } else if (conversationState === 'milestone_guided') {
            handleGuidedReflectionResponse(input);
        }
        // Quick Capture states
        else if (conversationState === 'quick_capture_response') {
            handleQuickCaptureResponse(input);
        } else if (conversationState === 'quick_capture_followup') {
            handleQuickCaptureFollowup(input);
        } else if (conversationState === 'quick_capture_confirm') {
            handleQuickCaptureConfirmation(input);
        }
        // Insight Builder specific states
        else if (conversationState === 'init_insight') {
            handleInsightInit(input);
        } else if (conversationState === 'clarify_question') {
          handleQuestionClarification(input);
        } else if (conversationState === 'user_question') {
          handleUserQuestion(input);
        } else if (conversationState === 'elaborate_insight') {
          handleInsightElaboration(input);
        } else if (conversationState === 'confirm_insight') {
          handleInsightConfirmation(input);
        } else if (conversationState === 'revise_insight') {
          handleInsightRevision(input);
        }
        // Existing states
        else if (conversationState === 'selecting_occasion') {
          handleOccasionSelection(input);
        } else if (conversationState === 'capturing') {
          handleWisdomCapture(input);
        } else if (conversationState === 'confirming') {
          handleConfirmation(input);
        }
      };

    const startQuickCapture = () => {
        // Select a random topic from user's profile
        const randomTopic = userProfile.topics[Math.floor(Math.random() * userProfile.topics.length)];
        setCurrentTopic(randomTopic);
        setConversationState('quick_capture_response');

        typeMessage("Let's capture a quick insight!", true);
        typeMessage(randomTopic.prompt, true, 1500);
    };

    const handleQuickCaptureResponse = (input) => {
        setConversationState('quick_capture_followup');

        // Analyze response for potential tags
        const detectedTags = analyzeContent(input).topics;
        const combinedTags = [...new Set([...currentTopic.tags, ...detectedTags])];

        typeMessage("That's a powerful shift.", true);
        typeMessage(`It sounds like you discovered ${input.includes('small') ? 'a small but meaningful' : 'an important'} change that improved your ${currentTopic.name.toLowerCase()}.`, true, 1000);

        // Generate follow-up question based on topic
        const followUpQuestion = currentTopic.name === 'Health'
            ? "Would you say the core lesson is about pacing your intake—or tuning into your body's feedback?"
            : currentTopic.name === 'Relationships'
            ? "Would you say this was more about communication, boundaries, or something else?"
            : "Would you say this was more about planning, discipline, or perspective?";

        typeMessage(followUpQuestion, true, 1500);
    };

    const handleQuickCaptureFollowup = (input) => {
        setConversationState('quick_capture_confirm');

        // Generate summary based on responses
        const summary = `Got it. You noticed ${input.includes('pattern') ? 'a pattern' : 'something'} in how ${
            currentTopic.name === 'Health' ? 'your body reacted' :
            currentTopic.name === 'Relationships' ? 'your relationships work' :
            'you manage resources'
        } and made ${input.includes('simple') ? 'a simple adjustment' : 'a change'} that helped you ${
            currentTopic.name === 'Health' ? 'feel better' :
            currentTopic.name === 'Relationships' ? 'connect better' :
            'manage better'
        }.`;

        typeMessage(summary, true);

        // Show tags
        const detectedTags = analyzeContent(input).topics;
        const combinedTags = [...new Set([...currentTopic.tags, ...detectedTags])];
        typeMessage(`I'd tag this as: ${combinedTags.map(t => `'${t}'`).join(', ')}.`, true, 1000);
        typeMessage("Does that feel accurate?", true, 1500);
    };

    const handleQuickCaptureConfirmation = (input) => {
        if (input.toLowerCase().startsWith('y') || input.toLowerCase().includes('yes')) {
            typeMessage("Great! I've saved this insight for you.", true);
            setTimeout(() => setCurrentView('home'), 2000);
        } else {
            setConversationState('quick_capture_revise');
            typeMessage("How would you like to adjust it?", true);
        }
    };

    const startOpenCapture = () => {
      setConversationState('capturing');
      typeMessage("What would you like to talk about today?", true);
      typeMessage("You can share any wisdom, lesson, or meaningful thought.", true, 1500);
    };

    const analyzeContent = (text) => {
      // Simple content analysis - in a real app you'd use more sophisticated NLP
      const detectedTopics = topics.filter(topic =>
        text.toLowerCase().includes(topic.toLowerCase())
      );

      const detectedPeople = people.filter(person =>
        text.toLowerCase().includes(person.name.toLowerCase()) ||
        text.toLowerCase().includes(person.relationship)
      );

      return {
        topics: detectedTopics.length > 0 ? detectedTopics : ['General Wisdom'],
        people: detectedPeople
      };
    };

    const handleOccasionSelection = (input) => {
      const occasion = input.toLowerCase();
      typeMessage(`Capturing wisdom for ${occasion}!`, true);
      typeMessage("What would you like to share about this occasion?", true, 1500);
      setConversationState('capturing');
    };

    const handleWisdomCapture = (input) => {
      // Analyze the content for auto-tagging
      const tags = analyzeContent(input);
      setAutoTags(tags);

      // Build confirmation message
      let confirmation = "I'll save this wisdom about: ";
      confirmation += tags.topics.join(', ');

      if (tags.people.length > 0) {
        confirmation += ` for ${tags.people.map(p => p.name).join(', ')}`;
      }

      typeMessage("Thank you for sharing that meaningful insight!", true);
      typeMessage(confirmation, true, 1500);
      typeMessage("Does this look correct? (yes/no)", true, 2000);
      setConversationState('confirming');
    };

    const handleConfirmation = (input) => {
      if (input.toLowerCase().startsWith('y')) {
        typeMessage("Wonderful! I've saved this for you.", true);
        setTimeout(() => setCurrentView('home'), 2000);
      } else {
        typeMessage("Let me try again. What would you like to change?", true);
        setConversationState('capturing');
      }
    };

    const toggleRecording = () => {
      setIsRecording(!isRecording);
      if (!isRecording) {
        setTimeout(() => {
          setCurrentInput("This would be transcribed speech...");
          setIsRecording(false);
        }, 3000);
      }
    };

    const getPlaceholderText = () => {
      switch (conversationState) {
        // Quick Capture states
        case 'quick_capture_response':
          return `Share your thoughts about ${currentTopic?.name.toLowerCase()}...`;
        case 'quick_capture_followup':
          return "Add any additional reflections...";
        case 'quick_capture_confirm':
          return "Does this capture it correctly? (yes/no)";
        case 'quick_capture_revise':
          return "How would you like to adjust it?";

        // Insight Builder states
        case 'init_insight':
          return "What's something you've been thinking about?";
        case 'clarify_question':
          return "Does this question work or would you phrase it differently?";
        case 'user_question':
          return "How would you phrase the core question?";
        case 'elaborate_insight':
          return "Share your thoughts in detail...";
        case 'confirm_insight':
          return "Does this capture it correctly? (yes/no)";
        case 'revise_insight':
          return "How would you like to adjust it?";

        // Milestone states
        case 'milestone_summary':
            return "Add final message or say 'done'";
        case 'milestone_complete':
            return "Choose 'save', 'share', or 'edit'";
        case 'milestone_init':
            return "e.g., 'My sister's wedding', 'Dad's retirement'";
        case 'milestone_confirm':
            return "Tell me who and when (e.g., 'Emily's wedding in October')";
        case 'milestone_relationship':
            return "Describe your relationship...";
        case 'milestone_theme':
            return "Choose 'specific memory' or 'guide me'";
        case 'milestone_guided':
            return "Share your thoughts...";
        case 'milestone_summary':
            return "Add final message or say 'done'";
        case 'milestone_complete':
            return "Choose 'save', 'share', or 'edit'";
        case 'milestone_sharing':
            return "Select sharing method (message/email/link)";
        case 'milestone_editing':
            return "What would you like to edit? (1/2/3)";
        case 'milestone_editing_reflections':
            return "Enter number to edit or 'back'";
        case 'milestone_editing_message':
            return "Enter your revised final message";
        // Other states
        case 'selecting_occasion':
          return "What are we celebrating?";
        case 'capturing':
          return "Share your thoughts...";
        case 'confirming':
          return "Does this look correct? (yes/no)";

        default:
          return "Type your response...";
      }
    };

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-y-auto">
        {/* Main content area */}
        <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
          {/* Header */}
          <div className="p-4 pt-6">
            <div className="flex items-center gap-3">
              <WellSaidIcon size={50} />
              <div>
                <h1 className="text-xl font-bold">Capture Wisdom</h1>
                <p className="text-sm text-gray-500">
                  {captureMode === 'quick'
                    ? 'Quick Capture'
                    : captureMode === 'milestone'
                    ? 'Milestone'
                    : captureMode === 'insight'
                    ? 'Insight Builder'
                    : 'Open Conversation'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 overflow-y-auto pb-60">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area - Fixed positioning */}
        <div className="fixed bottom-[72px] left-0 right-0 px-4 z-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-3">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <textarea
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder={getPlaceholderText()}
                    className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleInputSubmit();
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
                  onClick={handleInputSubmit}
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
          </div>
        </div>

        {/* Bottom navigation - fixed position */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow z-10 h-[56px]">
          <div className="max-w-2xl mx-auto flex justify-around items-center h-full">
            <button onClick={() => setCurrentView('home')} className="text-gray-600 hover:text-blue-500 flex flex-col items-center">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button onClick={() => setCurrentView('capture')} className="text-blue-500 flex flex-col items-center">
              <PlusCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Capture</span>
            </button>
            <button onClick={() => setCurrentView('library')} className="text-gray-600 hover:text-blue-500 flex flex-col items-center">
              <Library className="w-6 h-6" />
              <span className="text-xs mt-1">Library</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // In your TagEditor component, modify it to support multiple collection selection
  const TagEditor = ({ entry, onClose, onSave }) => {
    const [selectedCollections, setSelectedCollections] = useState(entry.collections || []);

    const toggleCollection = (collectionId) => {
      setSelectedCollections(prev =>
        prev.includes(collectionId)
          ? prev.filter(id => id !== collectionId)
          : [...prev, collectionId]
      );
    };

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Organize Insight</h3>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add to Collections</h4>

            {/* System Collections */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                System Collections
              </h5>
              <div className="space-y-2">
                {SYSTEM_COLLECTIONS.map(collection => (
                  <label key={collection.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() => toggleCollection(collection.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{collection.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* User Collections */}
            {collections.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Your Collections
                </h5>
                <div className="space-y-2">
                  {collections.map(collection => (
                    <label key={collection.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(collection.id)}
                        onChange={() => toggleCollection(collection.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{collection.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave({ ...entry, collections: selectedCollections });
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const OrganizeView = () => {
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [showTagEditor, setShowTagEditor] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [expandedCollection, setExpandedCollection] = useState(null);
    const [viewMode, setViewMode] = useState('collections'); // 'collections' or 'books'
    const [showInactiveCollections, setShowInactiveCollections] = useState(false);
    // Search-related state (migrated from LibraryView)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
      topics: [],
      recipients: [],
      entryTypes: []
    });
    const [showFilters, setShowFilters] = useState(false);
    const [currentCollection, setCurrentCollection] = useState(null);
    // Book preview state (migrated from LibraryView)
    const [selectedBook, setSelectedBook] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    // Add this state near the top of your component
    const [collectionFilter, setCollectionFilter] = useState('all'); // 'all', 'person', or 'occasion'

    // Add this filter control above the collections display
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => setCollectionFilter('all')}
        className={`px-3 py-1 rounded-full text-sm ${
          collectionFilter === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => setCollectionFilter('person')}
        className={`px-3 py-1 rounded-full text-sm ${
          collectionFilter === 'person'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        By Person
      </button>
      <button
        onClick={() => setCollectionFilter('occasion')}
        className={`px-3 py-1 rounded-full text-sm ${
          collectionFilter === 'occasion'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        By Occasion
      </button>
    </div>

    // Add this near the top of your component file
    const SYSTEM_COLLECTIONS = [
      // Core Themes
      { id: 'relationships', name: 'Relationships', color: 'bg-red-500', type: 'system' },
      { id: 'parenting', name: 'Parenting', color: 'bg-blue-500', type: 'system' },
      { id: 'finances', name: 'Finances', color: 'bg-green-500', type: 'system' },
      { id: 'work', name: 'Work', color: 'bg-yellow-500', type: 'system' },
      { id: 'education', name: 'Education', color: 'bg-purple-500', type: 'system' },
      { id: 'health-wellness', name: 'Health & Wellness', color: 'bg-pink-500', type: 'system' },
      { id: 'creativity', name: 'Creativity', color: 'bg-indigo-500', type: 'system' },
      { id: 'personal-growth', name: 'Personal Growth', color: 'bg-teal-500', type: 'system' },
      { id: 'faith', name: 'Faith', color: 'bg-gray-500', type: 'system' },
      { id: 'dreams', name: 'Dreams', color: 'bg-blue-400', type: 'system' },

      // Life Context
      { id: 'travel-adventure', name: 'Travel & Adventure', color: 'bg-orange-500', type: 'system' },
      { id: 'family', name: 'Family', color: 'bg-amber-500', type: 'system' },
      { id: 'home-living', name: 'Home & Living', color: 'bg-lime-500', type: 'system' },
      { id: 'community', name: 'Community', color: 'bg-emerald-500', type: 'system' },
      { id: 'food', name: 'Food', color: 'bg-rose-500', type: 'system' },
      { id: 'nature', name: 'Nature', color: 'bg-green-400', type: 'system' },
      { id: 'mindfulness', name: 'Mindfulness', color: 'bg-violet-500', type: 'system' },
      { id: 'memories', name: 'Memories', color: 'bg-cyan-500', type: 'system' },
      { id: 'culture', name: 'Culture', color: 'bg-fuchsia-500', type: 'system' },
      { id: 'entertainment', name: 'Entertainment', color: 'bg-sky-500', type: 'system' },
      { id: 'events-celebrations', name: 'Events & Celebrations', color: 'bg-pink-400', type: 'system' },
      { id: 'self-care', name: 'Self-Care', color: 'bg-purple-400', type: 'system' },
      { id: 'productivity', name: 'Productivity', color: 'bg-yellow-400', type: 'system' },

      // Additional
      { id: 'fitness-sports', name: 'Fitness & Sports', color: 'bg-red-400', type: 'system' },
      { id: 'heritage', name: 'Heritage', color: 'bg-amber-400', type: 'system' },
      { id: 'technology', name: 'Technology', color: 'bg-indigo-400', type: 'system' },
      { id: 'life-lessons', name: 'Life Lessons', color: 'bg-teal-400', type: 'system' }
    ];

    // Shared books data (migrated from LibraryView)
    const sharedBooks = [
      {
        id: 1,
        name: "Letters to Sage",
        recipient: "Sage",
        description: "Life lessons and love letters for my daughter",
        count: 12,
        color: "bg-pink-500",
        lastUpdated: "2 days ago",
        type: "book",
        pages: [
          {
            type: "question",
            content: "How can I teach you about resilience when life gets difficult?",
            pageNumber: 1
          },
          {
            type: "answer",
            content: {
              text: "Resilience isn't about avoiding falls, but learning how to get up. When you face challenges:",
              points: [
                "Remember that struggles are temporary",
                "Ask for help when you need it",
                "Know that I'll always be here for you"
              ]
            },
            pageNumber: 2
          },
          {
            type: "question",
            content: "What do I want you to know about finding true happiness?",
            pageNumber: 3
          },
          {
            type: "answer",
            content: {
              text: "Happiness comes from within and grows when you:",
              points: [
                "Cultivate gratitude daily",
                "Build meaningful relationships",
                "Pursue purpose, not just pleasure"
              ]
            },
            pageNumber: 4
          }
        ]
      },
      {
        id: 2,
        name: "First Year Lessons",
        recipient: "Cohen",
        description: "What I learned in your first year of life",
        count: 6,
        color: "bg-blue-500",
        lastUpdated: "1 week ago",
        type: "book",
        pages: [
          {
            type: "question",
            content: "What surprised me most about becoming your parent?",
            pageNumber: 1
          },
          {
            type: "answer",
            content: {
              text: "The depth of love and responsibility I felt immediately:",
              points: [
                "How your smile could brighten my worst day",
                "The instinct to protect you at all costs",
                "The joy in your smallest discoveries"
              ]
            },
            pageNumber: 2
          },
          {
            type: "question",
            content: "What advice would I give to new parents?",
            pageNumber: 3
          },
          {
            type: "answer",
            content: {
              text: "The things that matter most:",
              points: [
                "Trust your instincts - you know your child best",
                "Don't compare milestones - every child develops differently",
                "Take time to just be present together"
              ]
            },
            pageNumber: 4
          }
        ]
      },
      {
        id: 3,
        name: "For When You're Older",
        recipient: "Both kids",
        description: "Wisdom for their teenage years and beyond",
        count: 4,
        color: "bg-purple-500",
        lastUpdated: "3 days ago",
        type: "book",
        pages: [
          {
            type: "question",
            content: "How should you handle heartbreak when it comes?",
            pageNumber: 1
          },
          {
            type: "answer",
            content: {
              text: "Though painful, heartbreak teaches valuable lessons:",
              points: [
                "It's okay to grieve - don't rush the healing",
                "Every ending makes space for new beginnings",
                "Your worth isn't defined by any relationship"
              ]
            },
            pageNumber: 2
          },
          {
            type: "question",
            content: "What financial principles will serve you best?",
            pageNumber: 3
          },
          {
            type: "answer",
            content: {
              text: "Money management fundamentals:",
              points: [
                "Live below your means and save consistently",
                "Invest early - time is your greatest asset",
                "True wealth is freedom, not possessions"
              ]
            },
            pageNumber: 4
          },
          {
            type: "question",
            content: "How do I want you to remember me?",
            pageNumber: 5
          },
          {
            type: "answer",
            content: {
              text: "I hope you remember:",
              points: [
                "I loved you unconditionally, always",
                "I did my best, even when I made mistakes",
                "My greatest legacy is the people you become"
              ]
            },
            pageNumber: 6
          }
        ]
      }
    ];

    // Replace the groupedEntries reducer with this:
    const groupedEntries = insights.reduce((acc, entry) => {
      // Handle unorganized entries (no collections)
      if (!entry.collections || entry.collections.length === 0) {
        if (!acc.unorganized) acc.unorganized = [];
        acc.unorganized.push(entry);
        return acc;
      }

      // Add to each collection it belongs to
      entry.collections.forEach(collectionId => {
        if (!acc[collectionId]) {
          acc[collectionId] = [];
        }
        acc[collectionId].push(entry);
      });

      return acc;
    }, {});

    // Search functions (migrated from LibraryView)
    const performRAGSearch = async (query) => {
      setIsSearching(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const results = insights.filter(entry => {
        const matchesText = entry.text?.toLowerCase().includes(query.toLowerCase()) ||
                          entry.content?.toLowerCase().includes(query.toLowerCase()) ||
                          entry.question?.toLowerCase().includes(query.toLowerCase());

        const matchesTopics = selectedFilters.topics.length === 0 ||
                            entry.topics?.some(topic => selectedFilters.topics.includes(topic));

        const matchesRecipients = selectedFilters.recipients.length === 0 ||
                                entry.recipients?.some(id => selectedFilters.recipients.includes(id));

        const matchesType = selectedFilters.entryTypes.length === 0 ||
                          (selectedFilters.entryTypes.includes('draft') && entry.isDraft) ||
                          (selectedFilters.entryTypes.includes('voice') && entry.isVoiceNote) ||
                          (selectedFilters.entryTypes.includes('insight') && !entry.isDraft && !entry.isVoiceNote);

        return matchesText && matchesTopics && matchesRecipients && matchesType;
      });
      setSearchResults(results);
      setIsSearching(false);
    };

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        performRAGSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    };

    const toggleFilter = (filterType, value) => {
      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter(item => item !== value)
            : [...prev[filterType], value]
      }));
    };

    // Book functions (migrated from LibraryView)
    const flipPage = (direction) => {
      if (isFlipping) return;
      setIsFlipping(true);

      if (direction === 'next' && currentPage < selectedBook?.pages?.length - 1) {
        setTimeout(() => setCurrentPage(currentPage + 1), 150);
      } else if (direction === 'prev' && currentPage > 0) {
        setTimeout(() => setCurrentPage(currentPage - 1), 150);
      }

      setTimeout(() => setIsFlipping(false), 300);
    };

    const handleEntrySelect = (entryId) => {
      setSelectedEntries(prev =>
        prev.includes(entryId)
            ? prev.filter(id => id !== entryId)
            : [...prev, entryId]
      );
    };

    const handleBulkAction = () => {
      if (bulkAction === 'tag' && selectedEntries.length > 0) {
        setShowTagEditor(true);
      }
    };

    const toggleCollection = (collectionId) => {
      setExpandedCollection(expandedCollection === collectionId ? null : collectionId);
    };

    const renderEntryCard = (entry) => (
      <div key={entry.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
        {/* Header */}
        <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
          <div className="flex-1 flex items-center space-x-2">
            {entry.isVoiceNote && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                <Mic className="w-3 h-3 mr-1" /> Voice Note
              </span>
            )}
            {entry.isDraft && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                Draft
              </span>
            )}
            <span className="text-xs text-gray-500">
              {new Date(entry.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Question */}
          {entry.question && (
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Question</span>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-800">
                {entry.question}
              </div>
            </div>
          )}

          {/* Answer */}
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                {entry.isDraft ? "Draft Content" : "Your Insight"}
              </span>
            </div>
            <div className={`rounded-lg p-3 text-sm ${
              entry.isDraft || entry.isVoiceNote
                ? "bg-gray-50 italic text-gray-600"
                : "bg-green-50 text-gray-800"
            }`}>
              {entry.text || entry.content || "No content yet"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-3 pt-2 border-t border-gray-100">
          {/* Collections */}
          <div className="flex flex-wrap gap-2 mb-2">
            {entry.collections?.map(collectionId => {
              const collection = [...SYSTEM_COLLECTIONS, ...collections].find(c => c.id === collectionId);
              return collection ? (
                <span key={collectionId} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {collection.name}
                </span>
              ) : null;
            })}
          </div>

          {/* Recipients */}
          <div className="flex flex-wrap gap-2">
            {entry.recipients?.map(id => {
              const person = individuals.find(p => p.id === id);
              return person ? (
                <span key={person.id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  <span className={`w-2 h-2 rounded-full ${person.color} mr-1`}></span>
                  {person.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>
    );

    // Get unique topics and recipients for filters
    const allTopics = [...new Set(insights.flatMap(entry => entry.topics || []))];
    const allRecipients = individuals.map(person => person.id);

    // Modify the collections rendering to filter based on collectionFilter
    const filteredSystemCollections = SYSTEM_COLLECTIONS.filter(collection => {
      const hasEntries = groupedEntries[collection.id]?.length > 0;
      if (!hasEntries) return false;

      if (collectionFilter === 'person') {
        // Only show collections that have entries with recipients
        return groupedEntries[collection.id].some(entry => entry.recipients?.length > 0);
      }
      if (collectionFilter === 'occasion') {
        // System collections aren't occasions, so hide them in this view
        return false;
      }
      return true;
    });

    const filteredUserCollections = collections.filter(collection => {
      const hasEntries = groupedEntries[collection.id]?.length > 0;
      if (!hasEntries) return false;

      if (collectionFilter === 'person') {
        return collection.type === 'person' ||
               groupedEntries[collection.id].some(entry => entry.recipients?.length > 0);
      }
      if (collectionFilter === 'occasion') {
        return collection.type === 'occasion';
      }
      return true;
    });

    const CollectionItem = ({
      collection,
      entries,
      isActive,
      expanded,
      onToggle,
      showRecipient = false,
      onAddToCollection
    }) => (
      <div className={`mb-4 ${!isActive ? 'opacity-70' : ''}`}>
        <div
          onClick={isActive ? onToggle : undefined}
          className={`bg-white rounded-lg p-4 ${isActive ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors border ${
            isActive ? 'border-gray-200' : 'border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg ${
                isActive ? collection.color : 'bg-gray-300'
              } flex items-center justify-center mr-3`}>
                {collection.type === 'occasion' ? (
                  <Calendar className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                ) : (
                  <FolderOpen className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                )}
              </div>
              <div>
                <div className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                  {collection.name}
                </div>
                <div className="text-sm text-gray-500">
                  {entries.length || 0} insights
                  {showRecipient && collection.recipient && ` • For ${collection.recipient}`}
                </div>
              </div>
            </div>

            {/* Updated button/chevron area */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection?.(collection.id);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                aria-label={`Add to ${collection.name}`}
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
              {isActive && (
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expanded ? 'transform rotate-180' : ''
                  }`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isActive && expanded && entries.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-gray-200 ml-5">
            {entries.map(entry => renderEntryCard(entry))}
          </div>
        )}
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
        <Header />

        <div className="p-4">
          {/* Search Bar (migrated from LibraryView) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-white/50">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your wisdom..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isSearching ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                aria-label={showFilters ? "Hide filters" : "Show filters"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </form>

            {/* Filters section */}
            {showFilters && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">FILTER BY:</span>
                  {allTopics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => toggleFilter('topics', topic)}
                      className={`px-2.5 py-1 rounded-full text-xs ${
                        selectedFilters.topics.includes(topic)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {allRecipients.map(id => {
                    const person = individuals.find(p => p.id === id);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleFilter('recipients', id)}
                        className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 ${
                          selectedFilters.recipients.includes(id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${person.color}`}></span>
                        {person.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['insight', 'draft', 'voice'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter('entryTypes', type)}
                      className={`px-2.5 py-1 rounded-full text-xs capitalize ${
                        selectedFilters.entryTypes.includes(type)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Results Summary */}
          {searchQuery.trim() && (
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {searchResults.length} results for "{searchQuery}"
              </h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setSelectedFilters({ topics: [], recipients: [], entryTypes: [] });
                }}
                className="text-blue-600 text-sm font-medium hover:text-blue-800"
              >
                Clear search
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg p-1 mb-6">
            <button
              onClick={() => setViewMode('collections')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'collections'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setViewMode('books')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'books'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Books
            </button>
          </div>

          {/* Collections View */}
          {viewMode === 'collections' && (
            <>
              {/* Active System Collections */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Active Collections</h3>
                <div className="space-y-2">
                  {SYSTEM_COLLECTIONS.filter(collection =>
                    groupedEntries[collection.id]?.length > 0
                  ).map(collection => (
                    <CollectionItem
                      key={collection.id}
                      collection={collection}
                      entries={groupedEntries[collection.id] || []}
                      isActive={true}
                      expanded={expandedCollection === collection.id}
                      onToggle={() => toggleCollection(collection.id)}
                      onAddToCollection={(collectionId) => {
                        setCurrentCollection(collectionId);
                        setCurrentView('capture');
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* User Collections */}
              {filteredUserCollections.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Your Collections</h3>
                  <div className="space-y-2">
                    {filteredUserCollections.map(collection => (
                      <CollectionItem
                        key={collection.id}
                        collection={collection}
                        entries={groupedEntries[collection.id] || []}
                        isActive={true}
                        expanded={expandedCollection === collection.id}
                        onToggle={() => toggleCollection(collection.id)}
                        showRecipient={true}
                        onAddToCollection={(collectionId) => {
                          setCurrentCollection(collectionId);
                          setCurrentView('capture');
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Inactive Collections */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-700">Inactive Collections</h3>
                  <button
                    onClick={() => setShowInactiveCollections(!showInactiveCollections)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showInactiveCollections ? 'Hide' : 'Show All'}
                  </button>
                </div>

                {showInactiveCollections && (
                  <div className="space-y-2">
                    {SYSTEM_COLLECTIONS.filter(collection =>
                      !groupedEntries[collection.id]?.length
                    ).map(collection => (
                      <CollectionItem
                        key={collection.id}
                        collection={collection}
                        entries={[]}
                        isActive={false}
                        expanded={false}
                        onToggle={() => {}}
                        onAddToCollection={(collectionId) => {
                          // Set the collection context and navigate to capture
                          setCurrentCollection(collectionId);
                          setCurrentView('capture');
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Books View */}
          {viewMode === 'books' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">Living Bookshelf</h2>
                  <span className="text-sm text-gray-500">{sharedBooks.length} books</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Curated collections and books you've created to share with your loved ones.
                </p>

                <div className="space-y-4">
                  {sharedBooks.map(book => (
                    <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <div className="p-4">
                        <div className="flex items-start">
                          <div className={`w-12 h-12 rounded-lg ${book.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                            <Book className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{book.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{book.pages.length / 2} chapters</span>
                              <span>•</span>
                              <span>For {book.recipient}</span>
                              <span>•</span>
                              <span>Updated {book.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-3 border-t border-gray-100">
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {book.recipient === 'Sage' ? 'S' : book.recipient === 'Cohen' ? 'B' : 'B'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600">
                              {book.recipient === 'Both kids' ? 'Shared with both children' : `Shared with ${book.recipient}`}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setCurrentPage(0); // Reset to first page when opening a book
                            }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            View Book
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create New Book Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-800">Create a New Book</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Turn your insights into a meaningful collection for someone special.
                </p>
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                  onClick={() => setCurrentView('createBook')}
                >
                  <Plus size={16} />
                  Start New Book
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tag Editor Modal */}
        {showTagEditor && selectedEntry && (
          <TagEditor
            entry={selectedEntry}
            onClose={() => {
              setShowTagEditor(false);
              setSelectedEntry(null);
            }}
            onSave={() => {
              console.log('Saving entry organization');
            }}
          />
        )}

        {/* Book Preview Modal (migrated from LibraryView) */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${selectedBook.color} rounded-lg flex items-center justify-center shadow-lg`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-800 tracking-wide">
                        {selectedBook.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        For {selectedBook.recipient}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBook(null)}
                    className="w-10 h-10 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Book Content - Fixed size container */}
              <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
                <div className="relative w-full max-w-md h-[500px]">
                  <div className={`relative bg-white rounded-lg shadow-xl border border-blue-200 h-full overflow-y-auto ${isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
                    {/* Current Page Content */}
                    <div className="p-8 h-full flex flex-col">
                      {selectedBook.pages[currentPage].type === 'question' ? (
                        <>
                          <div className="mb-6">
                            <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                Question
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 flex items-center justify-center min-h-[300px]">
                            <p className="text-lg text-blue-800 text-center italic">
                              {selectedBook.pages[currentPage].content}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mb-6">
                            <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                Your Insight
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-h-[300px]">
                            <p className="text-blue-800 mb-4">
                              {selectedBook.pages[currentPage].content.text}
                            </p>
                            <ul className="space-y-2 text-blue-700">
                              {selectedBook.pages[currentPage].content.points.map((point, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                      <div className="mt-auto pt-4 text-center">
                        <span className="text-xs text-blue-300 font-medium">
                          Page {selectedBook.pages[currentPage].pageNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                {currentPage > 0 && (
                  <button
                    onClick={() => flipPage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {currentPage < selectedBook.pages.length - 1 && (
                  <button
                    onClick={() => flipPage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Page Indicators */}
              <div className="flex justify-center py-3 bg-blue-50 border-t border-blue-100">
                <div className="flex space-x-2">
                  {selectedBook.pages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => !isFlipping && setCurrentPage(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        idx === currentPage
                          ? 'bg-blue-600 scale-125'
                          : 'bg-blue-200 hover:bg-blue-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Icon-only Action Buttons */}
              <div className="flex justify-center gap-4 p-4 bg-blue-50 border-t border-blue-100">
                <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Download PDF">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Print">
                  <Printer className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Order">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LibraryView = ({ resetForm }) => {
      // Search-related state (NEW)
      const [searchQuery, setSearchQuery] = useState('');
      const [searchResults, setSearchResults] = useState([]);
      const [isSearching, setIsSearching] = useState(false);
      const [selectedFilters, setSelectedFilters] = useState({
          topics: [],
          recipients: [],
          entryTypes: []
      });
      const [currentPage, setCurrentPage] = useState(0); // For tracking which page is shown in the modal
      const [showFilters, setShowFilters] = useState(false);
      const [isFlipping, setIsFlipping] = useState(false);
      const flipPage = (direction) => {
        if (isFlipping) return;
        setIsFlipping(true);

        if (direction === 'next' && currentPage < selectedBook?.pages?.length - 1) {
          setTimeout(() => setCurrentPage(currentPage + 1), 150);
        } else if (direction === 'prev' && currentPage > 0) {
          setTimeout(() => setCurrentPage(currentPage - 1), 150);
        }

        setTimeout(() => setIsFlipping(false), 300);
      };
      // Your existing state (PRESERVED)
      const [libraryView, setLibraryView] = useState('personal');
      const sharedBooks = [
        {
          id: 1,
          name: "Letters to Sage",
          recipient: "Sage",
          description: "Life lessons and love letters for my daughter",
          count: 12,
          color: "bg-pink-500",
          lastUpdated: "2 days ago",
          type: "book",
          pages: [
            {
              type: "question",
              content: "How can I teach you about resilience when life gets difficult?",
              pageNumber: 1
            },
            {
              type: "answer",
              content: {
                text: "Resilience isn't about avoiding falls, but learning how to get up. When you face challenges:",
                points: [
                  "Remember that struggles are temporary",
                  "Ask for help when you need it",
                  "Know that I'll always be here for you"
                ]
              },
              pageNumber: 2
            },
            {
              type: "question",
              content: "What do I want you to know about finding true happiness?",
              pageNumber: 3
            },
            {
              type: "answer",
              content: {
                text: "Happiness comes from within and grows when you:",
                points: [
                  "Cultivate gratitude daily",
                  "Build meaningful relationships",
                  "Pursue purpose, not just pleasure"
                ]
              },
              pageNumber: 4
            }
          ]
        },
        {
          id: 2,
          name: "First Year Lessons",
          recipient: "Cohen",
          description: "What I learned in your first year of life",
          count: 6,
          color: "bg-blue-500",
          lastUpdated: "1 week ago",
          type: "book",
          pages: [
            {
              type: "question",
              content: "What surprised me most about becoming your parent?",
              pageNumber: 1
            },
            {
              type: "answer",
              content: {
                text: "The depth of love and responsibility I felt immediately:",
                points: [
                  "How your smile could brighten my worst day",
                  "The instinct to protect you at all costs",
                  "The joy in your smallest discoveries"
                ]
              },
              pageNumber: 2
            },
            {
              type: "question",
              content: "What advice would I give to new parents?",
              pageNumber: 3
            },
            {
              type: "answer",
              content: {
                text: "The things that matter most:",
                points: [
                  "Trust your instincts - you know your child best",
                  "Don't compare milestones - every child develops differently",
                  "Take time to just be present together"
                ]
              },
              pageNumber: 4
            }
          ]
        },
        {
          id: 3,
          name: "For When You're Older",
          recipient: "Both kids",
          description: "Wisdom for their teenage years and beyond",
          count: 4,
          color: "bg-purple-500",
          lastUpdated: "3 days ago",
          type: "book",
          pages: [
            {
              type: "question",
              content: "How should you handle heartbreak when it comes?",
              pageNumber: 1
            },
            {
              type: "answer",
              content: {
                text: "Though painful, heartbreak teaches valuable lessons:",
                points: [
                  "It's okay to grieve - don't rush the healing",
                  "Every ending makes space for new beginnings",
                  "Your worth isn't defined by any relationship"
                ]
              },
              pageNumber: 2
            },
            {
              type: "question",
              content: "What financial principles will serve you best?",
              pageNumber: 3
            },
            {
              type: "answer",
              content: {
                text: "Money management fundamentals:",
                points: [
                  "Live below your means and save consistently",
                  "Invest early - time is your greatest asset",
                  "True wealth is freedom, not possessions"
                ]
              },
              pageNumber: 4
            },
            {
              type: "question",
              content: "How do I want you to remember me?",
              pageNumber: 5
            },
            {
              type: "answer",
              content: {
                text: "I hope you remember:",
                points: [
                  "I loved you unconditionally, always",
                  "I did my best, even when I made mistakes",
                  "My greatest legacy is the people you become"
                ]
              },
              pageNumber: 6
            }
          ]
        }
      ];

      // Get unique topics and recipients for filters
      const allTopics = [...new Set(insights.flatMap(entry => entry.topics || []))];
      const allRecipients = individuals.map(person => person.id);

      // Mock RAG search function
      const performRAGSearch = async (query) => {
          setIsSearching(true);

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Filter logic (replace with actual RAG API call)
          const results = insights.filter(entry => {
              const matchesText = entry.text?.toLowerCase().includes(query.toLowerCase()) ||
                                entry.content?.toLowerCase().includes(query.toLowerCase()) ||
                                entry.question?.toLowerCase().includes(query.toLowerCase());

              const matchesTopics = selectedFilters.topics.length === 0 ||
                                  entry.topics?.some(topic => selectedFilters.topics.includes(topic));

              const matchesRecipients = selectedFilters.recipients.length === 0 ||
                                      entry.recipients?.some(id => selectedFilters.recipients.includes(id));

              const matchesType = selectedFilters.entryTypes.length === 0 ||
                                (selectedFilters.entryTypes.includes('draft') && entry.isDraft) ||
                                (selectedFilters.entryTypes.includes('voice') && entry.isVoiceNote) ||
                                (selectedFilters.entryTypes.includes('insight') && !entry.isDraft && !entry.isVoiceNote);

              return matchesText && matchesTopics && matchesRecipients && matchesType;
          });

          setSearchResults(results);
          setIsSearching(false);
      };

      const handleSearch = (e) => {
          e.preventDefault();
          if (searchQuery.trim()) {
              performRAGSearch(searchQuery);
          } else {
              setSearchResults([]);
          }
      };

      const toggleFilter = (filterType, value) => {
          setSelectedFilters(prev => ({
              ...prev,
              [filterType]: prev[filterType].includes(value)
                  ? prev[filterType].filter(item => item !== value)
                  : [...prev[filterType], value]
          }));
      };

      // Determine which entries to display
      const displayedEntries = searchQuery.trim() ? searchResults : insights;

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
          <Header />

          <div className="p-4">
            {/* New Search Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-white/50">
              {/* Combined search row */}
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your wisdom..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {isSearching ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                  aria-label={showFilters ? "Hide filters" : "Show filters"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </form>

              {/* Filters section */}
              {showFilters && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">FILTER BY:</span>
                    {allTopics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => toggleFilter('topics', topic)}
                        className={`px-2.5 py-1 rounded-full text-xs ${
                          selectedFilters.topics.includes(topic)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {allRecipients.map(id => {
                      const person = individuals.find(p => p.id === id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggleFilter('recipients', id)}
                          className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 ${
                            selectedFilters.recipients.includes(id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${person.color}`}></span>
                          {person.name}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {['insight', 'draft', 'voice'].map(type => (
                      <button
                        key={type}
                        onClick={() => toggleFilter('entryTypes', type)}
                        className={`px-2.5 py-1 rounded-full text-xs capitalize ${
                          selectedFilters.entryTypes.includes(type)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Results Summary */}
            {searchQuery.trim() && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {searchResults.length} results for "{searchQuery}"
                </h3>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setSelectedFilters({ topics: [], recipients: [], entryTypes: [] });
                  }}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Your Original Tab Navigation */}
            <div className="flex bg-white rounded-lg p-1 mb-6">
              <button
                onClick={() => setLibraryView('personal')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  libraryView === 'personal'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setLibraryView('shared')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  libraryView === 'shared'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Shared
              </button>
            </div>

            {/* Personal Library View */}
            {libraryView === 'personal' && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">Your Private Vault</h2>
                    <span className="text-sm text-gray-500">{displayedEntries.length} items</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Everything you've captured — finished thoughts, drafts, voice notes, and incomplete reflections.
                  </p>

                  <div className="space-y-4">
                    {displayedEntries.map(entry => (
                      <div
                        key={entry.id}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                      >
                        {/* Entry Header */}
                        <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                          <div className="flex-1 flex items-center space-x-2">
                            {entry.isDraft && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                Draft
                              </span>
                            )}
                            {entry.isVoiceNote && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                <Mic className="w-3 h-3 mr-1" /> Voice Note
                              </span>
                            )}
                            {!entry.isDraft && !entry.isVoiceNote && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" /> Insight
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                          </div>
                          {!entry.shared && !entry.isDraft && (
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              Share
                            </button>
                          )}
                        </div>

                        {/* Q&A Card */}
                        <div className="p-4">
                          {entry.question && (
                            <div className="mb-4">
                              <div className="flex items-center mb-1">
                                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Question</span>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-800">
                                {entry.question}
                              </div>
                            </div>
                          )}

                          <div className="">
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                                {entry.isDraft ? "Draft Content" : "Your Insight"}
                              </span>
                            </div>
                            <div className={`rounded-lg p-3 text-sm ${
                              entry.isDraft || entry.isVoiceNote
                                ? "bg-gray-50 italic text-gray-600"
                                : "bg-green-50 text-gray-800"
                            }`}>
                              {entry.text || entry.content || "No content yet"}
                            </div>
                          </div>
                        </div>

                        {/* Tags and Recipients */}
                        <div className="px-4 pb-3 pt-2 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {entry.topics?.map(topic => (
                              <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.recipients?.map(id => {
                              const person = individuals.find(p => p.id === id);
                              return (
                                <span key={person.id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  <span className={`w-2 h-2 rounded-full ${person.color} mr-1`}></span>
                                  {person.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Shared Library View */}
            {libraryView === 'shared' && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">Living Bookshelf</h2>
                    <span className="text-sm text-gray-500">{sharedBooks.length} books</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Curated collections and books you've created to share with your loved ones.
                  </p>

                  <div className="space-y-4">
                    {sharedBooks.map(book => (
                      <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="p-4">
                          <div className="flex items-start">
                            <div className={`w-12 h-12 rounded-lg ${book.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                              <Book className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 mb-1">{book.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{book.pages.length / 2} chapters</span>
                                <span>•</span>
                                <span>For {book.recipient}</span>
                                <span>•</span>
                                <span>Updated {book.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-3 border-t border-gray-100">
                          <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {book.recipient === 'Sage' ? 'S' : book.recipient === 'Cohen' ? 'B' : 'B'}
                                </span>
                              </div>
                              <span className="text-xs text-gray-600">
                                {book.recipient === 'Both kids' ? 'Shared with both children' : `Shared with ${book.recipient}`}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedBook(book);
                                setCurrentPage(0); // Reset to first page when opening a book
                              }}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800"
                            >
                              View Collection
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create New Book Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Heart className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-800">Create a New Book</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Turn your insights into a meaningful collection for someone special.
                  </p>
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                    onClick={() => setCurrentView('createBook')}
                  >
                    <Plus size={16} />
                    Start New Book
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Capture Modal */}
          {showCapture && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
                <div className={`p-6 relative ${captureMode === 'quick' ? 'bg-blue-50' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
                  <button
                    onClick={() => setShowCapture(false)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold">
                    {captureMode === 'quick' ? 'Daily Reflection' : 'Milestone Preparation'}
                  </h2>
                  <p className="text-sm mt-1 text-gray-600">
                    {captureMode === 'quick'
                      ? "Answer today's question in just 2 minutes"
                      : "Create lasting memories for this special occasion"}
                  </p>
                </div>

                <div className="p-6">
                  {captureMode === 'quick' ? (
                    <QuickCaptureFlow
                      onClose={() => setShowCapture(false)}
                    />
                  ) : (
                    <MilestoneFlow
                      onClose={() => setShowCapture(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Book Preview Modal - MOVED TO ROOT LEVEL */}
          {selectedBook && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${selectedBook.color} rounded-lg flex items-center justify-center shadow-lg`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800 tracking-wide">
                          {selectedBook.name}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">
                          For {selectedBook.recipient}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBook(null)}
                      className="w-10 h-10 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Book Content - Fixed size container */}
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
                  <div className="relative w-full max-w-md h-[500px]">
                    <div className={`relative bg-white rounded-lg shadow-xl border border-blue-200 h-full overflow-y-auto ${isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
                      {/* Current Page Content */}
                      <div className="p-8 h-full flex flex-col">
                        {selectedBook.pages[currentPage].type === 'question' ? (
                          <>
                            <div className="mb-6">
                              <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                  Question
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center min-h-[300px]">
                              <p className="text-lg text-blue-800 text-center italic">
                                {selectedBook.pages[currentPage].content}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-6">
                              <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                  Your Insight
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 min-h-[300px]">
                              <p className="text-blue-800 mb-4">
                                {selectedBook.pages[currentPage].content.text}
                              </p>
                              <ul className="space-y-2 text-blue-700">
                                {selectedBook.pages[currentPage].content.points.map((point, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}

                        <div className="mt-auto pt-4 text-center">
                          <span className="text-xs text-blue-300 font-medium">
                            Page {selectedBook.pages[currentPage].pageNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {currentPage > 0 && (
                    <button
                      onClick={() => flipPage('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {currentPage < selectedBook.pages.length - 1 && (
                    <button
                      onClick={() => flipPage('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Page Indicators */}
                <div className="flex justify-center py-3 bg-blue-50 border-t border-blue-100">
                  <div className="flex space-x-2">
                    {selectedBook.pages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => !isFlipping && setCurrentPage(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          idx === currentPage
                            ? 'bg-blue-600 scale-125'
                            : 'bg-blue-200 hover:bg-blue-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon-only Action Buttons */}
                <div className="flex justify-center gap-4 p-4 bg-blue-50 border-t border-blue-100">
                  <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Download PDF">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Print">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Order">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
  };

  const ProfileView = () => {
    const [expandedDisclosure, setExpandedDisclosure] = useState(null);

    const disclosures = [
      {
        id: 'terms',
        title: 'Terms of Use',
        icon: <BookOpen size={18} />,
        content: `
          <p class="mb-4"><strong>Effective Date:</strong> 1/1/2025<br>
          <strong>Last Updated:</strong> 1/1/2025</p>

          <p class="mb-4">Welcome to WellSaid. By using this app, you agree to the following Terms of Use. If you do not agree, please do not use the app.</p>

          <h4 class="font-semibold mt-4 mb-2">1. Purpose of the App</h4>
          <p class="mb-4">WellSaid helps users capture and reflect on meaningful life experiences and personal insights, using an AI assistant to support journaling and memory preservation.</p>

          <h4 class="font-semibold mt-4 mb-2">2. User Content</h4>
          <p class="mb-4">You retain ownership of all content you create. By using the app, you grant us a limited license to securely store and process your content to support app functionality. You are solely responsible for the accuracy and appropriateness of the content you enter.</p>

          <h4 class="font-semibold mt-4 mb-2">3. Personal Data and Contact Information</h4>
          <p class="mb-4">You may choose to share names, relationships, or personal information about yourself or others. You are responsible for obtaining consent where applicable. Content shared about others, especially children, should be thoughtful and respectful of their privacy.</p>

          <h4 class="font-semibold mt-4 mb-2">4. Account & Access</h4>
          <p class="mb-4">You may be required to create an account. You are responsible for maintaining the confidentiality of your login information. If you believe your account has been compromised, please notify us immediately.</p>

          <h4 class="font-semibold mt-4 mb-2">5. Termination</h4>
          <p class="mb-4">We reserve the right to suspend or terminate access for misuse or breach of these Terms.</p>

          <h4 class="font-semibold mt-4 mb-2">6. Governing Law</h4>
          <p class="mb-4">These terms are governed by the laws of the State of Texas, USA.</p>
        `
      },
      {
        id: 'privacy',
        title: 'Privacy Policy',
        icon: <Lock size={18} />,
        content: `
          <p class="mb-4"><strong>Effective Date:</strong> 1/1/2025</p>

          <h4 class="font-semibold mt-4 mb-2">1. What We Collect</h4>
          <p class="mb-4">We collect:</p>
          <ul class="list-disc pl-5 mb-4">
            <li>Information you provide (e.g. name, email, relationships)</li>
            <li>AI-assisted entries and transcripts</li>
            <li>Metadata (e.g. usage history)</li>
          </ul>
          <p class="mb-4">We do not collect biometric data, financial information, or device-level identifiers beyond what is required for functionality.</p>

          <h4 class="font-semibold mt-4 mb-2">2. Children's Data</h4>
          <p class="mb-4">This app is not directed at children under 13. However, adult users may reference children in their journal entries. These entries are stored securely and are not visible to others unless explicitly shared by the user. Users are responsible for using discretion when inputting identifying details about minors.</p>
          <p class="mb-4">We do not knowingly collect data directly from children. If we become aware that such data has been submitted in violation of our policies, we will delete it upon request.</p>

          <h4 class="font-semibold mt-4 mb-2">3. How We Use Your Data</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>To provide personalized AI-assisted reflections</li>
            <li>To improve the user experience</li>
            <li>For security and support</li>
          </ul>
          <p class="mb-4">We do not sell or share your personal data with third parties. All data is encrypted in transit and at rest.</p>

          <h4 class="font-semibold mt-4 mb-2">4. User Rights</h4>
          <p class="mb-4">You may request to delete your data or account by contacting us at [insert email]. We will respond within 30 days.</p>
        `
      },
      {
        id: 'ai-disclosure',
        title: 'AI Disclosure',
        icon: <Wand2 size={18} />,
        content: `
          <h4 class="font-semibold mt-4 mb-2">1. AI-Powered Content</h4>
          <p class="mb-4">WellSaid uses artificial intelligence to assist with journaling, prompts, and summaries. These outputs are automatically generated and may not always be accurate or complete. They are intended to support personal reflection, not replace professional advice or factual verification.</p>

          <h4 class="font-semibold mt-4 mb-2">2. Control of Inputs</h4>
          <p class="mb-4">Only the data you provide is used. The app does not access your device's microphone or contacts without explicit permission. The AI system does not make independent decisions or predictions — it only responds to your inputs.</p>

          <h4 class="font-semibold mt-4 mb-2">3. Accountability</h4>
          <p class="mb-4">You are responsible for the content you provide to the AI assistant, including any personally identifiable information about others. You are encouraged to use caution and good judgment when sharing sensitive or emotional content.</p>

          <div class="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p class="text-sm"><strong>NOTICE:</strong><br>
            This app uses artificial intelligence (AI) to support journaling and memory collection. AI-generated responses are private and based only on the content you choose to share. All data is encrypted. You control what is captured and may request deletion at any time.</p>
          </div>
        `
      }
    ];

    const toggleDisclosure = (id) => {
      setExpandedDisclosure(expandedDisclosure === id ? null : id);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
        <Header />

        <div className="p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-white/50 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl font-bold">{user.name.charAt(0)}</span>
            </div>
            <div className="font-semibold text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-500">Member since June 2025</div>

            <div className="flex justify-around mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="font-bold text-gray-800">{insights.filter(i => i.shared).length}</div>
                <div className="text-xs text-gray-500">Insights</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800">{individuals.length}</div>
                <div className="text-xs text-gray-500">People</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800">{collections.length}</div>
                <div className="text-xs text-gray-500">Books</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/50 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Settings size={20} className="text-gray-600 mr-3" />
                <span className="text-gray-800">Account Settings</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            <button className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/50 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Bell size={20} className="text-gray-600 mr-3" />
                <span className="text-gray-800">Notification Preferences</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            <button className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/50 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users size={20} className="text-gray-600 mr-3" />
                <span className="text-gray-800">Help & Support</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
              <div className="flex items-center mb-3">
                <Users size={20} className="text-gray-600 mr-3" />
                <span className="text-gray-800 font-medium">People</span>
              </div>
              {individuals.map(person => (
                <div key={person.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${person.color} flex items-center justify-center mr-3`}>
                      <span className="text-white text-sm font-bold">{person.avatar}</span>
                    </div>
                    <span className="text-gray-800">{person.name}</span>
                  </div>
                  <button className="text-blue-600 text-sm">Edit</button>
                </div>
              ))}
              <button className="w-full mt-3 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm">
                + Add Person
              </button>
            </div>

            {/* Legal Disclosures Accordion */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm overflow-hidden">
              <h3 className="p-4 text-gray-800 font-medium border-b border-gray-100">
                Legal Disclosures
              </h3>

              {disclosures.map((disclosure) => (
                <div key={disclosure.id} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => toggleDisclosure(disclosure.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{disclosure.icon}</span>
                      <span>{disclosure.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedDisclosure === disclosure.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedDisclosure === disclosure.id && (
                    <div className="px-4 pb-4">
                      <div
                        className="prose prose-sm text-gray-600"
                        dangerouslySetInnerHTML={{ __html: disclosure.content }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                // Clear auth state
                localStorage.removeItem('wellsaid-auth-state');
                // Navigate to login
                window.location.reload(); // This will restart the app flow at SplashScreen
              }}
              className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 text-red-600 text-center border border-white/50 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Single return statement
  return renderContent();

  return (
    <div className="relative">
      {renderView()}
      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowCaptureOptions={setShowCaptureOptions}
      />
    </div>
  );
};

export default WellSaidApp;
