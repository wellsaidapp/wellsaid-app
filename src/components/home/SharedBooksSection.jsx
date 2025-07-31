import { BookOpen } from 'lucide-react';
import BookItem from '../library/BooksView/BookItem';

const SharedBooksSection = ({
  books,
  onViewBook,
  setCurrentView,
  setLibraryDefaultViewMode,
  userData,
  showViewAll = true,
  onDeleteBook
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Shared Books</h3>
        {showViewAll && (
          <button
            onClick={() => {
              setLibraryDefaultViewMode('books');
              setCurrentView('library');
            }}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            View All
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Books you've prepared for special occasions and milestones.
      </p>

      {books.length === 0 ? (
        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-md inline-block">
          This is where your books will appear once you create them.
        </div>
      ) : (
        <div className="space-y-4">
          {books.map(book => (
            <BookItem
              key={book.id}
              book={book}
              onViewBook={onViewBook}
              userData={userData}
              onDeleteBook={(book) => onDeleteBook(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedBooksSection;
