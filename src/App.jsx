// Imports
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox, Trash2, Save, GripVertical, Bookmark, CheckCircle,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download, ImageIcon,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { createPortal } from 'react-dom';
import { Image } from 'antd';
import { Switch } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // Important for styling

// Assets
import logo from './assets/wellsaid.svg';
import animationData from './assets/animations/TypeBounce.json';
import WellSaidIcon from './assets/icons/WellSaidIcon';

// Components
import BookCreationModal from './components/library/BookCreation/BookCreationModal';
import LandingPage from './components/landingPage/LandingPage';
import SplashScreen from './components/landingPage/SplashScreen';
import Header from './components/appLayout/Header';

// Constants
import { SHARED_BOOKS, getRecentBooks } from './constants/sharedBooks';
import { SYSTEM_COLLECTIONS } from './constants/systemCollections';
import { INDIVIDUALS } from './constants/individuals';

const WellSaidApp = () => {
  const [authState, setAuthState] = useState('checking'); // 'checking', 'new', 'returning', 'loggedIn'
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentTopic, setCurrentTopic] = useState(null); // Add this line
  const startQuickCaptureFromCollection = (collection) => {
    const topicName = collection.name; // or map it to a standard topic if needed

    const topicObject = {
      name: topicName,
      tags: [topicName.toLowerCase()], // could add predefined tags if needed
    };

    setCurrentTopic(topicObject); // sets context for quick capture
    setConversationState('quick_capture_response'); // enter quick capture flow

    typeMessage(`Let’s capture something related to ${topicName}.`, true);
    typeMessage("What’s something you’ve realized or learned recently in this area?", true, 500);

    scrollToBottom();
  };

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
  const [individuals, setIndividuals] = useState(INDIVIDUALS);
  const [insights, setInsights] = useState([
    // Entry for Sage's Summer Intensive
    {
      id: 1,
      question: "What are you most excited about for your summer intensive?",
      text: "I'm really looking forward to learning new techniques from professional dancers and pushing myself beyond my current limits.",
      date: '2025-06-01',
      collections: ['sage-summer-intensive', 'fitness-sports', 'personal-growth'],
      recipients: [1] // Assuming ID 1 is Sage
    },

    // Entry for Cohen's Birthday
    {
      id: 2,
      question: "What would make your 17th birthday truly special?",
      text: "I'd love a small gathering with close friends, maybe some video games and pizza. No big party this year.",
      date: '2025-11-15',
      collections: ['cohens-birthday', 'events-celebrations', 'family'],
      recipients: [2] // Assuming ID 2 is Cohen
    },

    // Unorganized entries (voice note and draft examples)
    {
      id: 3,
      question: "A reflection for Sage before her summer intensive begins",
      text: "I know you’re feeling a mix of nerves and excitement — and that’s exactly where growth happens. Trust yourself and let this experience shape you in ways you can’t yet imagine.",
      date: '2025-05-28',
      collections: ['sage-summer-intensive', 'fitness-sports', 'personal-growth'],
      recipients: [1] // Assuming ID 1 is Sage
    },
    {
      id: 4,
      question: "A note for Cohen’s 17th birthday",
      text: "Seventeen suits you. You’ve grown into a thoughtful, funny, and driven young man — and I’m proud of the way you carry yourself in the world. Here’s to another year of discovering who you’re becoming.",
      date: '2025-11-10',
      collections: ['family', 'cohens-birthday', 'personal-growth'],
      recipients: [2] // Assuming ID 2 is Cohen
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
        return <OrganizeView
          resetForm={resetForm}
          startQuickCaptureFromCollection={startQuickCaptureFromCollection}
        />;
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

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

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
    // Get the 2 most recent books
    const recentBooks = getRecentBooks(2);
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
                {recentBooks.map(book => (
                  <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className={`w-12 h-12 rounded-lg ${book.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                          <Book className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{book.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{book.description}</p>
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
      const [currentTopic, setCurrentTopic] = useState(null);
      const [showPeopleSelection, setShowPeopleSelection] = useState(false);
      const [showOccasionConfirmation, setShowOccasionConfirmation] = useState(false);
      const [userProfile, setUserProfile] = useState({
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
          { id: '1', name: 'Sage', relationship: 'daughter' },
          { id: '2', name: 'Cohen', relationship: 'son' }
        ]
      });

      // Sample data
      const people = [
        { id: '1', name: 'Sage', relationship: 'daughter', interests: 'ballet, dance' },
        { id: '2', name: 'Cohen', relationship: 'son', interests: 'business, basketball' }
      ];

      // NEW: Person creation state
      const [newPersonData, setNewPersonData] = useState({
          name: '',
          relationship: '',
          interests: '',
          collections: []
      });

      // NEW: Special Occasion state
      const [occasion, setOccasion] = useState({
          type: '',
          date: '',
          person: null, // Changed to store the selected person object
          reflections: [],
          currentQuestionIndex: 0,
          questions: [],
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

      // NEW: Start person creation flow
      const startPersonCreation = () => {
          setConversationState('person_creation_name');
          typeMessage("Let's add someone new to your circle.", true);
          typeMessage("First, what's their name?", true, 1000);
      };

      // NEW: Handle person creation responses
      const handlePersonCreation = (input) => {
          if (conversationState === 'person_creation_name') {
              setNewPersonData(prev => ({ ...prev, name: input }));
              setConversationState('person_creation_relationship');
              typeMessage(`Thanks. How are you related to ${input}?`, true);
              typeMessage("(e.g., 'daughter', 'friend', 'colleague')", true, 1000);
          }
          else if (conversationState === 'person_creation_relationship') {
              setNewPersonData(prev => ({ ...prev, relationship: input }));
              setConversationState('person_creation_interests');
              typeMessage("What topics or interests would you like to share with them?", true);
              typeMessage("(e.g., 'parenting advice', 'life lessons', 'funny stories')", true, 1000);
          }
          else if (conversationState === 'person_creation_interests') {
              setNewPersonData(prev => ({ ...prev, interests: input }));
              setConversationState('person_creation_complete');

              // Generate a simple ID for the new person
              const newId = `person-${Date.now()}`;
              const newPerson = {
                  id: newId,
                  name: newPersonData.name,
                  relationship: newPersonData.relationship,
                  interests: input
              };

              // Update user profile with new person
              setUserProfile(prev => ({
                  ...prev,
                  people: [...prev.people, newPerson]
              }));

              // Clear the new person data
              setNewPersonData({
                  name: '',
                  relationship: '',
                  interests: '',
                  collections: []
              });

              typeMessage(`Great! ${newPersonData.name} has been added to your circle.`, true);
              typeMessage("Now, let's continue with the special occasion.", true, 1000);

              // Set this person as the occasion recipient
              setOccasion(prev => ({
                  ...prev,
                  person: newPerson
              }));

              // Move to occasion type selection
              setConversationState('milestone_type');
              typeMessage("What type of occasion is this for them?", true);
              typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1000);
          }
      };

      // NEW: Show person selection UI
      const showPersonSelection = () => {
          if (userProfile.people.length === 0) {
              startPersonCreation();
              return;
          }

          setConversationState('person_selection');
          typeMessage("Who is this special occasion for?", true);

          // Create a message showing all people with their relationships
          let peopleList = "Your circle:\n";
          userProfile.people.forEach((person, index) => {
              peopleList += `${index + 1}. ${person.name} (${person.relationship})\n`;
          });
          peopleList += "\nType the number or name, or say 'new' to add someone.";

          typeMessage(peopleList, true, 500);
      };

      const handlePersonSelect = (person) => {
        setOccasion(prev => ({
          ...prev,
          person: person
        }));
        setShowPeopleSelection(false);
        setConversationState('milestone_type');
        typeMessage(`Got it. This is for ${person.name}.`, true);
        typeMessage("What type of occasion is this?", true, 1000);
        typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1500);
      };

      // NEW: Start adding new person
      const startAddNewPerson = () => {
          setShowPeopleSelection(false);
          startPersonCreation();
      };

      // NEW: Show occasion confirmation card
      const triggerOccasionConfirmation = () => {
          if (!occasion.person || !occasion.type) return;

          const occasionName = occasionTypes[occasion.type]?.name || occasion.type;
          let confirmationMessage = `\n**Special Occasion Details**\n`;
          confirmationMessage += `• For: ${occasion.person.name} (${occasion.person.relationship})\n`;
          confirmationMessage += `• Occasion: ${occasionName}\n`;
          confirmationMessage += occasion.date ? `• Date: ${occasion.date}\n` : `• Date: Sometime in the future\n`;
          confirmationMessage += `\nType 'confirm' to continue or edit any detail.`;

          setConversationState('occasion_confirmation');
          typeMessage(confirmationMessage, true);
      };

      // NEW: Handle occasion confirmation
      const handleOccasionConfirmation = (input) => {
          const normalizedInput = input.toLowerCase().trim();

          if (normalizedInput === 'confirm') {
              setConversationState('milestone_theme');
              typeMessage("Occasion confirmed! Would you like help reflecting on something specific?", true);
              typeMessage("Like a memory, advice, or how you've seen them grow? Or should I guide you with questions?", true, 1500);
              return;
          }

          // Check for edit requests
          if (normalizedInput.includes('for') || normalizedInput.includes('person')) {
              showPersonSelection();
          }
          else if (normalizedInput.includes('type') || normalizedInput.includes('occasion')) {
              setConversationState('milestone_type');
              typeMessage("What type of occasion is this?", true);
              typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1000);
          }
          else if (normalizedInput.includes('date') || normalizedInput.includes('when')) {
              setConversationState('milestone_date');
              typeMessage("When is this occasion happening? (e.g., 'next month', 'June 15th', 'sometime next year')", true);
          }
          else {
              typeMessage("I didn't understand that. Please say 'confirm' to continue or specify what to edit.", true);
          }
      };

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

      const startMilestoneSelection = () => {
        setConversationState('milestone_init');
        setShowPeopleSelection(true);

        typeMessage("Let's create something meaningful for a special occasion.", true);

        if (userProfile.people.length > 0) {
          typeMessage("Who is this special occasion for? Tap on a person below or add someone new.", true);
        } else {
          typeMessage("You haven't added anyone to your circle yet. Let's add someone first.", true);
        }
      };

      // Modified handleMilestoneInit to handle person selection
      const handleMilestoneInit = (input) => {
          showPersonSelection();
      };

      const handleOccasionTypeSelection = (input) => {
        const detectedType =
          input.includes('wedding') ? 'wedding' :
          input.includes('birthday') ? 'birthday' :
          input.includes('graduation') ? 'graduation' :
          input.toLowerCase().trim();

        setOccasion(prev => ({
          ...prev,
          type: detectedType
        }));

        setConversationState('milestone_date');
        typeMessage(`Got it. This is a ${detectedType === 'custom' ? 'special occasion' : detectedType}.`, true);
        typeMessage("When is it happening? (e.g., 'next month', 'June 15th', or 'sometime in the future')", true, 1500);
      };

      const handleOccasionDateSelection = (input) => {
        setOccasion(prev => ({
          ...prev,
          date: input
        }));

        // Now show the confirmation card after all questions are answered
        setConversationState('occasion_confirmation');
        setShowOccasionConfirmation(true);
        typeMessage("Here's what we have so far:", true);
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

      const handleSpecialOccasionResponse = (input) => {
        const entry = {
          text: input,
          author: 'user',
          date: new Date().toISOString(),
          collection: 'milestone',
          occasionDetails: occasion,
        };

        // Wrap up and return to neutral state
        typeMessage(`Got it — your message for ${occasion.person.name} has been saved.`, true);
        setConversationState('confirming'); // or 'idle', 'home', etc.
        // Optional: thank the user
        typeMessage(`Thanks for sharing that — it’s been added to your collection.`, true);

        // Give it a moment before transitioning
        setTimeout(() => {
          setCurrentView('home');
        }, 4000); // slight delay for smooth UX
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

        // Person management states
        if (conversationState === 'person_selection') {
            handlePersonSelection(input);
        }
        else if (conversationState.startsWith('person_creation')) {
            handlePersonCreation(input);
        }
        // Occasion creation states
        else if (conversationState === 'milestone_type') {
            handleOccasionTypeSelection(input);
        }
        else if (conversationState === 'milestone_date') {
            handleOccasionDateSelection(input);
        }
        else if (conversationState === 'occasion_confirmation') {
            handleOccasionConfirmation(input);
        }
        // Rest of your existing state handlers
        else if (conversationState === 'milestone_complete') {
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
        else if (conversationState === 'special_occasion_active') {
          handleSpecialOccasionResponse(input);
        }
      };

      const startQuickCapture = () => {
        // Use the currentTopic if it exists, otherwise select random
        const topic = currentTopic ||
          userProfile.topics[Math.floor(Math.random() * userProfile.topics.length)];

        setCurrentTopic(topic);
        setConversationState('quick_capture_response');

        typeMessage("Let's capture a quick insight!", true);
        typeMessage(topic.prompt || `Share your thoughts about ${topic.name}...`, true, 1500);
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

    const startOccasionFlow = (occasion) => {
      if (!occasion?.person?.name || !occasion?.type) return;

      // Step 1: Friendly intro
      typeMessage(`Thanks! Let’s start capturing something meaningful for ${occasion.person.name}.`, true);

      // Step 2: Occasion-specific question
      const promptByOccasionType = {
        wedding: `What advice or wisdom would you want ${occasion.person.name} to carry with them into marriage?`,
        birthday: `What do you appreciate most about ${occasion.person.name} at this stage in life?`,
        graduation: `What do you hope ${occasion.person.name} remembers as they begin this next chapter?`,
        anniversary: `What memories stand out to you from the journey with ${occasion.person.name}?`,
        birth: `What values or truths do you hope will shape ${occasion.person.name} as they grow up?`,
        other: `What insight or reflection do you want to share with ${occasion.person.name} during this milestone?`
      };

      const nextPrompt = promptByOccasionType[occasion.type] || promptByOccasionType.other;
      typeMessage(nextPrompt, true);

      // Step 3: Set conversation state
      setConversationState('special_occasion_active');
      setShowOccasionConfirmation(false); // Hide modal
      setShowPeopleSelection(false);      // Close people selection UI
    };

    const handleConfirmation = () => {
      if (!occasion?.person?.name || !occasion?.type) return;

      const promptByOccasionType = {
        wedding: `What advice or wisdom would you want ${occasion.person.name} to carry with them into marriage?`,
        birthday: `What do you appreciate most about ${occasion.person.name} at this stage in life?`,
        graduation: `What do you hope ${occasion.person.name} remembers as they begin this next chapter?`,
        anniversary: `What memories stand out to you from the journey with ${occasion.person.name}?`,
        birth: `What values or truths do you hope will shape ${occasion.person.name} as they grow up?`,
        other: `What insight or reflection do you want to share with ${occasion.person.name} during this milestone?`
      };

      const occasionLabel = promptByOccasionType[occasion.type] ? occasion.type : 'other';
      const followUpPrompt = promptByOccasionType[occasionLabel];

      // 1. Close modal
      setShowOccasionConfirmation(false);

      // 2. Set conversation context
      setConversationState('special_occasion_active');

      // 3. Send intro + question
      typeMessage(`Thanks! Let’s start capturing something meaningful for ${occasion.person.name}.`, true);
      typeMessage(followUpPrompt, true);

      // 4. Scroll down
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    // NEW: Handle edit action
    const handleEdit = (field) => {
        setShowOccasionConfirmation(false);

        switch(field) {
            case 'person':
                setShowPeopleSelection(true);
                break;
            case 'type':
                setConversationState('milestone_type');
                typeMessage("What type of occasion is this?", true);
                typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1000);
                break;
            case 'date':
                setConversationState('milestone_date');
                typeMessage("When is this occasion happening?", true);
                typeMessage("(e.g., 'next month', 'June 15th', 'sometime in the future')", true, 1000);
                break;
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

        // Person management states
        case 'person_selection':
            return "Type the number or name, or 'new' to add someone";
        case 'person_creation_name':
            return "Enter their name...";
        case 'person_creation_relationship':
            return "Describe your relationship...";
        case 'person_creation_interests':
            return "What topics would you share with them?";

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
            return "e.g., 'My daughter's wedding'";
        case 'milestone_confirm':
            return "Tell me who and when (e.g., 'Sage's wedding in October')";
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

    useEffect(() => {
      const ready =
        occasion.person &&
        occasion.type &&
        (occasion.date || occasion.date === null);

      if (ready) {
        setShowOccasionConfirmation(true);
      }
    }, [occasion]);

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

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pb-[136px] px-4">
            {/* Messages container */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isBot ? 'bg-gray-100 text-gray-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    }`}>
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
              </div>
            </div>

            {/* People Selection UI - appears below messages */}
            {showPeopleSelection && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">People in your circle</h3>
                  <span className="text-sm text-gray-500">{userProfile.people.length} added</span>
                </div>

                {userProfile.people.length > 0 ? (
                  userProfile.people.map((person, index) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handlePersonSelect(person)}
                    >
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

                <button
                  onClick={startAddNewPerson}
                  className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Person
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Occasion Confirmation Card - appears below messages or people selection */}
        {showOccasionConfirmation &&
          occasion.person &&
          occasion.type &&
          (occasion.date || occasion.date === null) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white rounded-2xl shadow-lg p-6 mx-4 w-full max-w-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Special Occasion Details</h2>

              <div className="text-left mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {occasion.person.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {occasion.person.relationship}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit('person')}
                    className="text-blue-500 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-medium text-gray-800">
                    {occasionTypes[occasion.type]?.name || occasion.type}
                  </p>
                  <button
                    onClick={() => handleEdit('type')}
                    className="text-blue-500 text-sm font-medium mt-1"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">
                    {occasion.date || "Sometime in the future"}
                  </p>
                  <button
                    onClick={() => handleEdit('date')}
                    className="text-blue-500 text-sm font-medium mt-1"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button
                onClick={handleConfirmation}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-8 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
              >
                Confirm & Continue
              </button>
              </div>
          </div>
        )}

        {/* Input Area - Fixed positioning */}
        {conversationState !== 'milestone_init' && (
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
        )}

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
                  Special Occasion Collections
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
    const [entries, setEntries] = useState([]);
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
    const [showBookCreation, setShowBookCreation] = useState(false)
    const [currentView, setCurrentView] = useState('collections');
    const [collectionFilter, setCollectionFilter] = useState('all'); // 'all', 'person', or 'occasion'
    const [coverImageState, setCoverImageState] = useState({
      tempImage: null,
      showCropModal: false
    });
    const updateEntry = (updatedEntry) => {
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === updatedEntry.id ? updatedEntry : entry
        )
      );
    };
    const stableSetNewBook = useCallback((updater) => {
      setNewBook(updater);
    }, []);
    const [bookCreationStep, setBookCreationStep] = useState(0);
    const [newBook, setNewBook] = useState({
      title: '',
      description: '',
      selectedCollections: [],
      selectedEntries: [],
      coverImage: null,
      backCoverNote: '',
      recipient: null,
      showTags: true,
      fontStyle: 'serif',
      isDraft: false
    });
    const [tempCoverImage, setTempCoverImage] = useState(null);
    const [croppedCoverImage, setCroppedCoverImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [showCropModal, setShowCropModal] = useState(false);
    const [entryOrder, setEntryOrder] = useState([]);

    const handleStartNewBook = useCallback(() => {
      // Only reset newBook if it's the *first* time
      if (!showBookCreation) {
        setNewBook({
          title: '',
          description: '',
          selectedCollections: [],
          selectedEntries: [],
          coverImage: null,
          backCoverNote: '',
          recipient: null,
          showTags: true,
          fontStyle: 'serif',
          isDraft: false
        });
        setEntryOrder([]);
        setBookCreationStep(0);
      }

      setShowBookCreation(true);
    }, [showBookCreation]);

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

    const [editingId, setEditingId] = useState(null);
    const [editedEntry, setEditedEntry] = useState(null);

    const renderEntryCard = (entry) => {
      const isEditing = editingId === entry.id;
      const currentEntry = isEditing ? editedEntry : entry;

      const handleChange = (field, value) => {
        setEditedEntry(prev => ({ ...prev, [field]: value }));
      };

      const handleCollectionToggle = (collectionId) => {
        setEditedEntry(prev => {
          const newCollections = prev.collections?.includes(collectionId)
            ? prev.collections.filter(id => id !== collectionId)
            : [...(prev.collections || []), collectionId];
          return { ...prev, collections: newCollections };
        });
      };

      const handleRecipientToggle = (recipientId) => {
        setEditedEntry(prev => {
          const newRecipients = prev.recipients?.includes(recipientId)
            ? prev.recipients.filter(id => id !== recipientId)
            : [...(prev.recipients || []), recipientId];
          return { ...prev, recipients: newRecipients };
        });
      };

      const saveChanges = () => {
        // Call your API or state update function here
        updateEntry(currentEntry); // You'll need to implement this
        setEditingId(null);
      };

      const cancelEditing = () => {
        setEditingId(null);
      };

      const deleteEntry = () => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
          deleteEntry(entry.id); // You'll need to implement this
        }
      };

      return (
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

            {/* Action buttons - now with icons */}
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setEditedEntry({ ...entry });
                      setEditingId(entry.id);
                    }}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={deleteEntry}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={saveChanges}
                    className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    aria-label="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    aria-label="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Question */}
            {currentEntry.question && (
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Question</span>
                </div>
                {isEditing ? (
                  <textarea
                    value={currentEntry.question}
                    onChange={(e) => handleChange('question', e.target.value)}
                    className="w-full bg-blue-50 rounded-lg p-3 text-sm text-gray-800 border border-blue-200"
                  />
                ) : (
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-800">
                    {currentEntry.question}
                  </div>
                )}
              </div>
            )}

            {/* Answer */}
            <div>
              <div className="flex items-center mb-1">
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                  {currentEntry.isDraft ? "Draft Content" : "Answer"}
                </span>
              </div>
              {isEditing ? (
                <textarea
                  value={currentEntry.text || currentEntry.content || ""}
                  onChange={(e) => handleChange(entry.text ? 'text' : 'content', e.target.value)}
                  className={`w-full rounded-lg p-3 text-sm ${
                    currentEntry.isDraft || currentEntry.isVoiceNote
                      ? "bg-gray-50 italic text-gray-600 border border-gray-200"
                      : "bg-green-50 text-gray-800 border border-green-200"
                  }`}
                />
              ) : (
                <div className={`rounded-lg p-3 text-sm ${
                  currentEntry.isDraft || currentEntry.isVoiceNote
                    ? "bg-gray-50 italic text-gray-600"
                    : "bg-green-50 text-gray-800"
                }`}>
                  {currentEntry.text || currentEntry.content || "No content yet"}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-3 pt-2 border-t border-gray-100">
            {/* Collections */}
            <div className="flex flex-wrap gap-2 mb-2">
              {isEditing ? (
                [...SYSTEM_COLLECTIONS, ...collections].map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionToggle(collection.id)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      currentEntry.collections?.includes(collection.id)
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {collection.name}
                  </button>
                ))
              ) : (
                currentEntry.collections?.map(collectionId => {
                  const collection = [...SYSTEM_COLLECTIONS, ...collections].find(c => c.id === collectionId);
                  return collection ? (
                    <span key={collectionId} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {collection.name}
                    </span>
                  ) : null;
                })
              )}
            </div>

            {/* Recipients */}
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                individuals.map(person => (
                  <button
                    key={person.id}
                    onClick={() => handleRecipientToggle(person.id)}
                    className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      currentEntry.recipients?.includes(person.id)
                        ? "bg-blue-800 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${person.color} mr-1`}></span>
                    {person.name}
                  </button>
                ))
              ) : (
                currentEntry.recipients?.map(id => {
                  const person = individuals.find(p => p.id === id);
                  return person ? (
                    <span key={person.id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      <span className={`w-2 h-2 rounded-full ${person.color} mr-1`}></span>
                      {person.name}
                    </span>
                  ) : null;
                })
              )}
            </div>
          </div>
        </div>
      );
    };

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

    const startQuickCaptureFromCollection = (collection) => {
      const topicName = collection.name; // or map it to a standard topic if needed

      const topicObject = {
        name: topicName,
        tags: [topicName.toLowerCase()], // could add predefined tags if needed
      };

      setCurrentTopic(topicObject); // sets context for quick capture
      setCaptureMode('quick');
      setCurrentView('capture');
      setShowCaptureOptions(false); // ensure capture options don't show

      // You may need to reset conversation state
      setConversationState('quick_capture_response');

      // Pre-populate with a relevant prompt
      typeMessage(`Let's capture something related to ${topicName}.`, true);
      typeMessage("What's something you've realized or learned recently in this area?", true, 500);

      scrollToBottom();
    };

    const CollectionItem = ({
      collection,
      entries,
      isActive,
      expanded,
      onToggle,
      showRecipient = false,
      onAddToCollection
    }) => (
      <div className={`${!isActive ? 'opacity-70' : ''}`}>
        <div
          onClick={isActive ? onToggle : () => onAddToCollection(collection)}
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
              {!isActive && (  // Only show "+ New" button for inactive collections
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startQuickCaptureFromCollection(collection);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                  aria-label={`Add to ${collection.name}`}
                >
                  <PlusCircle className="w-5 h-5 text-blue-700" />
                  <span className="ml-1">Capture</span>
                </button>
              )}
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
          <div className="pl-4 border-l-2 border-gray-200 ml-5">
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
                  placeholder="Search your insight..."
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
          <div className="flex bg-white rounded-lg p-1 mb-6 relative z-0">
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
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Special Occasion Collections</h3>
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
                        onAddToCollection={startQuickCaptureFromCollection}
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
                  <span className="text-sm text-gray-500">{SHARED_BOOKS.length} books</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Curated collections and books you've created to share with your loved ones.
                </p>

                <div className="space-y-4">
                  {SHARED_BOOKS.map(book => (
                    <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <div className="p-4">
                        <div className="flex items-start">
                          <div className={`w-12 h-12 rounded-lg ${book.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                            <Book className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{book.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-3 border-t border-gray-100">
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {book.recipient?.charAt(0).toUpperCase() || 'B'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600">
                              {`Shared with ${book.recipient}`}
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
                  Turn your insights into a meaningful book for someone special.
                </p>

                {/* Step 3 Preview (when in arrange mode) */}
                {currentView === 'arrangeBook' && (
                  <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-800 mb-3">Arrange Your Pages</h4>
                    <div className="space-y-2">
                      {entryOrder.slice(0, 3).map((entryId, index) => {
                        const entry = insights.find(e => e.id === entryId);
                        if (!entry) return null;

                        return (
                          <div key={entryId} className="flex items-center p-2 bg-gray-50 rounded">
                            <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700 truncate">
                              {entry.question || entry.text || `Page ${index + 1}`}
                            </span>
                          </div>
                        );
                      })}
                      {entryOrder.length > 3 && (
                        <div className="text-center text-sm text-gray-500">
                          + {entryOrder.length - 3} more pages
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setBookCreationStep(3)} // Continue to next step
                      className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
                    >
                      Continue Arranging
                    </button>
                  </div>
                )}

                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                  onClick={handleStartNewBook}
                >
                  <Plus size={16} />
                  {currentView === 'arrangeBook' ? 'Continue Book Creation' : 'Start New Book'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Book Creation Modal */}
        {showBookCreation && (
          <BookCreationModal
            onClose={() => setShowBookCreation(false)}
            newBook={newBook}
            setNewBook={setNewBook}
            bookCreationStep={bookCreationStep}
            setBookCreationStep={setBookCreationStep}
            entryOrder={entryOrder}
            setEntryOrder={setEntryOrder}
            individuals={individuals}
            insights={insights}
            SYSTEM_COLLECTIONS={SYSTEM_COLLECTIONS}
            collections={collections}
            groupedEntries={groupedEntries}
            currentView={currentView}
            setCurrentView={setCurrentView}
            coverImageState={coverImageState}
            setCoverImageState={setCoverImageState}
          />
        )}

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
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        setIsSearching(true);
        // Simulate search delay
        setTimeout(() => setIsSearching(false), 500);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
        <Header />

        <div className="p-4">
          {/* Search Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-white/50">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your people..."
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
            </form>
          </div>

          {/* People Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your People</h2>
              <span className="text-sm text-gray-500">{individuals.length} people</span>
            </div>

            <div className="space-y-3">
              {individuals.map(person => (
                <div
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${person.color} flex items-center justify-center mr-3`}>
                      <span className="text-white text-sm font-medium">{person.avatar}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{person.name}</div>
                      <div className="text-xs text-gray-500">
                        {insights.filter(i => i.recipients?.includes(person.id)).length} insights shared
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              ))}

              <button className="w-full mt-2 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} />
                Add New Person
              </button>
            </div>
          </div>

          {/* Person Detail View */}
          {selectedPerson && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-blue-600 flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <h2 className="text-lg font-semibold text-gray-800">{selectedPerson.name}</h2>
                <div className="w-6"></div> {/* Spacer */}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-20 h-20 rounded-full ${selectedPerson.color} flex items-center justify-center`}>
                    <span className="text-white text-2xl font-medium">{selectedPerson.avatar}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-6">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="font-bold text-blue-600">
                      {insights.filter(i => i.recipients?.includes(selectedPerson.id)).length}
                    </div>
                    <div className="text-xs text-gray-600">Insights</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="font-bold text-green-600">
                      {collections.filter(c => c.recipient === selectedPerson.name).length}
                    </div>
                    <div className="text-xs text-gray-600">Books</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="font-bold text-purple-600">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-600">Last shared</div>
                  </div>
                </div>

                <h3 className="font-medium text-gray-800">Recent Insights</h3>
                {insights
                  .filter(i => i.recipients?.includes(selectedPerson.id))
                  .slice(0, 3)
                  .map(insight => (
                    <div key={insight.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-800 line-clamp-2">
                        {insight.question && (
                          <span className="font-medium">Q: {insight.question}</span>
                        )}
                        {insight.text && <p>{insight.text}</p>}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(insight.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Share New Insight
                </button>
              </div>
            </div>
          )}
        </div>
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
