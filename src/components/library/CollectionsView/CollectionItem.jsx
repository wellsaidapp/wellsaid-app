import React from 'react';
import CaptureCard from './CaptureCard'; // Make sure this import exists
import { ChevronDown, ChevronUp, PlusCircle, FolderOpen, Calendar } from 'lucide-react';

const CollectionItem = ({
  collection,
  collections,
  entries = [],
  isActive,
  expanded,
  onToggle,
  showRecipient = false,
  onAddToCollection,
  individuals,
  systemCollections,
  onEntryUpdate,
  onEntryDelete,
  onCollectionToggle,
}) => {
  return (
    <div className={`relative z-0 ${!isActive ? 'opacity-70' : ''}`}>
      <div
        onClick={isActive ? onToggle : () => onAddToCollection(collection)}
        className={`bg-white rounded-lg p-4 ${
          isActive ? 'cursor-pointer hover:bg-gray-50' : ''
        } transition-colors border ${
          isActive ? 'border-gray-200' : 'border-gray-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg ${
              isActive ? collection.color : 'bg-gray-300'
            } flex items-center justify-center mr-3`}>
              {collection.type === 'occasion' ? (
                <Calendar className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              ) : (
                <FolderOpen className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              )}
            </div>
            <div>
              <div className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                {collection.name}
              </div>
              <div className="text-sm text-gray-500">
                {entries.length} insights
                {showRecipient && collection.recipient && ` • For ${collection.recipient}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(collection);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <PlusCircle className="w-5 h-5 text-blue-700" />
                <span className="ml-1">Capture</span>
              </button>
            )}
            {isActive && (
              expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )
            )}
          </div>
        </div>
      </div>

      {isActive && expanded && entries.length > 0 && (
        <div className="pl-4 border-l-2 border-gray-200 ml-5 mt-2 space-y-3">
          {entries.map(entry => (
            <CaptureCard
              key={entry.id}
              entry={entry}
              individuals={individuals}
              collections={[...systemCollections, ...collections]}
              systemCollections={systemCollections}
              onEdit={(updatedEntry) => {
                if (typeof onEntryUpdate === 'function') {
                  onEntryUpdate(updatedEntry);
                }
              }}
              onDelete={(entryId) => onEntryDelete(entryId)}
              onCollectionToggle={(collectionId) => {
                if (typeof onCollectionToggle === 'function') {
                  onCollectionToggle(entry.id, collectionId);
                }
              }}
              onRecipientToggle={(recipientId) => onRecipientToggle(entry.id, recipientId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionItem;
