import { Book } from 'lucide-react';
import BookItem from '../Library/BooksView/BookItem';

const SharedBooksSection = ({ books, onViewBook }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Shared Books</h3>
    <p className="text-sm text-gray-600 mb-4">
      Books you've prepared for special occasions and milestones.
    </p>

    {books.length === 0 ? (
      <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-md inline-block">
        No books have been created for this person yet.
      </div>
    ) : (
      <div className="space-y-4">
        {books.map(book => (
          <BookItem
            key={book.id}
            book={book}
            onViewBook={onViewBook} // Alias to match BookItem prop
          />
        ))}
      </div>
    )}
  </div>
);

export default SharedBooksSection;
