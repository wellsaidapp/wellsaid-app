// Imports
import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, ArrowRight, Pencil, Zap, Clock,
  Sparkles, Calendar, Trophy, Book, BookOpen, X, ChevronLeft, ChevronRight,
  Download, Printer, ShoppingCart, Plus, MoreHorizontal, Share2, Edit
} from 'lucide-react';

// Constants
import { SHARED_BOOKS, getRecentBooks } from '../../constants/sharedBooks';
import { INSIGHTS } from '../../constants/insights';
import { USER } from '../../constants/user';
import { UPCOMING_EVENTS } from '../../constants/upcomingEvents';
import { INDIVIDUALS } from '../../constants/individuals';
import { COLLECTIONS } from '../../constants/collections';
import { OCCASION_QUESTIONS } from '../../constants/occasionQuestions';

import Header from '../appLayout/Header';
import CaptureOptionsModal from '../capture/CaptureOptionsModal';
import CaptureView from '../capture/CaptureView';


const HomeView = ({
  showCaptureOptions,
  setShowCaptureOptions,
  setCurrentView,
  setCaptureMode,
  currentView // Add this prop
}) => {
  const [insights, setInsights] = useState(INSIGHTS);
  const todayInsights = insights.filter(i => i.date === '2025-06-16' && i.shared).length;
  const weekInsights = insights.filter(i => i.shared).length;
  const weeklyGoal = 5;
  const progressPercent = (weekInsights / weeklyGoal) * 100;
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const recentBooks = getRecentBooks(2);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [questionSet, setQuestionSet] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resetForm = () => {
    setSelectedOccasion(null);
    setQuestionSet([]);
    setCurrentQuestion('');
    setCurrentQuestionIndex(0);
  };
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

  if (currentView === 'capture') {
    return (
      <CaptureView
        selectedOccasion={selectedOccasion}
        questionSet={questionSet}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        setCurrentView={setCurrentView}
        captureMode={captureMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20 overflow-y-auto">
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
            <h1 className="text-xl font-bold mb-3">Good morning, {USER.name.split(' ')[0]}!</h1>
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
        {UPCOMING_EVENTS.length > 0 && (
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Calendar size={20} className="mr-2 text-white/90" />
              <h3 className="font-semibold text-white drop-shadow-md">Upcoming Occasions</h3>
            </div>
            <div className="space-y-3">
              {UPCOMING_EVENTS.slice(0, 2).map(event => (
                <button
                  key={event.id}
                  onClick={() => {
                    console.log('--- STARTING OCCASION FLOW ---');
                    console.log('Event clicked:', event.name);
                    // Determine occasion type based on event name
                    let occasionType = 'milestone';
                    if (event.name.includes('Birthday')) occasionType = 'milestone-birthday';
                    if (event.name.includes('Graduation')) occasionType = 'graduation';
                    if (event.name.includes('Wedding')) occasionType = 'wedding';
                    console.log('Determined occasion type:', occasionType);

                    // Get the appropriate questions or use default ones
                    const questions = OCCASION_QUESTIONS[occasionType] || [
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
                    setCaptureMode('milestone');
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
              <span className="font-bold text-sm">{USER.streak} week streak!</span>
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
              <div className="text-2xl font-bold text-blue-600">{INDIVIDUALS.length}</div>
              <div className="text-sm text-gray-600">People</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{COLLECTIONS.length}</div>
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
          setSelectedOccasion={setSelectedOccasion}
          setQuestionSet={setQuestionSet}
          setCurrentQuestion={setCurrentQuestion}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          resetForm={resetForm} // if you have a form reset function
        />
      )}
      {/* NEW: Book Preview Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          {/* Book Container */}
          <div className="relative w-full max-w-md aspect-square">
            {/* Top Control Bar - New container for perfect alignment */}
            <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-4 z-10">
              {/* 3-dot menu - now using same spacing as close button */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-all focus:outline-none focus:ring-0"
                  title="Options"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-800" />
                </button>

                {/* Expanded Actions */}
                <div className={`flex items-center ml-2 transition-all duration-200 overflow-hidden ${isMenuOpen ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0'}`}>
                  <div className="flex gap-2 bg-white bg-opacity-90 rounded-full pl-2 pr-3 py-1 shadow-lg backdrop-blur-sm">
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-0"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4 text-black-600" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-0"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4 text-black-600" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-0"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-black-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Close button - now perfectly aligned with 3-dot menu */}
              <button
                onClick={() => setSelectedBook(null)}
                className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-all focus:outline-none focus:ring-0"
                title="Close"
              >
                <X className="w-4 h-4 text-gray-800" />
              </button>
            </div>

            {/* Book Content with softly rounded corners */}
            <div className="relative w-full h-full bg-white shadow-2xl overflow-hidden rounded-2xl">
              {/* Cover/Page Image */}
              {selectedBook.pages[currentPage].image ? (
                <div className="w-full h-full p-4 flex items-center justify-center bg-white">
                  <div className="relative w-full h-full">
                    <img
                      src={selectedBook.pages[currentPage].image}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 p-8">
                  {/* Text content fallback */}
                  <div className="text-center">
                    {selectedBook.pages[currentPage].type === 'question' ? (
                      <p className="text-xl italic text-gray-700">
                        {selectedBook.pages[currentPage].content}
                      </p>
                    ) : (
                      <div>
                        <p className="text-lg text-gray-800 mb-4">
                          {selectedBook.pages[currentPage].content.text}
                        </p>
                        <ul className="space-y-2 text-gray-700">
                          {selectedBook.pages[currentPage].content.points.map((point, i) => (
                            <li key={i}>• {point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Floating Navigation Buttons (below book in black space) */}
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center items-center gap-8">
              <button
                onClick={() => flipPage('prev')}
                disabled={currentPage === 0}
                className={`p-3 text-white rounded-full ${currentPage === 0 ? 'opacity-30 cursor-default' : 'hover:bg-white hover:bg-opacity-10'}`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <span className="text-sm text-white font-medium">
                {currentPage + 1} / {selectedBook.pages.length}
              </span>

              <button
                onClick={() => flipPage('next')}
                disabled={currentPage === selectedBook.pages.length - 1}
                className={`p-3 text-white rounded-full ${currentPage === selectedBook.pages.length - 1 ? 'opacity-30 cursor-default' : 'hover:bg-white hover:bg-opacity-10'}`}
              >
                <ChevronRight className="w-6 h-6" />
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

export default HomeView;
