import { Book } from 'lucide-react';

const SharedBooksSection = ({ books, setSelectedBook }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Shared Books</h3>
    <p className="text-sm text-gray-600 mb-4">
      Books you've prepared for special occasions and milestones.
    </p>

    <div className="space-y-4">
      {books.map(book => (
        <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="p-4">
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-lg ${book.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                <Book className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{book.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.description}</p>
              </div>
            </div>
          </div>

          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {book.recipient.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  Shared with {book.recipient}
                </span>
              </div>
              <button
                onClick={() => setSelectedBook(book)}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                View Book
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SharedBooksSection;
