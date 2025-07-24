import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Pencil } from 'lucide-react';

const EditUserCollectionsModal = ({
  collection,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting
}) => {
  const [editedName, setEditedName] = useState(collection.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleSave = () => {
    onSave(editedName);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
    } else {
      onDelete();
    }
  };

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

        {/* Delete Button */}
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={handleDelete}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
              showDeleteConfirm
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            } transition-colors`}
            disabled={isDeleting}
          >
            <Trash2 className="w-5 h-5" />
            {isDeleting ? 'Deleting...' : showDeleteConfirm ? 'Confirm Delete' : 'Delete Collection'}
          </button>
          {showDeleteConfirm && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              This will permanently delete the collection and all its insights
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditUserCollectionsModal;
