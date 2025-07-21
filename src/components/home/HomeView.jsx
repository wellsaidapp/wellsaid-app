import React, { useState, useEffect, useContext } from 'react';
import { Lightbulb, ArrowRight, Pencil, Zap, Clock, Sparkles, Calendar, Trophy } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { usePeople } from '../../context/PeopleContext';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { useInsights } from '../../context/InsightContext';
import { useBooks } from '../../context/BooksContext';
import { UPCOMING_EVENTS } from '../../constants/upcomingEvents';
import { OCCASION_QUESTIONS } from '../../constants/occasionQuestions';
import CaptureOptionsModal from '../capture/CaptureOptionsModal';
import CaptureView from '../capture/CaptureView';
import HeroSection from './HeroSection';
import UpcomingEventsSection from './UpcomingEventsSection';
import WeeklyProgress from './WeeklyProgress';
import SharedBooksSection from './SharedBooksSection';
import LegacyStats from './LegacyStats';
import PDFViewerWrapper from '../library/BooksView/PDFViewerWrapper';
import BookEditor from '../library/BooksView/BookEditor';
import BookPreviewModal from './BookPreviewModal'

import { parseISO, isThisWeek, addHours } from 'date-fns';

const HomeView = ({
  showCaptureOptions,
  setShowCaptureOptions,
  setCurrentView,
  setCaptureMode,
  currentView,
  setLibraryDefaultViewMode
}) => {
  const { userData, loadingUser, refetchUser } = useUser();
  const { people, loadingPeople, refetchPeople } = usePeople();
  const { userCollections, loading } = useUserCollections();
  const [pdfTimestamp, setPdfTimestamp] = useState(null);
  const { insights, loadingInsights } = useInsights();
  const {
    books,
    setBooks,
    loadingBooks,
    getRecentBooks,
    getPublishedBooksCount,
    updateBook
  } = useBooks();

  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [questionSet, setQuestionSet] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [editingBook, setEditingBook] = useState(null);
  const [returnToViewer, setReturnToViewer] = useState(false);
  const [previousViewerState, setPreviousViewerState] = useState(null);

  if (loadingUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }
  // console.log("People Loaded:", people.length);
  const userName = userData?.name?.split(' ')[0] || 'Friend';
  const weeklyGoal = userData?.weeklyGoal ?? 5;
  const userStreak = userData?.streak ?? 0;

  insights.forEach(i => {
    const parsed = parseISO(i.date);
    const adjusted = addHours(parsed, 5);
  });

  // ✅ Actual weekly insights count
  const weekInsights = insights.filter(i => {
    const parsed = parseISO(i.date);
    const adjusted = addHours(parsed, 5);
    return isThisWeek(adjusted);
  }).length;


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

  const updatePublishedBook = async (updatedBook) => {
    try {
      // Update local state
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === updatedBook.id ? updatedBook : book
        )
      );

      return updatedBook;
    } catch (error) {
      console.error("Failed to update book:", error);
      throw error;
    }
  };

  useEffect(() => {
    const modalIsOpen = editingBook || showPdfViewer || showCaptureOptions;

    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [editingBook, showPdfViewer, showCaptureOptions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20 overflow-y-auto">
      <div className="p-4">
        <HeroSection
          setShowCaptureOptions={setShowCaptureOptions}
          userName={userName}
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
          userStreak={userStreak}
        />

        <SharedBooksSection
          books={recentBooks}
          onViewBook={(book) => {
            setSelectedBook(book);
            setShowPdfViewer(true);
          }}
          setCurrentView={setCurrentView}
          setLibraryDefaultViewMode={setLibraryDefaultViewMode}
          userData={userData}
        />

        <LegacyStats
          insightsCount={insights.length}
          individualsCount={people.length}
          booksCount={getPublishedBooksCount()}
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

      {showPdfViewer && selectedBook && (
        selectedBook.status === "Published" && selectedBook.publishedBook ? (
          <PDFViewerWrapper
            book={{
              ...selectedBook,
              publishedBook: pdfTimestamp
                ? `${selectedBook.publishedBook}?ts=${pdfTimestamp}`
                : selectedBook.publishedBook
            }}
            onClose={() => {
              setSelectedBook(null);
              setShowPdfViewer(false);
              setPdfTimestamp(null);
            }}
            onEdit={(book) => {
              setPreviousViewerState({
                book: selectedBook,
                showPdfViewer: true
              });
              setEditingBook(book);
              setShowPdfViewer(false);
              setReturnToViewer(true);
            }}
            userData={userData}
          />
        ) : (
          <BookPreviewModal
            book={selectedBook}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onClose={() => {
              setSelectedBook(null);
              setShowPdfViewer(false);
            }}
          />
        )
      )}
      {editingBook && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              // optional backdrop close
              setEditingBook(null);
              setReturnToViewer(false);
            }}
          />
          {/* modal content */}
          <div className="relative z-10 w-full">
            <BookEditor
              variant="modal"
              book={editingBook}
              editingBook={editingBook}
              returnToViewer={returnToViewer}
              previousViewerState={previousViewerState}
              userData={userData}
              onClose={() => {
                setEditingBook(null);
                setReturnToViewer(false);
              }}
              onSave={async (updatedBook) => {
                try {
                  const savedBook = await updatePublishedBook(updatedBook);
                  updateBook(savedBook);
                  setPdfTimestamp(Date.now());
                  setEditingBook(null);
                  setReturnToViewer(false);
                  return savedBook;
                } catch (err) {
                  console.error('Error saving book:', err);
                  throw err;
                }
              }}
              onBackToViewer={(savedBook) => {
                const bookToShow = savedBook || previousViewerState?.book;
                const cleanUrl = bookToShow.publishedBook.split('?')[0];
                setSelectedBook({
                  ...bookToShow,
                  publishedBook: `${cleanUrl}?ts=${Date.now()}`
                });
                setEditingBook(null);
                setReturnToViewer(false);
                setShowPdfViewer(true);
                setCurrentPage(p => p + 1);
                setTimeout(() => setCurrentPage(p => p - 1), 10);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
