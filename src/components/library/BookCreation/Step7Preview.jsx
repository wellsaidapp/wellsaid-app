import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Palette, Type } from 'lucide-react'; // Adjust if using a different icon set

const Step7Preview = ({ newBook, entryOrder, insights }) => {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Get all entries in order
  const orderedEntries = entryOrder.map(id => insights.find(e => e.id === id)).filter(Boolean);
  const [isSerifFont, setIsSerifFont] = useState(true);
  const fontClass = isSerifFont ? 'font-serif' : 'font-sans';
  const previewPages = [
    { type: 'cover' },
    ...orderedEntries.flatMap(entry => ([
      { type: 'question', entry },
      { type: 'answer', entry }
    ])),
    { type: 'backCover' }
  ];
  const currentPage = previewPages[currentPreviewPage];
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);

  const flipPage = (direction) => {
    if (isFlipping) return;
    setIsFlipping(true);

    if (direction === 'next' && currentPreviewPage < previewPages.length - 1) {
      setCurrentPreviewPage(currentPreviewPage + 1);
    } else if (direction === 'prev' && currentPreviewPage > 0) {
      setCurrentPreviewPage(currentPreviewPage - 1);
    }

    setTimeout(() => setIsFlipping(false), 300);
  };

  console.log("Current page index:", currentPreviewPage);
  console.log("Current page type:", currentPage?.type);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview your book</h3>
      <p className="text-sm text-gray-600 mb-6">
        Review how your book will look before publishing.
      </p>

      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          {/* Book cover */}
          {currentPage.type === 'cover' && (
            <div
              className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden relative flex flex-col items-center ${
                isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
              }`}
            >
              <div className="relative w-full max-w-xs aspect-square mt-2 p-2 flex items-center justify-center">
                {/* Toggle Icon */}
                <button
                  onClick={() => setIsBlackAndWhite(prev => !prev)}
                  className="absolute top-3 right-3 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                  title={isBlackAndWhite ? 'Show in Color' : 'Show in B&W'}
                >
                  <span
                    className={`relative flex items-center justify-center w-5 h-5 ${
                      isBlackAndWhite ? 'palette-slash' : ''
                    }`}
                  >
                    <Palette
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isBlackAndWhite ? 'text-gray-400' : 'text-blue-600'
                      }`}
                    />
                  </span>
                </button>

                {/* Cover Image */}
                {newBook.coverImage ? (
                  <img
                    src={newBook.coverImage}
                    alt="Book cover"
                    className={`w-full h-full object-contain rounded ${isBlackAndWhite ? 'grayscale' : ''}`}
                  />
                ) : (
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                    <h3 className={`text-gray-800 mb-4 ${fontClass}`}>{newBook.title || 'Untitled Book'}</h3>
                    <p className={`text-gray-800 mb-4 ${fontClass}`}>
                      {newBook.description || 'A collection of wisdom and insights'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(currentPage.type === 'question' || currentPage.type === 'answer') && (
            <div className={`bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-xs aspect-square mx-auto p-2 flex items-center justify-center ${
              isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
            }`}>
              {currentPage.type !== 'cover' && (
                <button
                  onClick={() => setIsSerifFont((prev) => !prev)}
                  className="absolute top-3 right-3 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                  title={isSerifFont ? 'Switch to Sans Serif' : 'Switch to Serif'}
                >
                  <span
                    className={`relative flex items-center justify-center w-5 h-5 ${
                      !isSerifFont ? 'type-slash' : ''
                    }`}
                  >
                    <Type
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isSerifFont ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                  </span>
                </button>
              )}
              <div className="w-full h-full flex flex-col justify-between items-center text-center p-4">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                    <span className={`text-gray-800 mb-4 ${fontClass}`}>
                      {currentPage.type === 'question' ? 'Question' : 'Insight'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-h-[300px]">
                  {currentPage.type === 'question' && (
                    <div className="mb-6">
                      <p className={`text-gray-800 mb-4 ${fontClass}`}>
                        {currentPage.entry.question}
                      </p>
                    </div>
                  )}

                  {currentPage.type === 'answer' && (
                    <p className={`text-gray-800 mb-4 ${fontClass}`}>
                      {currentPage.entry.text || currentPage.entry.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentPage.type === 'backCover' && (
            <div className={`bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-xs aspect-square mx-auto p-2 flex items-center justify-center ${
              isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
            }`}>
            <button
              onClick={() => setIsSerifFont((prev) => !prev)}
              className="absolute top-3 right-3 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
              title={isSerifFont ? 'Switch to Sans Serif' : 'Switch to Serif'}
            >
              <span
                className={`relative flex items-center justify-center w-5 h-5 ${
                  !isSerifFont ? 'type-slash' : ''
                }`}
              >
                <Type
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isSerifFont ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
              </span>
            </button>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-gray-800 mb-4 ${fontClass}`}>
                      {newBook.backCoverNote || 'With love and care...'}
                    </p>
                  </div>
                </div>
                <div className={`text-center text-gray-800 mb-4 ${fontClass}`}>
                  <p>Created by Brad Blanchard</p>
                </div>
              </div>
            </div>
          )}
          {/* Navigation arrows */}
          {/* Page Navigation Controls */}
          <div className="flex items-center justify-between gap-4 mt-6 w-full max-w-xs mx-auto">
            <button
              onClick={() => flipPage('prev')}
              disabled={currentPreviewPage === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                currentPreviewPage === 0 ? 'opacity-30 cursor-default' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page {currentPreviewPage + 1} of {previewPages.length}
            </span>

            <button
              onClick={() => flipPage('next')}
              disabled={currentPreviewPage === previewPages.length - 1}
              className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                currentPreviewPage === previewPages.length - 1 ? 'opacity-30 cursor-default' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7Preview;
