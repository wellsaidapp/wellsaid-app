import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Pencil, Zap, Clock, Sparkles, Calendar, Trophy } from 'lucide-react';
import { SHARED_BOOKS, getRecentBooks } from '../../constants/sharedBooks';
import { INSIGHTS } from '../../constants/insights';
import { USER } from '../../constants/user';
import { UPCOMING_EVENTS } from '../../constants/upcomingEvents';
import { INDIVIDUALS } from '../../constants/individuals';
import { CUSTOM_COLLECTIONS } from '../../constants/collections';
import { OCCASION_QUESTIONS } from '../../constants/occasionQuestions';
import Header from '../appLayout/Header';
import CaptureOptionsModal from '../capture/CaptureOptionsModal';
import CaptureView from '../capture/CaptureView';
import HeroSection from './HeroSection';
import UpcomingEventsSection from './UpcomingEventsSection';
import WeeklyProgress from './WeeklyProgress';
import SharedBooksSection from './SharedBooksSection';
import LegacyStats from './LegacyStats';
import BookPreviewModal from './BookPreviewModal';

const HomeView = ({
  showCaptureOptions,
  setShowCaptureOptions,
  setCurrentView,
  setCaptureMode,
  currentView
}) => {
  const [insights] = useState(INSIGHTS);
  const weekInsights = insights.filter(i => i.shared).length;
  const weeklyGoal = 5;
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [questionSet, setQuestionSet] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const recentBooks = getRecentBooks(2);

  const resetForm = () => {
    setSelectedOccasion(null);
    setQuestionSet([]);
    setCurrentQuestion('');
    setCurrentQuestionIndex(0);
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
        <HeroSection
          setShowCaptureOptions={setShowCaptureOptions}
          userName={USER.name.split(' ')[0]}
        />

        {UPCOMING_EVENTS.length > 0 && (
          <UpcomingEventsSection
            events={UPCOMING_EVENTS}
            occasionQuestions={OCCASION_QUESTIONS}
            setQuestionSet={setQuestionSet}
            setCurrentQuestion={setCurrentQuestion}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            setCurrentView={setCurrentView}
            setCaptureMode={setCaptureMode}
            resetForm={resetForm}
          />
        )}

        <WeeklyProgress
          weekInsights={weekInsights}
          weeklyGoal={weeklyGoal}
          userStreak={USER.streak}
        />

        <SharedBooksSection
          books={recentBooks}
          onView={(book) => setSelectedBook(book)}
        />

        <LegacyStats
          insightsCount={insights.length}
          individualsCount={INDIVIDUALS.length}
          booksCount={SHARED_BOOKS.length}
        />
      </div>

      {showCaptureOptions && (
        <CaptureOptionsModal
          setShowCaptureOptions={setShowCaptureOptions}
          setCurrentView={setCurrentView}
          setCaptureMode={setCaptureMode}
          setSelectedOccasion={setSelectedOccasion}
          setQuestionSet={setQuestionSet}
          setCurrentQuestion={setCurrentQuestion}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          resetForm={resetForm}
        />
      )}

      {selectedBook && (
        <BookPreviewModal
          book={selectedBook}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default HomeView;
