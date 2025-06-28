import React from 'react';
import { Library, Book } from 'lucide-react';

const ViewModeToggle = ({
  viewMode,
  setViewMode,
  collectionFilter,
  setCollectionFilter
}) => {
  return (
    <div className="space-y-4">
      {/* Main View Toggle */}
      <div className="flex bg-white rounded-lg p-1 mb-4 relative">
        <button
          onClick={() => setViewMode('collections')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            viewMode === 'collections'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Library className="w-4 h-4" />
          Collections
        </button>
        <button
          onClick={() => setViewMode('books')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            viewMode === 'books'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Book className="w-4 h-4" />
          Books
        </button>
      </div>
    </div>
  );
};

export default ViewModeToggle;
