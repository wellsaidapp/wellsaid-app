import { Search, X, Filter, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const SearchAndFilterBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  selectedFilters,
  toggleFilter,
  allPersonIds,
  individuals,
  insights, // Add insights prop to check for active names
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activePersonIds, setActivePersonIds] = useState([]);

  // Calculate which person IDs are actually present in insights
  useEffect(() => {
    const activeIds = new Set();
    insights.forEach(insight => {
      if (insight.personIds) {
        insight.personIds.forEach(id => activeIds.add(id));
      }
    });
    setActivePersonIds(Array.from(activeIds));
  }, [insights]);

  // Only show filter button if there are active names to filter by
  const shouldShowFilterButton = activePersonIds.length > 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-white/50">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your insight..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isSearching ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>

        {shouldShowFilterButton && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            disabled={!shouldShowFilterButton}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            } ${!shouldShowFilterButton ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filters Section */}
      {showFilters && shouldShowFilterButton && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">FILTER BY:</span>

            {/* Recipient Filters - only show active names */}
            {activePersonIds.map((id) => {
              const person = individuals.find((p) => p.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleFilter('personIds', id)}
                  className={`px-2.5 py-1 rounded-full text-xs flex items-center ${
                    selectedFilters.personIds.includes(id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-3 h-3 mr-1" />
                  {person?.name || 'Unknown'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterBar;
