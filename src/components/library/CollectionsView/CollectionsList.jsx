import { useState } from 'react';
import CollectionItem from './CollectionItem';
import { ArrowDownNarrowWide, ArrowDownWideNarrow } from 'lucide-react';

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
  onPersonToggle,
  selectedFilters = {},
  onClearFilters
}) => {

  const [sortDescending, setSortDescending] = useState(true);

  const sortCollections = (collectionsArray) => {
    return [...collectionsArray].sort((a, b) => {
      const countA = groupedEntries[a.id]?.length || 0;
      const countB = groupedEntries[b.id]?.length || 0;
      return sortDescending ? countB - countA : countA - countB;
    });
  };

  const activeSystemCollections = sortCollections(
    systemCollections.filter(
      collection => groupedEntries[collection.id]?.length > 0
    )
  );

  const activeUserCollections = sortCollections(
    userCollections.filter(
      collection => groupedEntries[collection.id]?.length > 0
    )
  );

  const filterEntries = (entries = []) => {
    if (!selectedFilters.personIds?.length) return entries;

    return entries.filter(entry =>
      entry.personIds?.some(id => selectedFilters.personIds.includes(id))
    );
  };

  const visibleSystemCollections = activeSystemCollections.filter(
    collection => filterEntries(groupedEntries[collection.id]).length > 0
  );

  const visibleUserCollections = activeUserCollections.filter(
    collection => filterEntries(groupedEntries[collection.id]).length > 0
  );

  return (
    <>
      {(selectedFilters.personIds.length > 0 ||
        selectedFilters.entryTypes.length > 0 ||
        selectedFilters.topics.length > 0) && (
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {selectedFilters.personIds.length +
                selectedFilters.entryTypes.length +
                selectedFilters.topics.length}{' '}
              filter{(selectedFilters.personIds.length +
                selectedFilters.entryTypes.length +
                selectedFilters.topics.length) > 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Active System Collections - Only show if there are any */}
      {visibleSystemCollections.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-gray-700">Active Collections</h3>
            <button
              onClick={() => setSortDescending(prev => !prev)}
              className="text-gray-400 hover:text-gray-600"
              title="Sort by number of entries"
            >
              {sortDescending ? (
                <ArrowDownWideNarrow className="w-4 h-4" />
              ) : (
                <ArrowDownNarrowWide className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="space-y-2">
            {activeSystemCollections.map(collection => {
              const filteredEntries = filterEntries(groupedEntries[collection.id]);
              if (filteredEntries.length === 0) return null;

              return (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  entries={filteredEntries}
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
                  onPersonToggle={onPersonToggle}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* User Collections - Only show if there are any */}
      {visibleUserCollections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Special Occasion Collections</h3>
          <div className="space-y-2">
            {activeUserCollections.map(collection => {
              const filteredEntries = filterEntries(groupedEntries[collection.id]);
              if (filteredEntries.length === 0) return null;

              return (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  entries={filteredEntries}
                  isActive={true}
                  expanded={expandedCollection === collection.id}
                  showRecipient={true}
                  onToggle={() => onToggleCollection(collection.id)}
                  onAddToCollection={onAddToCollection}
                  individuals={individuals}
                  collections={collections}
                  systemCollections={systemCollections}
                  onEntryUpdate={onEntryUpdate}
                  onEntryDelete={onEntryDelete}
                  onCollectionToggle={onCollectionToggle}
                  onPersonToggle={onPersonToggle}
                />
              );
            })}
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
                  entries={filterEntries(groupedEntries[collection.id])}
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
