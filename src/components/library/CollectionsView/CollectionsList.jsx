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
  onClearFilters,
  isPersonView = false,
  currentPersonId = null,
  noMatchesFound
}) => {
  const [sortDescending, setSortDescending] = useState(true);
  const [showInactiveOptions, setShowInactiveOptions] = useState(false);
  const sortCollections = (collectionsArray) => {
    return [...collectionsArray].sort((a, b) => {
      const countA = groupedEntries[a.id]?.length || 0;
      const countB = groupedEntries[b.id]?.length || 0;
      return sortDescending ? countB - countA : countA - countB;
    });
  };

  // For person view, we only show collections with entries for that person
  // For library view, we show all collections in appropriate buckets
  const activeSystemCollections = isPersonView
    ? sortCollections(systemCollections.filter(c => groupedEntries[c.id]?.length > 0))
    : sortCollections(systemCollections);

  const activeUserCollections = isPersonView
    ? sortCollections(
        userCollections.filter(c => {
          // Convert both IDs to strings for consistent comparison
          const collectionPersonId = String(c.metadata?.personId);
          const currentPersonIdStr = String(currentPersonId);

          // Only show collections specifically tagged to this person
          return collectionPersonId === currentPersonIdStr;
        })
      )
    : sortCollections(userCollections);

  // Simplified filter function since filtering is now done in LibraryView
  const filterEntries = (entries = []) => {
    return entries || [];
  };

  // Determine visible collections based on whether they have entries
  const getVisibleCollections = (collections) => {
    return collections.filter(collection => {
      const entries = groupedEntries[collection.id] || [];
      return entries.length > 0;
    });
  };

  const visibleSystemCollections = getVisibleCollections(activeSystemCollections);

  // For library view, determine inactive collections
  const libraryInactiveCollections = !isPersonView
    ? systemCollections.filter(c => !groupedEntries[c.id]?.length)
    : [];

  return (
    <>
      {/* Filter UI (only for library view) */}
      {!isPersonView && (selectedFilters.personIds?.length > 0 ||
        selectedFilters.entryTypes?.length > 0 ||
        selectedFilters.topics?.length > 0) && (
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {(selectedFilters.personIds?.length || 0) +
                (selectedFilters.entryTypes?.length || 0) +
                (selectedFilters.topics?.length || 0)}{' '}
              filter
              {((selectedFilters.personIds?.length || 0) +
                (selectedFilters.entryTypes?.length || 0) +
                (selectedFilters.topics?.length || 0)) > 1
                ? 's'
                : ''}
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

      {noMatchesFound && (
        <div className="text-center text-sm text-gray-500 py-6">
          No insights matched your search or filters.
        </div>
      )}

      {/* Active System Collections */}
      {visibleSystemCollections.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-gray-700">
              {isPersonView ? 'Shared System Collections' : 'Active Collections'}
            </h3>
            {!isPersonView && (
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
            )}
          </div>
          <div className="space-y-2">
            {visibleSystemCollections.map(collection => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                entries={filterEntries(groupedEntries[collection.id] || [])}
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
            ))}
          </div>
        </div>
      )}

      {/* User Collections */}
      {activeUserCollections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">
            {isPersonView ? 'Shared Custom Collections' : 'Custom Collections'}
          </h3>
          <div className="space-y-2">
            {activeUserCollections.map(collection => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                entries={filterEntries(groupedEntries[collection.id] || [])}
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
            ))}
          </div>
        </div>
      )}

      {visibleSystemCollections.length === 0 && activeUserCollections.length === 0 && (
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-md inline-block">
            {isPersonView
              ? `Collections shared with ${individuals[0]?.name || 'this person'} will appear here once insights have been added.`
              : 'Your collections with insights will appear here once you begin capturing.'}
          </div>
        </div>
      )}

      {/* Inactive Collections (only for library view) */}
      {!isPersonView && (libraryInactiveCollections.length > 0 || systemCollections.length === 0) && (
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

          {showInactiveCollections && libraryInactiveCollections.length > 0 && (
            <div className="space-y-2">
              {libraryInactiveCollections.map(collection => (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  entries={[]}
                  isActive={false}
                  expanded={false}
                  onToggle={() => {}}
                  onAddToCollection={startQuickCaptureFromCollection}
                  individuals={individuals}
                  collections={collections}
                  systemCollections={systemCollections}
                  onEntryUpdate={onEntryUpdate}
                  onEntryDelete={onEntryDelete}
                  onCollectionToggle={onCollectionToggle}
                  onPersonToggle={onPersonToggle}
                />
              ))}
            </div>
          )}

          {showInactiveCollections && libraryInactiveCollections.length === 0 && (
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
