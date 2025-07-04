import React from 'react';
import { Heart, Plus, GripVertical } from 'lucide-react';

const CreateBook = ({
  currentView,
  entryOrder = [],
  insights = [],
  onStartNewBook,
  onContinueArranging
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
      {/* Header */}
      <div className="flex items-center mb-2">
        <Heart className="w-5 h-5 text-blue-600 mr-2" />
        <span className="font-medium text-gray-800">Create a New Book</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Turn your insights into a meaningful book for someone special.
      </p>

      {/* Main Action Button */}
      <button
        onClick={onStartNewBook}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        'Start New Book'
      </button>
    </div>
  );
};

export default CreateBook;
