import { useState, useEffect, useMemo } from 'react';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { SquareArrowLeft, Search, ChevronDown, X } from 'lucide-react';

const SystemCollectionsList = ({
  groupedCollections,
  selectedCollections,
  onCollectionToggle,
  searchQuery
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const isGroupSelected = (group) => {
    return group.collections.some(collection => selectedCollections.includes(collection.id));
  };

  const handleGroupToggle = (group) => {
    const allSelected = group.collections.every(collection => selectedCollections.includes(collection.id));

    group.collections.forEach(collection => {
      onCollectionToggle(collection.id, !allSelected);
    });
  };

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedCollections;

    return groupedCollections
      .map(group => ({
        ...group,
        collections: group.collections.filter(collection =>
          collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }))
      .filter(group => group.collections.length > 0);
  }, [groupedCollections, searchQuery]);

  return (
    <div className="space-y-2">
      {filteredGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.name);
        const isSelected = isGroupSelected(group);
        const someSelected = group.collections.some(c => selectedCollections.includes(c.id));

        return (
          <div key={group.name} className="group">
            {/* Main Group Item */}
            <div
              className={`
                flex items-center justify-between p-4
                border border-gray-100 rounded-xl cursor-pointer
                transition-all duration-200 ease-in-out
                hover:shadow-sm
                ${someSelected ? `border-[${group.color}] bg-[${group.color}]/10` : 'bg-white'}
                ${isExpanded ? 'rounded-b-none border-b-0' : ''}
              `}
              onClick={() => toggleGroup(group.name)}
              style={{
                borderColor: someSelected ? group.color : '#e5e7eb',
                backgroundColor: someSelected ? `${group.color}1a` : 'white'
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`
                    w-5 h-5 border-2 rounded-md flex items-center justify-center
                    transition-all duration-200
                    ${isSelected
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 hover:border-blue-400'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGroupToggle(group);
                  }}
                >
                  {isSelected && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-gray-900">{group.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {group.collections.length} collections
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`
                  w-5 h-5 text-gray-400 transition-transform duration-200
                  ${isExpanded ? 'rotate-180' : ''}
                `}
              />
            </div>

            {/* Subcollections */}
            {isExpanded && (
              <div className="border border-gray-100 border-t-0 rounded-b-xl bg-white">
                <div className="py-2">
                  {group.collections.map((collection) => {
                    const isCollectionSelected = selectedCollections.includes(collection.id);

                    return (
                      <div
                        key={collection.id}
                        className={`
                          flex items-center gap-3 px-6 py-3 cursor-pointer
                          transition-colors duration-150
                          hover:bg-gray-50
                          ${isCollectionSelected ? 'bg-blue-50/50' : ''}
                        `}
                        onClick={() => onCollectionToggle(collection.id, !isCollectionSelected)}
                      >
                        <div
                          className={`
                            w-5 h-5 border-2 rounded-md flex items-center justify-center
                            transition-all duration-200
                            ${isCollectionSelected
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-gray-300 hover:border-blue-400'}
                          `}
                        >
                          {isCollectionSelected && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="font-medium text-gray-800">{collection.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CollectionSelectionView = ({ selectedPerson, onCollectionsSelected, onBack }) => {
  const { systemCollections } = useSystemCollections();
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Group collections by their collectionGroup
  const groupedCollections = useMemo(() => {
    return systemCollections.reduce((groups, collection) => {
      const groupName = collection.collectionGroup;
      if (!groups[groupName]) {
        groups[groupName] = {
          name: groupName,
          color: collection.color,
          collections: []
        };
      }
      groups[groupName].collections.push(collection);
      return groups;
    }, {});
  }, [systemCollections]);

  const handleContinue = () => {
    onCollectionsSelected({
      selectedCollections,
      isReturning: false
    });
  };

  if (!selectedPerson) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 z-50 flex flex-col">
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center max-w-4xl mx-auto">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4">
              <SquareArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold">No person selected</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 mb-4">
                Please go back and select a person first.
              </p>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                ← Back to Person Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 z-50 flex flex-col">
      {/* Header with title and person chip */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4">
              <SquareArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold">Select Collections</h2>
          </div>

          <div className="flex-shrink-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium break-words max-w-[200px]">
            {selectedPerson.name}
          </div>
        </div>
      </div>

      {/* Optional helper text and search */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3 space-y-3">
        <p className="text-sm text-gray-500">
          Optional - select collections you would like to include
        </p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search collections..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main content with extra bottom padding */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto p-4">
          <SystemCollectionsList
            groupedCollections={Object.values(groupedCollections)}
            selectedCollections={selectedCollections}
            onCollectionToggle={(collectionId, isSelected) => {
              setSelectedCollections(prev =>
                isSelected
                  ? [...prev, collectionId]
                  : prev.filter(id => id !== collectionId)
              );
            }}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Full-width Continue button with blue gradient */}
      <div className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 z-40">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Continue {selectedCollections.length > 0 && `(${selectedCollections.length} selected)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionSelectionView;
