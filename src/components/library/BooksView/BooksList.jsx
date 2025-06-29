import React from 'react';
import BookItem from './BookItem';
import { Book, Heart, Plus } from 'lucide-react';

const BooksList = ({
  books,
  onViewBook,
  onStartNewBook,
  isCreating,
  entryOrder,
  insights
}) => {
  return (
    <div>
      <div className="mb-6">
        {/* Creation Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-3">
          <div className="flex items-center mb-2">
            <Heart className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-gray-800">Create a New Book</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Turn your insights into a meaningful book for someone special.
          </p>
          <button
            onClick={onStartNewBook}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {isCreating ? 'Continue Book Creation' : 'Start New Book'}
          </button>
        </div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Living Bookshelf</h2>
          <span className="text-sm text-gray-500">{books.length} books</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Curated collections and books you've created to share with your loved ones.
        </p>

        <div className="space-y-4">
          {books.map(book => (
            <BookItem
              key={book.id}
              book={book}
              onViewBook={onViewBook}
              isCreating={isCreating && book.id === 'new'}
              entryOrder={entryOrder}
              insights={insights}
            />
          ))}
        </div>
      </div>


    </div>
  );
};

export default BooksList;
