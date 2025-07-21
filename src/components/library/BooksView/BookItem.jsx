import React, { useState } from 'react';
import { Book, Heart, FilePen, Library, Share2, BookOpen, Trash2 } from 'lucide-react';
import DeleteBookModal from './DeleteBookModal';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { useUserCollections } from '../../../context/UserCollectionsContext';

const BookItem = ({
  book,
  onViewBook,
  onDeleteBook,
  onStartNewBook,
  userData,
  isCreating = false,
  entryOrder = [],
  insights = [],
  setIsAnyModalOpen
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
    setIsAnyModalOpen?.(true); // prevent background scroll
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setIsAnyModalOpen?.(false); // restore scroll
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteBook(book);
    } catch (error) {
      console.error("Failed to delete book:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
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
            <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent flex item overflow */}
              <div className="flex items-start gap-3 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="truncate">{book.name}</span>
                    {book.status === 'Draft' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex-shrink-0">
                        <FilePen className="w-3 h-3" />
                        Draft
                      </span>
                    )}
                  </h3>
                </div>
                {/* Shared Status Indicator */}
                {book.hasBeenShared && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <Share2 className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">Shared</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{book.description}</p>

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
                  Created for {book.personName}
                </span>
              </div>
            ) : (
              <div /> // empty spacer to keep alignment
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteClick(book)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete book"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewBook(book)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title={book.status === 'Draft' ? 'Continue editing' : 'View book'}
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
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
      {/* Modal */}
      {showDeleteModal && (
        <DeleteBookModal
          book={book}
          onClose={handleCloseDeleteModal}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default BookItem;
