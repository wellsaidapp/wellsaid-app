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
  return (
    <>
      {/* Active System Collections */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Active Collections</h3>
        <div className="space-y-2">
          {systemCollections
            .filter(collection => groupedEntries[collection.id]?.length > 0)
            .map(collection => (
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
            ))
          }
        </div>
      </div>

      {/* User Collections */}
      {userCollections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Special Occasion Collections</h3>
          <div className="space-y-2">
            {userCollections.map(collection => (
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

      {/* Inactive Collections */}
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

        {showInactiveCollections && (
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
      </div>
    </>
  );
};

export default CollectionsList;
