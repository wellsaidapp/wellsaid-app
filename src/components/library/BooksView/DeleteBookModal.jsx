import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';

const DeleteBookModal = ({
  book,
  onClose,
  onDelete,
  isDeleting
}) => {
  return createPortal(
    <div className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete "{book?.name}"?
          </h3>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm">
          This will permanently delete the book and all its contents.
          This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteBookModal;
