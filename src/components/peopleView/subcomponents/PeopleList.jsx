
import {
  Plus,
  CaseSensitive,
  Sparkles,
  Library,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowDown01,
  ArrowDown10,
  Type
} from 'lucide-react';
import PersonCard from './PersonCard';
import { useState } from 'react';

const sortOptions = ['name', 'insights', 'collections'];

const PeopleList = ({
  individuals,
  insights,
  onSelectPerson,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  onAddNewPerson
}) => {

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

      // Get comparison value based on selected sortField
      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'insights':
          aVal = insights.filter(i => i.recipients?.includes(a.id)).length;
          bVal = insights.filter(i => i.recipients?.includes(b.id)).length;
          break;
        case 'collections':
          aVal = a.collections?.length || 0;
          bVal = b.collections?.length || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
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
        {individuals.length > 0 ? (
          individuals.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              insights={insights}
              onClick={() => onSelectPerson(person)}
            />
          ))
        ) : (
          <div className="text-sm text-gray-400 italic text-center py-4">
            No people to display.
          </div>
        )}

        <button
          onClick={onAddNewPerson}
          className="w-full mt-2 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add New Person
        </button>
      </div>
    </div>
  );
};

export default PeopleList;
