import { useState } from 'react';
import { X, Check, Folder, Bookmark } from 'lucide-react';

const TagEditor = ({
  entry,
  onClose,
  onSave,
  systemCollections = [],
  userCollections = []
}) => {
  const [selectedCollections, setSelectedCollections] = useState(entry.collections || []);

  const toggleCollection = (collectionId) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Organize Insight</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            Select collections for: <span className="font-medium">"{entry.question || entry.text?.substring(0, 30)}..."</span>
          </p>

          {/* System Collections */}
          <div className="mb-6">
            <h4 className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <Folder className="w-4 h-4 mr-2" />
              System Collections
            </h4>
            <div className="space-y-2">
              {systemCollections.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => toggleCollection(collection.id)}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    selectedCollections.includes(collection.id)
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${
                    selectedCollections.includes(collection.id)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedCollections.includes(collection.id) && (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                  <span>{collection.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Collections */}
          {userCollections.length > 0 && (
            <div>
              <h4 className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <Folder className="w-4 h-4 mr-2" />
                My Collections
              </h4>
              <div className="space-y-2">
                {userCollections.map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => toggleCollection(collection.id)}
                    className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                      selectedCollections.includes(collection.id)
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${
                      selectedCollections.includes(collection.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedCollections.includes(collection.id) && (
                        <Check className="w-3 h-3" />
                      )}
                    </div>
                    <span>{collection.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                ...entry,
                collections: selectedCollections
              });
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Check className="w-4 h-4 mr-1" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagEditor;
