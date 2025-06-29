import { X, ChevronLeft, ChevronRight, Share2, ShoppingCart, Edit, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const BookPreviewModal = ({ book, currentPage = 0, setCurrentPage, onClose }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Return null if book is not defined or doesn't have pages
  if (!book || !book.pages || !Array.isArray(book.pages)) {
    return null;
  }

  const flipPage = (direction) => {
    if (!book.pages) return;

    if (direction === 'next' && currentPage < book.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [book]);

  useEffect(() => {
    console.log("Book pages:", book?.pages);
    console.log("Current page:", currentPage);
  }, [book, currentPage]);

  if (!book || !book.pages || book.pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
          <div className="p-6 text-center">
            <p>This book has no pages yet</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100] backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${book.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-800 tracking-wide">
                  {book.name}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  For {book.recipient}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Book Content */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md h-[500px] overflow-visible">
            <div className={`relative bg-white rounded-lg shadow-xl border border-blue-200 h-full overflow-y-auto ${
              isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
            }`}>
              <div className="p-8 h-full flex flex-col">
                {book.pages[currentPage].type === 'question' ? (
                  <>
                    <div className="mb-6">
                      <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Question
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-[300px]">
                      <p className="text-lg text-blue-800 text-center italic">
                        {book.pages[currentPage].content}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Your Insight
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                      <p className="text-blue-800 mb-4">
                        {book.pages[currentPage].content.text}
                      </p>
                      {book.pages[currentPage].content.points && (
                        <ul className="space-y-2 text-blue-700">
                          {book.pages[currentPage].content.points.map((point, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
                <div className="mt-auto pt-4 text-center">
                  <span className="text-xs text-blue-300 font-medium">
                    Page {currentPage + 1} of {book.pages.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Page Indicators and Navigation Arrows */}
        <div className="flex items-center justify-between px-6 py-3 bg-blue-50 border-t border-blue-100">
          {/* Left Chevron */}
          {currentPage > 0 && (
            <button
              onClick={() => flipPage('prev')}
              className="w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Empty div for spacing when left chevron is hidden */}
          {currentPage === 0 && <div className="w-10 h-10"></div>}

          {/* Dot Indicators */}
          <div className="flex space-x-2">
            {book.pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => !isFlipping && setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === currentPage
                    ? 'bg-blue-600 scale-125'
                    : 'bg-blue-200 hover:bg-blue-300'
                }`}
              />
            ))}
          </div>

          {/* Right Chevron */}
          {currentPage < book.pages.length - 1 && (
            <button
              onClick={() => flipPage('next')}
              className="w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Empty div for spacing when right chevron is hidden */}
          {currentPage === book.pages.length - 1 && <div className="w-10 h-10"></div>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 p-4 bg-blue-50 border-t border-blue-100">
          <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Download PDF">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Print">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Order">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookPreviewModal;
