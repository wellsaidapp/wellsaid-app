import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Heart } from 'lucide-react'; // Adjust if using a different icon set

const Step7Preview = ({ newBook, entryOrder, insights }) => {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Get all entries in order
  const orderedEntries = entryOrder.map(id => insights.find(e => e.id === id)).filter(Boolean);

  const flipPage = (direction) => {
    if (isFlipping) return;
    setIsFlipping(true);

    if (direction === 'next' && currentPreviewPage < orderedEntries.length - 1) {
      setCurrentPreviewPage(currentPreviewPage + 1);
    } else if (direction === 'prev' && currentPreviewPage > 0) {
      setCurrentPreviewPage(currentPreviewPage - 1);
    }

    setTimeout(() => setIsFlipping(false), 300);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview your book</h3>
      <p className="text-sm text-gray-600 mb-6">
        Review how your book will look before publishing.
      </p>

      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          {/* Book cover */}
          {currentPreviewPage === 0 && (
            <div className={`bg-white rounded-lg shadow-xl border border-gray-200 h-[500px] overflow-hidden relative ${
              isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
            }`}>
                <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-gray-50 p-1">
                {newBook.coverImage ? (
                  <img
                    src={newBook.coverImage}
                    alt="Book cover"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center z-10">
                    <BookOpen className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">{newBook.title || 'Untitled Book'}</h3>
                    <p className="text-blue-600">{newBook.description || 'A collection of wisdom and insights'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back cover */}
          {currentPreviewPage === orderedEntries.length + 1 && (
            <div className={`bg-white rounded-lg shadow-xl border border-gray-200 h-[500px] overflow-hidden relative ${
              isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-10 h-10 mx-auto text-pink-500 mb-4" />
                    <p className="text-gray-700 whitespace-pre-line">
                      {newBook.backCoverNote || 'With love and care...'}
                    </p>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  <p>Created with Love</p>
                </div>
              </div>
            </div>
          )}

          {/* Content pages */}
          {currentPreviewPage > 0 && currentPreviewPage <= orderedEntries.length && (
            <div className={`bg-white rounded-lg shadow-xl border border-gray-200 h-[500px] overflow-y-auto ${
              isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
            }`}>
              <div className="p-8 h-full flex flex-col">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      {orderedEntries[currentPreviewPage - 1].question ? 'Question' : 'Insight'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-h-[300px]">
                  {orderedEntries[currentPreviewPage - 1].question && (
                    <div className="mb-6">
                      <p className="text-lg text-blue-800 italic">
                        {orderedEntries[currentPreviewPage - 1].question}
                      </p>
                    </div>
                  )}

                  <p className="text-gray-800 mb-4">
                    {orderedEntries[currentPreviewPage - 1].text || orderedEntries[currentPreviewPage - 1].content}
                  </p>
                </div>

                <div className="mt-auto pt-4 text-center">
                  <span className="text-xs text-gray-400 font-medium">
                    Page {currentPreviewPage} of {orderedEntries.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          {currentPreviewPage > 0 && (
            <button
              onClick={() => flipPage('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentPreviewPage < orderedEntries.length + 1 && (
            <button
              onClick={() => flipPage('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step7Preview;
