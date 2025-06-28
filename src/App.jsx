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
import 'react-image-crop/dist/ReactCrop.css';

// Assets
import logo from './assets/wellsaid.svg';
import animationData from './assets/animations/TypeBounce.json';
import WellSaidIcon from './assets/icons/WellSaidIcon';

// Components
import BookCreationModal from './components/library/BookCreation/BookCreationModal';
import LandingPage from './components/landingPage/LandingPage';
import SplashScreen from './components/landingPage/SplashScreen';
import Header from './components/appLayout/Header';
import BottomNav from './components/appLayout/BottomNav';
import HomeView from './components/home/HomeView';
import CaptureView from './components/capture/CaptureView';
import OrganizeView from './components/library/OrganizeView';
import ProfileView from './components/profileView/ProfileView';

// Constants
import { SHARED_BOOKS, getRecentBooks } from './constants/sharedBooks';
import { SYSTEM_COLLECTIONS } from './constants/systemCollections';
import { INDIVIDUALS } from './constants/individuals';
import { INSIGHTS } from './constants/insights';
import { COLLECTIONS } from './constants/collections';
import { USER } from './constants/user';

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
  const [showCapture, setShowCapture] = useState(false);
  const [captureMode, setCaptureMode] = useState('quick');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [individuals, setIndividuals] = useState(INDIVIDUALS);
  const [insights, setInsights] = useState(INSIGHTS);

  const resetForm = () => {
    setNewInsight('');
    setSelectedRecipients([]);
    setSelectedTopics([]);
  };
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [questionSet, setQuestionSet] = useState([]);
  const [newInsight, setNewInsight] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const [prompts] = useState([
    "What's the most important lesson you've learned recently?",
    "What's something your children should know about handling failure?",
    "What do you wish someone had told you at their age?",
    "What's a family tradition you want to continue?",
    "What's your best advice about friendship?"
  ]);

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
          currentView={currentView}
        />;
      case 'capture':
        return <CaptureView
          captureMode={captureMode}
          setCurrentView={setCurrentView}
          resetForm={resetForm}
        />;
      case 'library':
        return <OrganizeView
          insights={insights}
          individuals={individuals}
          startQuickCaptureFromCollection={startQuickCaptureFromCollection}
          setCurrentView={setCurrentView}
          setInsights={setInsights}
          setIndividuals={setIndividuals}
        />;
      case 'people':
        return <LibraryView resetForm={resetForm} />;
      case 'profile':
        return <ProfileView
          insights={insights}
          individuals={individuals}
          collections={COLLECTIONS}
          user={USER}
          setCurrentView={setCurrentView}
        />;
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
          <div className="fixed inset-0 flex items-center justify-center bg-white overflow-y-auto">
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
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
              {/* Login form content */}
            </div>
          </div>
        );

      case 'loggedIn':
      default:
      return (
        <div className="relative min-h-screen overflow-y-auto">
          <main className="flex-grow">
            {renderView()}
          </main>
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
                      {COLLECTIONS.filter(c => c.recipient === selectedPerson.name).length}
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
  return renderContent();
};

export default WellSaidApp;
