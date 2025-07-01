import React from 'react';
import CollectionItem from './CollectionItem';

const CollectionsList = ({
  systemCollections = [],
  userCollections = [],
  groupedEntries = {},
  expandedCollection,
  onToggleCollection,
  onAddToCollection,
  showInactiveCollections,
  onToggleInactiveCollections,
  inactiveCollections = [],
  startQuickCaptureFromCollection,
  individuals,
  collections,
  onEntryUpdate,
  onEntryDelete,
  onCollectionToggle,
  onRecipientToggle
}) => {
  // Filter active system collections that have entries
  const activeSystemCollections = systemCollections.filter(
    collection => groupedEntries[collection.id]?.length > 0
  );

  // Filter user collections that have entries
  const activeUserCollections = userCollections.filter(
    collection => groupedEntries[collection.id]?.length > 0
  );

  return (
    <>
      {/* Active System Collections - Only show if there are any */}
      {activeSystemCollections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Active Collections</h3>
          <div className="space-y-2">
            {activeSystemCollections.map(collection => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                entries={groupedEntries[collection.id]}
                isActive={true}
                expanded={expandedCollection === collection.id}
                onToggle={() => onToggleCollection(collection.id)}
                onAddToCollection={onAddToCollection}
                individuals={individuals}
                collections={collections}
                systemCollections={systemCollections}
                onEntryUpdate={onEntryUpdate}
                onEntryDelete={onEntryDelete}
                onCollectionToggle={onCollectionToggle}
                onRecipientToggle={onRecipientToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* User Collections - Only show if there are any */}
      {activeUserCollections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Special Occasion Collections</h3>
          <div className="space-y-2">
            {activeUserCollections.map(collection => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                entries={groupedEntries[collection.id] || []}
                isActive={true}
                expanded={expandedCollection === collection.id}
                onToggle={() => onToggleCollection(collection.id)}
                showRecipient={true}
                onAddToCollection={onAddToCollection}
                individuals={individuals}
                collections={collections}
                systemCollections={systemCollections}
                onEntryUpdate={onEntryUpdate}
                onEntryDelete={onEntryDelete}
                onCollectionToggle={onCollectionToggle}
                onRecipientToggle={onRecipientToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State Messages */}
      {activeSystemCollections.length === 0 && activeUserCollections.length === 0 && (
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-md inline-block">
            No active collections yet. Create or add insights to collections to see them here.
          </div>
        </div>
      )}

      {/* Inactive Collections */}
      {(inactiveCollections.length > 0 || activeSystemCollections.length === 0) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-gray-700">Inactive Collections</h3>
            <button
              onClick={onToggleInactiveCollections}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showInactiveCollections ? 'Hide' : 'Show All'}
            </button>
          </div>

          {showInactiveCollections && inactiveCollections.length > 0 && (
            <div className="space-y-2">
              {inactiveCollections.map(collection => (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  entries={[]}
                  isActive={false}
                  expanded={false}
                  onToggle={() => {}}
                  onAddToCollection={startQuickCaptureFromCollection}
                />
              ))}
            </div>
          )}

          {showInactiveCollections && inactiveCollections.length === 0 && (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
              No inactive collections
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CollectionsList;
