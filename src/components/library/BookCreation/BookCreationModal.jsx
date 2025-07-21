import React, { useState, useEffect } from 'react';
import {
  Send, Mic, MicOff, ArrowRight, Check, Plus, User, Mail, Hash, Inbox, Trash2, Save, GripVertical, Bookmark, CheckCircle,
  MessageCircle, Wand2, BookOpen, Share2, ChevronLeft, X, Download, ImageIcon,
  Sparkles, Printer, ShoppingCart, ChevronDown, ChevronUp, Home, XCircle,
  MessageSquare, Book, FolderOpen, Search, Tag, Clock, ChevronRight,
  Star, Bell, Settings, Users, Edit3, Calendar, Target, Trophy, Zap,
  Heart, ArrowLeft, Cake, Orbit, GraduationCap, Gift, Shuffle, PlusCircle, Library, Lightbulb, Pencil, Lock, Key, KeyRound
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { generateBookPDF } from './BookPDFGenerator';
import { uploadData } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

import ToastMessage from './ToastMessage';
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

import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { useUser } from '../../../context/UserContext';
import { useBooks } from '../../../context/BooksContext';

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

  const resetCreationState = () => {
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
      isBlackAndWhite: false,
      isDraft: false
    });
    setEntryOrder([]);
    setBookCreationStep(0);
    setCoverImageState({ tempImage: null, showCropModal: false });
  };
  const { refreshBooks } = useBooks();
  const { systemCollections, loading } = useSystemCollections();
  const { userData } = useUser();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  console.log("User Data:", userData.avatarUrl);
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

  const saveBookToRDS = async (bookData) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const res = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(bookData)
    });

    if (!res.ok) throw new Error('Failed to save book to database');

    const result = await res.json();
    return result;
  };

  const uploadCoverImageToS3 = async (coverImage, userId, bookId) => {
    if (!coverImage || coverImage.startsWith("https://")) return; // Already stored in S3

    const session = await fetchAuthSession();
    const cognitoId = session.userSub;

    const blob = await (await fetch(coverImage)).blob(); // Convert base64/dataURL to blob

    const key = `Users/Active/${cognitoId}/books/${bookId}-cover.jpeg`;
    await uploadData({
      key,
      data: blob,
      options: {
        contentType: 'image/jpeg'
      }
    }).result;

    return `https://wellsaidappdeva7ff28b66c7e4c6785e936c0092e78810660a-dev.s3.us-east-2.amazonaws.com/public/${key}`;
  };

  const uploadPDFToS3 = async (pdfBlob, userId, bookId) => {
    const session = await fetchAuthSession();
    const cognitoId = session.userSub;

    const key = `Users/Active/${cognitoId}/books/${bookId}.pdf`;

    await uploadData({
      key,
      data: pdfBlob,
      options: {
        contentType: 'application/pdf'
      }
    }).result;

    return `https://wellsaidappdeva7ff28b66c7e4c6785e936c0092e78810660a-dev.s3.us-east-2.amazonaws.com/public/${key}`;
  };

  const [coverImageState, setCoverImageState] = useState({
    tempImage: null,
    showCropModal: false
  });

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

  // Then modify your handleComplete function:
  const handleComplete = async (actionType = 'cancel') => {
    if (actionType === 'publish' || actionType === 'draft') {
      let loadingToast;
      try {
        loadingToast = toast.custom(
          (t) => (
            <ToastMessage
              type="info"
              title={actionType === 'publish' ? "Publishing..." : "Saving Draft..."}
              message="Please wait while we process your book"
              onDismiss={() => toast.dismiss(t.id)}
            />
          ),
          {
            duration: Infinity,
            position: 'bottom-center',
            style: { zIndex: 9999 }
          }
        );

        // First create/update the book record to get the book ID
        const bookResponse = await saveBookToRDS({
          existingBookId: newBook.existingBookId,
          name: newBook.title,
          description: newBook.description,
          backCoverNote: newBook.backCoverNote,
          fontStyle: newBook.fontStyle,
          isBlackAndWhite: newBook.isBlackAndWhite,
          color: newBook.color || 'bg-blue-500',
          status: actionType === 'publish' ? 'Published' : 'Draft',
          personId: newBook.recipient,
          personName: newBook.recipientName,
          coverImage: newBook.coverImage?.startsWith("https://") ? newBook.coverImage : null,
          publishedBook: null,
          publishedContent: null,
          insightIds: newBook.selectedEntries,
          collectionIds: newBook.selectedCollections,
          savedOn: new Date().toISOString().split('T')[0]
        });

        const bookId = bookResponse.bookId;

        // Update local state with the book ID if it's new
        if (!newBook.existingBookId) {
          setNewBook(prev => ({ ...prev, existingBookId: bookId }));
        }

        if (actionType === 'publish') {
          // Generate PDF and upload assets only for publishing
          const pdfBlob = await generateBookPDF(
            newBook,
            entryOrder,
            insights,
            userData,
            newBook.fontStyle,
            newBook.isBlackAndWhite
          );

          const userId = userData?.id || (await fetchAuthSession())?.userSub;

          // Upload assets in parallel
          const [coverImageUrl, pdfUrl] = await Promise.all([
            uploadCoverImageToS3(newBook.coverImage, userId, bookId),
            uploadPDFToS3(pdfBlob, userId, bookId)
          ]);

          // Update the book record with the S3 URLs
          await saveBookToRDS({
            existingBookId: bookId,
            name: newBook.title,
            description: newBook.description,
            backCoverNote: newBook.backCoverNote,
            fontStyle: newBook.fontStyle,
            isBlackAndWhite: newBook.isBlackAndWhite,
            color: newBook.color || 'bg-blue-500',
            status: 'Published',
            personId: newBook.recipient,
            personName: newBook.recipientName,
            coverImage: coverImageUrl,
            publishedBook: pdfUrl,
            publishedContent: entryOrder.map(id => {
              const insight = insights.find(i => i.id === id);
              return insight ? {
                prompt: insight.prompt,
                response: insight.response
              } : null;
            }).filter(Boolean),
            insightIds: newBook.selectedEntries,
            collectionIds: newBook.selectedCollections,
            savedOn: new Date().toISOString().split('T')[0]
          });

          // Desktop download behavior
          if (!isTouchDevice()) {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${newBook.title || 'Untitled Book'}.pdf`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
          }
        }

        // Success toast
        toast.success(
          (t) => (
            <ToastMessage
              type="success"
              title={isTouchDevice() ? "Book Published!" : "Book Published"}
              message={
                isTouchDevice()
                  ? <span className="block space-y-1">
                      <span className="block">Your book "{newBook.title || 'Untitled Book'}" is ready!</span>
                      <span className="block">
                        Access it anytime from <span className="font-semibold">My Books</span>.
                      </span>
                    </span>
                  : `"${newBook.title || 'Untitled Book'}" has been published.`
              }
              onDismiss={() => toast.dismiss(t.id)}
            />
          ),
          {
            id: loadingToast,
            duration: isTouchDevice() ? 5000 : 4000,
            position: 'bottom-center',
            style: {
              marginBottom: '2rem',
              zIndex: 9999
            }
          }
        );

        await refreshBooks();
        resetCreationState();
        onClose();
      } catch (error) {
        console.error('Error during book completion:', error);
        toast.error(`Failed to ${actionType === 'publish' ? 'publish' : 'save'} book`);
      }
    } else {
      // Cancel logic remains the same
      const hasChanges = (
        newBook.title ||
        newBook.description ||
        newBook.selectedCollections.length > 0 ||
        newBook.selectedEntries.length > 0 ||
        newBook.coverImage ||
        newBook.backCoverNote ||
        newBook.recipient
      );

      if (hasChanges) {
        setShowExitConfirmation(true);
      } else {
        resetCreationState();
        onClose();
      }
    }
  };

  const handleCropComplete = (croppedImage) => {
    console.log("Cropped image received in BookCreationModal:", croppedImage);

    // Update the newBook state with the cropped image
    setNewBook(prev => ({
      ...prev,
      coverImage: croppedImage
    }));

    // Close the cropper modal and clear temp image
    setCoverImageState({
      tempImage: null,
      showCropModal: false
    });
  };

  // Add this useEffect hook right after your other state declarations
  useEffect(() => {
    // Filter entryOrder to only include insights that are still selected
    if (bookCreationStep >= 2) { // Only needed when we get to Step 3 and beyond
      const filteredOrder = entryOrder.filter(id =>
        newBook.selectedEntries.includes(id)
      );

      if (filteredOrder.length !== entryOrder.length) {
        setEntryOrder(filteredOrder);
      }
    }
  }, [bookCreationStep, newBook.selectedEntries]);

  // Add this useEffect right after your other effects in BookCreationModal
  useEffect(() => {
    // Only run in Step 1 when collections change
    if (bookCreationStep !== 0) return;

    // Get all valid entry IDs from selected collections
    const validEntryIds = newBook.selectedCollections.flatMap(collectionId =>
      (groupedEntries[collectionId] || []).map(entry => entry.id)
    );

    // Filter selectedEntries to only keep valid ones
    const filteredEntries = newBook.selectedEntries.filter(entryId =>
      validEntryIds.includes(entryId)
    );

    // Only update if there's a mismatch
    if (filteredEntries.length !== newBook.selectedEntries.length) {
      setNewBook(prev => ({
        ...prev,
        selectedEntries: filteredEntries
      }));
    }
  }, [newBook.selectedCollections, bookCreationStep, groupedEntries]);

  return (
    <>
      <DndProvider backend={getBackend()}>
        {/* Backdrop that blocks all pointer events */}
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-[100] overflow-y-auto"
          onClick={() => {
            // Check if there are any changes
            const hasChanges = (
              newBook.title ||
              newBook.description ||
              newBook.selectedCollections.length > 0 ||
              newBook.selectedEntries.length > 0 ||
              newBook.coverImage ||
              newBook.backCoverNote ||
              newBook.recipient
            );

            hasChanges ? setShowExitConfirmation(true) : handleComplete('cancel');
          }}
          style={{ pointerEvents: 'auto' }}
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none overflow-y-auto">
          {/* Modal content with pointer-events-auto */}
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col pointer-events-auto">
            {/* Header with progress steps */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-800">Create New Book</h2>
                <button
                  onClick={() => {
                    const hasChanges = (
                      newBook.title ||
                      newBook.description ||
                      newBook.selectedCollections.length > 0 ||
                      newBook.selectedEntries.length > 0 ||
                      newBook.coverImage ||
                      newBook.backCoverNote ||
                      newBook.recipient
                    );

                    hasChanges ? setShowExitConfirmation(true) : handleComplete('cancel');
                  }}
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
                  SYSTEM_COLLECTIONS={systemCollections}
                  collections={collections}
                  groupedEntries={groupedEntries}
                />
              )}

              {bookCreationStep === 1 && (
                <Step2Insights
                  newBook={newBook}
                  setNewBook={setNewBook}
                  insights={insights}
                  entryOrder={entryOrder}
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
                  setNewBook={setNewBook}
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
                  setBookCreationStep={setBookCreationStep}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setBookCreationStep(bookCreationStep - 1);
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
                      // Immediately show draft saved toast
                      handleComplete('draft');
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
                      // Final step: publish or save draft
                      handleComplete(newBook.isDraft ? 'draft' : 'publish');
                    }
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    bookCreationStep === 7
                      ? newBook.isDraft
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {bookCreationStep === 7
                    ? newBook.isDraft
                      ? 'Save Draft'
                      : 'Publish Book'
                    : 'Next'}
                </button>
              </div>
            </div>

            {showExitConfirmation && (
              <div className="fixed inset-0 flex items-center justify-center z-[102]">
                <div
                  className="fixed inset-0 bg-black bg-opacity-70"
                  onClick={() => setShowExitConfirmation(false)}
                />
                <div className="bg-white rounded-xl p-6 z-[103] max-w-sm w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Discard Changes?</h3>
                  <p className="text-gray-600 mb-6">
                    You have unsaved changes. Are you sure you want to exit?
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowExitConfirmation(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Continue Editing
                    </button>
                    <button
                      onClick={() => {
                        setShowExitConfirmation(false);
                        toast.custom(
                          (t) => (
                            <ToastMessage
                              type="cancel"
                              title="Book Creation Cancelled"
                              message="Your changes were not saved"
                              onDismiss={() => toast.dismiss(t.id)}
                            />
                          ),
                          { duration: 3000 }
                        );
                        resetCreationState();
                        onClose();
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Discard Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {coverImageState.showCropModal && coverImageState.tempImage && (
              <ImageCropperModal
                image={coverImageState.tempImage}
                onCropComplete={handleCropComplete}  // Use the new handler
                onClose={() => setCoverImageState(prev => ({ ...prev, showCropModal: false }))}
              />
            )}
          </div>
        </div>
      </DndProvider>
    </>
  );
};


export default React.memo(BookCreationModal);
