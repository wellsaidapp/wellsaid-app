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

      {/* Preview Section (only shown in arrange mode) */}
      {currentView === 'arrangeBook' && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
          <h4 className="font-medium text-gray-800 mb-3">Arrange Your Pages</h4>
          <div className="space-y-2">
            {entryOrder.slice(0, 3).map((entryId, index) => {
              const entry = insights.find(e => e.id === entryId);
              return entry ? (
                <div key={entryId} className="flex items-center p-2 bg-gray-50 rounded">
                  <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 truncate">
                    {entry.question || entry.text || `Page ${index + 1}`}
                  </span>
                </div>
              ) : null;
            })}
            {entryOrder.length > 3 && (
              <div className="text-center text-sm text-gray-500">
                + {entryOrder.length - 3} more pages
              </div>
            )}
          </div>
          <button
            onClick={onContinueArranging}
            className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
          >
            Continue Arranging
          </button>
        </div>
      )}

      {/* Main Action Button */}
      <button
        onClick={onStartNewBook}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        {currentView === 'arrangeBook' ? 'Continue Book Creation' : 'Start New Book'}
      </button>
    </div>
  );
};

export default CreateBook;
