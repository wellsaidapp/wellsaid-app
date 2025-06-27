import React, { useState, useEffect } from 'react';
import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox, Trash2, Save, GripVertical, Bookmark, CheckCircle,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download, ImageIcon,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import Step1Collections from './Step1Collections';
import Step2Insights from './Step2Insights';
import Step3Arrange from './Step3Arrange';
import Step4Cover from './Step4Cover';
import Step5BackCover from './Step5BackCover';
import Step6Recipient from './Step6Recipient';
import Step7Preview from './Step7Preview';
import Step8Publish from './Step8Publish';
import ImageCropperModal from './ImageCropperModal';
import DraggableEntry from './DraggableEntry';
import { SYSTEM_COLLECTIONS } from '../../../constants/systemCollections';

const BookCreationModal = ({
  onClose,
  newBook,
  setNewBook,
  bookCreationStep,
  setBookCreationStep,
  entryOrder,
  setEntryOrder,
  individuals,
  insights,
  collections,
  groupedEntries,
  SYSTEM_COLLECTIONS,
  currentView,
  setCurrentView
}) => {
  const steps = React.useMemo(() => [
    'Select Collections',
    'Choose Insights',
    'Arrange Pages',
    'Upload Cover',
    'Add Text',
    'Assign Recipient',
    'Preview',
    'Publish'
  ], []);

  const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const moveEntry = (fromIndex, toIndex) => {
    console.log('Moving entry:', fromIndex, '→', toIndex);
    setEntryOrder(prev => {
      const newOrder = [...prev];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      return newOrder;
    });
  };

  const [coverImageState, setCoverImageState] = useState({
    tempImage: null,
    showCropModal: false
  });

  // Add this effect to handle when we come from the arrange view
  useEffect(() => {
    if (currentView === 'arrangeBook' && bookCreationStep < 2) {
      setBookCreationStep(2);
    }
  }, [currentView]);

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const getBackend = () => {
    return typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      ? TouchBackend
      : HTML5Backend;
  };

  return (
    <>
      <DndProvider backend={getBackend()}>
        {/* Backdrop that blocks all pointer events */}
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-[100]"
          onClick={onClose}
          style={{ pointerEvents: 'auto' }}
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
          {/* Modal content with pointer-events-auto */}
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col pointer-events-auto">
            {/* Header with progress steps */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-800">Create New Book</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile progress bar */}
              <div className="sm:hidden flex flex-col items-center text-center mt-4">
                <span className="text-sm text-gray-600 mb-1">
                  Step {bookCreationStep + 1} of {steps.length}: {steps[bookCreationStep]}
                </span>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${((bookCreationStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress steps */}
              <div className="hidden sm:flex justify-between mt-4 relative">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        bookCreationStep === index
                          ? 'bg-blue-600 text-white border-2 border-blue-600'
                          : bookCreationStep > index
                            ? 'bg-green-500 text-white border-2 border-green-500'
                            : 'bg-white text-gray-500 border-2 border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className={`text-xs mt-1 text-center ${
                      bookCreationStep === index ? 'font-semibold text-blue-600' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-1">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(bookCreationStep / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              {bookCreationStep === 0 && (
                <Step1Collections
                  newBook={newBook}
                  setNewBook={setNewBook}
                  SYSTEM_COLLECTIONS={SYSTEM_COLLECTIONS}
                  collections={collections}
                  groupedEntries={groupedEntries}
                />
              )}

              {bookCreationStep === 1 && (
                <Step2Insights
                  newBook={newBook}
                  setNewBook={setNewBook}
                  insights={insights}
                  setEntryOrder={setEntryOrder}
                  groupedEntries={groupedEntries}
                />
              )}

              {bookCreationStep === 2 && (
                <div className="relative" style={{ minHeight: '400px' }}>
                  <Step3Arrange
                    newBook={newBook}
                    setNewBook={setNewBook}
                    entryOrder={entryOrder}
                    setEntryOrder={setEntryOrder}
                    insights={insights}
                    moveEntry={moveEntry}
                  />
                </div>
              )}

              {bookCreationStep === 3 && (
                <Step4Cover
                  newBook={newBook}
                  setNewBook={setNewBook}
                  coverImageState={coverImageState}
                  setCoverImageState={setCoverImageState}
                />
              )}
              {bookCreationStep === 4 && (
                <Step5BackCover
                  newBook={newBook}
                  setNewBook={setNewBook}
                />
              )}

              {bookCreationStep === 5 && (
                <Step6Recipient
                  newBook={newBook}
                  setNewBook={setNewBook}
                  individuals={individuals}
                />
              )}

              {bookCreationStep === 6 && (
                <Step7Preview
                  newBook={newBook}
                  entryOrder={entryOrder}
                  insights={insights}
                />
              )}

              {bookCreationStep === 7 && (
                <Step8Publish
                  newBook={newBook}
                  onClose={onClose}
                  entryOrder={entryOrder}
                  individuals={individuals}
                  setNewBook={setNewBook}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (bookCreationStep === 2) {
                    // When going back from arrange step, show the compact view
                    setCurrentView('arrangeBook');
                    onClose();
                  } else {
                    setBookCreationStep(bookCreationStep - 1);
                  }
                }}
                disabled={bookCreationStep === 0}
                className={`px-4 py-2 rounded-lg ${bookCreationStep === 0 ? 'text-gray-400 bg-gray-100' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                Back
              </button>

              <div className="flex items-center space-x-2">
                {bookCreationStep < 7 && (
                  <button
                    onClick={() => {
                      setNewBook(prev => ({ ...prev, isDraft: true }));
                      // Save as draft logic here
                      onClose();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Save as Draft
                  </button>
                )}

                <button
                  onClick={() => {
                    if (bookCreationStep < 7) {
                      setBookCreationStep(bookCreationStep + 1);
                    } else {
                      // Publish logic here
                      onClose();
                    }
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    bookCreationStep === 7
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {bookCreationStep === 7 ? 'Publish Book' : 'Next'}
                </button>
              </div>
            </div>
            {coverImageState.showCropModal && coverImageState.tempImage && (
              <ImageCropperModal
                image={coverImageState.tempImage}
                onCropComplete={(croppedImage) => {
                  console.log("Cropped image received:", croppedImage);
                  setNewBook((prev) => {
                    if (prev.coverImage === croppedImage) return prev; // 👈 avoid redundant update
                    return { ...prev, coverImage: croppedImage };
                  });
                  setCoverImageState({ tempImage: null, showCropModal: false });
                }}
                onClose={() => setCoverImageState((prev) => ({ ...prev, showCropModal: false }))}
              />
            )}
          </div>
        </div>
      </DndProvider>
    </>
  );
};


export default React.memo(BookCreationModal);
