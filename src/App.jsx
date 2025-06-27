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
          const newCollections = prev.COLLECTIONS?.includes(collectionId)
            ? prev.COLLECTIONS.filter(id => id !== collectionId)
            : [...(prev.COLLECTIONS || []), collectionId];
          return { ...prev, COLLECTIONS: newCollections };
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
                [...SYSTEM_COLLECTIONS, ...COLLECTIONS].map(collection => (
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
                  const collection = [...SYSTEM_COLLECTIONS, ...COLLECTIONS].find(c => c.id === collectionId);
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

    const filteredUserCollections = COLLECTIONS.filter(collection => {
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
      <div className={`relative z-0 ${!isActive ? 'opacity-70' : ''}`}>
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
          <div className="pl-4 border-l-2 border-gray-200 ml-5 relative z-0">
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
          <div className="flex bg-white rounded-lg p-1 mb-6 relative" style={{ zIndex: 0 }}>
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
            collections={COLLECTIONS}
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
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100] backdrop-blur-sm overflow-y-auto">
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
