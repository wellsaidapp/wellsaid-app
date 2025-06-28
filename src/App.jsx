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
      <div className="fixed inset-0 overflow-y-auto bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
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
            {COLLECTIONS.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Special Occasion Collections
                </h5>
                <div className="space-y-2">
                  {COLLECTIONS.map(collection => (
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
              <span className="text-white text-xl font-bold">{USER.name.charAt(0)}</span>
            </div>
            <div className="font-semibold text-gray-800">{USER.name}</div>
            <div className="text-sm text-gray-500">Member since June 2025</div>

            <div className="flex justify-around mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="font-bold text-gray-800">{INSIGHTS.filter(i => i.shared).length}</div>
                <div className="text-xs text-gray-500">Insights</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800">{INDIVIDUALS.length}</div>
                <div className="text-xs text-gray-500">People</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800">{COLLECTIONS.length}</div>
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
};

export default WellSaidApp;
