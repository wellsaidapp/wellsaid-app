import React from 'react';
import { Book, Heart } from 'lucide-react';

const BookItem = ({
  book,
  onViewBook,
  onStartNewBook,
  isCreating = false,
  entryOrder = [],
  insights = []
}) => {
  return (
    <>
      {/* Book List Item */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
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
                  {book.recipient?.charAt(0).toUpperCase() || 'B'}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {book.recipient ? `Shared with ${book.recipient}` : 'No recipient'}
              </span>
            </div>
            <button
              onClick={() => onViewBook(book)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              View Book
            </button>
          </div>
        </div>
      </div>

      {/* Creation Preview (conditionally shown) */}
      {isCreating && entryOrder.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <h4 className="font-medium text-gray-800 mb-3">Preview</h4>
          <div className="space-y-2">
            {entryOrder.slice(0, 3).map((entryId, index) => {
              const entry = insights.find(e => e.id === entryId);
              return entry ? (
                <div key={entryId} className="p-2 bg-gray-50 rounded text-sm text-gray-700 truncate">
                  {entry.question || entry.text || `Page ${index + 1}`}
                </div>
              ) : null;
            })}
            {entryOrder.length > 3 && (
              <div className="text-center text-sm text-gray-500">
                + {entryOrder.length - 3} more pages
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookItem;
