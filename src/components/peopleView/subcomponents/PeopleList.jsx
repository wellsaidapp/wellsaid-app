
import {
  Plus,
  CaseSensitive,
  Sparkles,
  Library,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowDown01,
  ArrowDown10,
  Type,
  Check
} from 'lucide-react';
import PersonCard from './PersonCard';
import { useState } from 'react';

const sortOptions = ['name', 'insights', 'collections'];

const PeopleList = ({
  individuals,
  insights,
  totalCollectionsCount = 20,
  onSelectPerson,
  onPersonClick,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  onAddNewPerson,
  selectedPersonId = null,
  selectionMode = false
}) => {
  console.log("👥 PeopleList rendering with people:", individuals);
  individuals.forEach(p => {
    console.log(`🧑 ${p.name}:`, {
      insightCount: p.insightCount,
      systemCollectionCount: p.systemCollectionCount,
    });
  });
  const toggleSortField = () => {
    const currentIndex = sortOptions.indexOf(sortField);
    const nextField = sortOptions[(currentIndex + 1) % sortOptions.length];
    setSortField(nextField);

    // Default to 'desc' for insights and collections, 'asc' for name
    if (nextField === 'insights' || nextField === 'collections') {
      setSortDirection('desc');
    } else {
      setSortDirection('asc');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getIconForSortField = () => {
    switch (sortField) {
      case 'name':
        return <Type size={18} className="text-gray-500" />;
      case 'insights':
        return <Sparkles size={18} className="text-gray-500" />;
      case 'collections':
        return <Library size={18} className="text-gray-500" />;
      default:
        return null;
    }
  };

  const getIconForSortDirection = () => {
    if (sortField === 'name') {
      return sortDirection === 'asc' ? (
        <ArrowDownAZ size={18} className="text-gray-500" />
      ) : (
        <ArrowDownZA size={18} className="text-gray-500" />
      );
    } else {
      return sortDirection === 'asc' ? (
        <ArrowDown01 size={18} className="text-gray-500" />
      ) : (
        <ArrowDown10 size={18} className="text-gray-500" />
      );
    }
  };

  const getSortedIndividuals = () => {
    return [...individuals].sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'name':
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
          break;

        case 'insights':
          aVal = a.insightCount || 0;
          bVal = b.insightCount || 0;
          break;

        case 'collections':
          aVal = a.systemCollectionCount || 0;
          bVal = b.systemCollectionCount || 0;
          break;

        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handlePersonClick = (person) => {
    if (selectionMode && onSelectPerson) {
      onSelectPerson(person);
    } else if (onPersonClick) {
      onPersonClick(person);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Your People</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="mr-1">Sort by:</span>
          <button onClick={toggleSortField}>{getIconForSortField()}</button>
          <button onClick={toggleSortDirection}>{getIconForSortDirection()}</button>
        </div>
      </div>

      <div className="space-y-3">
        {getSortedIndividuals().length > 0 ? (
          getSortedIndividuals().map(person => (
            <div
              key={person.id}
              className={`relative ${selectionMode ? 'cursor-pointer' : ''}`}
              onClick={() => handlePersonClick(person)}
            >
              <PersonCard
                person={person}
                insights={insights}
                totalCollectionsCount={totalCollectionsCount}
              />
              {selectionMode && selectedPersonId === person.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400 italic text-center py-4">
            No people to display.
          </div>
        )}

        {onAddNewPerson && (
          <button
            onClick={onAddNewPerson}
            className="w-full mt-2 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add New Person
          </button>
        )}
      </div>
    </div>
  );
};

export default PeopleList;
