import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Pencil } from 'lucide-react';

const EditUserCollectionsModal = ({
  collection,
  onClose,
  onSave,
  onDelete,
  isSaving,
  onDeleteSuccess
}) => {
  const [editedName, setEditedName] = useState(collection.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    onSave(editedName);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);

    try {
      await onDelete();
      onDeleteSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(error.message);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    // Prevent iOS pull-to-refresh by nudging scroll
    if (window.scrollY === 0) {
      window.scrollTo(0, 1); // scrolls down by 1px
    }

    return () => {
      // Restore scroll
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Collection Settings
        </h3>

        {/* Name Editing Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collection Name
          </label>
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    handleSave();
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : <Save className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 px-3 py-2">{collection.name}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Delete section */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          {!showDeleteConfirm ? (
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Delete Collection
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Are you sure you want to permanently delete "{collection.name}"?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    isDeleting
                      ? 'bg-red-400 text-white'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  } transition-colors`}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </div>
          )}
          {deleteError && (
            <p className="text-red-500 text-sm mt-2 text-center">{deleteError}</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditUserCollectionsModal;
