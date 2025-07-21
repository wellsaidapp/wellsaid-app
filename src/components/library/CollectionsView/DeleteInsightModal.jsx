import React from 'react';
import { createPortal } from 'react-dom';

const DeleteInsightModal = ({ onClose, onUnlink, onDelete, isDeleting, isUnlinking, showUnlink }) => {
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete this insight?
        </h3>

        {/* Dynamic Message */}
        <p className="text-gray-600 mb-6 text-sm">
          {showUnlink ? (
            <>
              You can delete this insight, removing it from all related collections,
              or unlink it from just this collection and keep it associated elsewhere.
            </>
          ) : (
            <>Click “Delete” to confirm permanent deletion.</>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {showUnlink && (
            <button
              onClick={onUnlink}
              className="px-4 py-2 bg-pink-100 text-red-700 hover:bg-pink-200 rounded-lg disabled:opacity-50"
              disabled={isUnlinking || isDeleting}
            >
              {isUnlinking ? 'Unlinking...' : 'Unlink'}
            </button>
          )}
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteInsightModal;
