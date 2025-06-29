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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
      <div className="relative w-full max-w-md aspect-square">
        {/* Top Control Bar */}
        <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-4 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-all focus:outline-none focus:ring-0"
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-800" />
            </button>

            {/* Expanded Actions */}
            <div className={`flex items-center ml-2 transition-all duration-200 overflow-hidden ${isMenuOpen ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0'}`}>
              <div className="flex gap-2 bg-white bg-opacity-90 rounded-full pl-2 pr-3 py-1 shadow-lg backdrop-blur-sm">
                <button className="p-1.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-0" title="Share">
                  <Share2 className="w-4 h-4 text-black-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-0" title="Add to Cart">
                  <ShoppingCart className="w-4 h-4 text-black-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-0" title="Edit">
                  <Edit className="w-4 h-4 text-black-600" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-all focus:outline-none focus:ring-0"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-800" />
          </button>
        </div>

        {/* Book Content */}
        <div className="relative w-full h-full bg-white shadow-2xl overflow-hidden rounded-2xl">
          {book.pages[currentPage].image ? (
            <div className="w-full h-full p-4 flex items-center justify-center bg-white">
              <img
                src={book.pages[currentPage].image}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 p-8">
              {book.pages[currentPage].type === 'question' ? (
                <p className="text-xl italic text-gray-700">{book.pages[currentPage].content}</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-800 mb-4">{book.pages[currentPage].content.text}</p>
                  <ul className="space-y-2 text-gray-700">
                    {book.pages[currentPage].content.points.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center items-center gap-8">
          <button
            onClick={() => flipPage('prev')}
            disabled={currentPage === 0}
            className={`p-3 text-white rounded-full ${currentPage === 0 ? 'opacity-30 cursor-default' : 'hover:bg-white hover:bg-opacity-10'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span className="text-sm text-white font-medium">
            {currentPage + 1} / {book.pages.length}
          </span>

          <button
            onClick={() => flipPage('next')}
            disabled={currentPage === book.pages.length - 1}
            className={`p-3 text-white rounded-full ${currentPage === book.pages.length - 1 ? 'opacity-30 cursor-default' : 'hover:bg-white hover:bg-opacity-10'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookPreviewModal;
