import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Palette, Type } from 'lucide-react'; // Adjust if using a different icon set

const Step7Preview = ({
  newBook,
  setNewBook,
  entryOrder,
  insights
}) => {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const isSerifFont = newBook.fontStyle === 'serif';
  // Get all entries in order
  const orderedEntries = entryOrder.map(id => insights.find(e => e.id === id)).filter(Boolean);

  const fontClass = isSerifFont ? 'font-serif' : 'font-sans';
  const previewPages = [
    { type: 'cover' },
    ...orderedEntries.flatMap(entry => ([
      { type: 'prompt', entry },
      { type: 'response', entry }
    ])),
    { type: 'backCover' }
  ];
  const currentPage = previewPages[currentPreviewPage];


  // 🔍 Log all book data for inspection
  useEffect(() => {
    console.log('🟦 newBook:', newBook);
    console.log('🟩 entryOrder:', entryOrder);
    console.log('🟨 insights:', insights);
    console.log('🟪 orderedEntries:', orderedEntries);
    console.log('⬜ previewPages:', previewPages);
  }, [newBook, entryOrder, insights]);

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

  return (
    <div className="overflow-y-auto max-h-[90vh] px-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview your book</h3>
      <p className="text-sm text-gray-600 mb-6">
        Review how your book will look before publishing.
      </p>

      <div className="flex justify-center">
        <div className="relative w-full max-w-[90vw] sm:max-w-[400px]">
          {/* Book cover */}
          {currentPage.type === 'cover' && (
            <div
              className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden relative flex flex-col items-center ${
                isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
              }`}
            >
              {/* Outer 5x5 proportional square */}
              <div className="relative aspect-square w-full">
                {/* Toggle Icons */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                  {/* Font Toggle */}
                  <button
                    onClick={() => setNewBook(prev => ({
                      ...prev,
                      fontStyle: prev.fontStyle === 'serif' ? 'sans' : 'serif'
                    }))}
                    className="bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
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

                  {/* B&W Toggle */}
                  <button
                    onClick={() => setNewBook(prev => ({
                      ...prev,
                      isBlackAndWhite: !prev.isBlackAndWhite  // Remove "newBook." from here
                    }))}
                    className="bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                    title={newBook.isBlackAndWhite ? 'Show in Color' : 'Show in B&W'}
                  >
                    <Palette
                      className={`w-5 h-5 transition-colors duration-200 ${
                        newBook.isBlackAndWhite ? 'text-gray-400' : 'text-blue-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Title in top margin - now using fontClass */}
                <div className="absolute top-[1%] left-[5%] right-[5%] z-10">
                  <p className={`text-[10px] font-semibold text-gray-800 ${fontClass} text-left truncate`}>
                    {newBook.title || 'Untitled Book'}
                  </p>
                </div>

                {/* Description in bottom margin - now using fontClass */}
                <div className="absolute bottom-[1%] left-[5%] right-[5%] z-10">
                  <p className={`text-[9px] text-gray-600 ${fontClass} text-right truncate`}>
                    {newBook.description || 'A collection of wisdom and insights'}
                  </p>
                </div>

                {/* 4.5x4.5 proportional image centered in container */}
                <div className="absolute top-[5%] left-[5%] w-[90%] h-[90%] flex items-center justify-center">
                  {newBook.coverImage ? (
                    <img
                      src={newBook.coverImage}
                      alt="Book cover"
                      className={`w-full h-full object-contain rounded ${newBook.isBlackAndWhite ? 'grayscale' : ''}`}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <h3 className={`text-gray-800 text-lg mb-2 ${fontClass}`}>
                          {newBook.title || 'Untitled Book'}
                        </h3>
                        <p className={`text-gray-600 text-sm ${fontClass}`}>
                          {newBook.description || 'A collection of wisdom and insights'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(currentPage.type === 'prompt' || currentPage.type === 'response') && (
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
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                <div className="inline-block px-3 py-1 bg-blue-100 rounded-full mb-4">
                  <span className={`text-gray-800 text-sm ${fontClass}`}>
                    {currentPage.type === 'prompt' ? 'Prompt' : 'Response'}
                  </span>
                </div>

                <p className={`text-gray-800 text-base ${fontClass}`}>
                  {currentPage.type === 'prompt'
                    ? currentPage.entry.prompt
                    : currentPage.entry.response || currentPage.entry.content}
                </p>
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
