import React from 'react';
import { Book, Heart, FilePen, Library } from 'lucide-react';

import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { useUserCollections } from '../../../context/UserCollectionsContext';

const BookItem = ({
  book,
  onViewBook,
  onStartNewBook,
  isCreating = false,
  entryOrder = [],
  insights = []
}) => {

  const { systemCollections } = useSystemCollections();
  const { userCollections, loading } = useUserCollections();
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                {book.name}
                {book.status === 'Draft' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    <FilePen className="w-3 h-3" />
                    Draft
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{book.description}</p>

              {/* Collection Pills */}
              {book.collections?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {book.collections.map(collectionId => {
                    const collection = [...systemCollections, ...userCollections].find(c => c.id === collectionId);
                    return collection ? (
                      <span
                        key={`book-col-${collectionId}`}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        <Library className="w-3 h-3 mr-1" />
                        {collection.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Date Saved */}
              {book.savedOn && (
                <div className="text-xs text-gray-500 mb-2">
                  Saved {formatDate(book.savedOn)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 border-t border-gray-100">
          <div className="flex items-center justify-between pt-3">
            {book.personId ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {book.personName?.charAt(0).toUpperCase() || 'B'}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  Shared with {book.personName}
                </span>
              </div>
            ) : (
              <div /> // empty spacer to keep alignment
            )}
            <button
              onClick={() => onViewBook(book)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              {book.status === 'Draft' ? 'Continue Editing' : 'View Book'}
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
