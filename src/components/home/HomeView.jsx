import React, { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, Pencil, Zap, Clock, Sparkles, Calendar, Trophy } from 'lucide-react';
import { SHARED_BOOKS, getRecentBooks, getPublishedBooksCount } from '../../constants/sharedBooks';
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
import BookEditor from '../library/BooksView/BookEditor';
import { isThisWeek, parseISO } from 'date-fns';

const HomeView = ({
  showCaptureOptions,
  setShowCaptureOptions,
  setCurrentView,
  setCaptureMode,
  currentView,
  setLibraryDefaultViewMode,
  books,
  setBooks
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
  const [editingBook, setEditingBook] = useState(null);
  const [returnToViewer, setReturnToViewer] = useState(false);
  const [previousViewerState, setPreviousViewerState] = useState(null);
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

      // If using API, add your update call here
      // const response = await api.updateBook(updatedBook.id, updatedBook);
      // return response.data;

      return updatedBook;
    } catch (error) {
      console.error("Failed to update book:", error);
      throw error;
    }
  };

  // In HomeView.jsx - simplify the BookEditor props
  // In HomeView.jsx - update the BookEditor props
  if (editingBook) {
    // Define the update function
    const updatePublishedBook = async (updatedBook) => {
      try {
        // 1. Update in your state
        setBooks(prevBooks =>
          prevBooks.map(book =>
            book.id === updatedBook.id ? updatedBook : book
          )
        );

        // 2. If using an API, add your backend call here:
        // const response = await api.updateBook(updatedBook.id, updatedBook);
        // return response.data;

        // 3. For demo purposes without backend:
        return updatedBook;

      } catch (error) {
        console.error("Failed to update book:", error);
        throw error;
      }
    };

    return (
      // In the BookEditor props in HomeView.jsx:
      <BookEditor
        book={editingBook}
        returnToViewer={returnToViewer}
        previousViewerState={previousViewerState}
        onClose={() => {
          setEditingBook(null);
          setReturnToViewer(false);
        }}
        onSave={async (updatedBook) => {
          try {
            const savedBook = await updatePublishedBook(updatedBook);
            setEditingBook(null);
            setReturnToViewer(false);
            return savedBook; // Make sure to return the saved book
          } catch (error) {
            console.error("Error saving book:", error);
            throw error;
          }
        }}
        onBackToViewer={(savedBook) => {
          setSelectedBook(savedBook); // Update with the saved version
          setEditingBook(null);
          setReturnToViewer(false);
        }}
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
        selectedBook.status === "Published" && selectedBook.publishedState?.pdfBase64 ? (
          <PDFViewerWrapper
            book={selectedBook}
            onClose={() => {
              setSelectedBook(null);
              setShowPdfViewer(false);
            }}
            onEdit={(book) => {  // <-- THIS IS WHERE YOU ADD IT
              setPreviousViewerState({
                book: selectedBook,
                showPdfViewer: true
              });
              setEditingBook(book);
              setShowPdfViewer(false);
              setReturnToViewer(true);
            }}
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
    </div>
  );
};

export default HomeView;
