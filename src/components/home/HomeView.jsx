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
import PDFViewerWrapper from '../library/BooksView/PDFViewerWrapper';
import { isThisWeek, parseISO } from 'date-fns';

const HomeView = ({
  showCaptureOptions,
  setShowCaptureOptions,
  setCurrentView,
  setCaptureMode,
  currentView,
  setLibraryDefaultViewMode
}) => {
  const [insights] = useState(INSIGHTS);
  const weekInsights = insights.filter(i => isThisWeek(parseISO(i.date))).length;
  const weeklyGoal = 5;
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
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
          onViewBook={(book) => {
            setSelectedBook(book);
            setShowPdfViewer(true);
          }}
          setCurrentView={setCurrentView}
          setLibraryDefaultViewMode={setLibraryDefaultViewMode}
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

      {showPdfViewer && selectedBook?.pdfBase64 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100]">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
            <PDFViewerWrapper
              file={selectedBook.pdfBase64}
              name={selectedBook.name}
              onClose={() => {
                setSelectedBook(null);
                setShowPdfViewer(false);
                setCurrentPage(0);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
