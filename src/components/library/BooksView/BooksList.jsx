import { useState } from 'react';
import BookItem from './BookItem';
import {
  Heart,
  Plus,
  CalendarArrowUp,
  CalendarArrowDown,
  Filter,
  X,
  ChevronDown,
  Book
} from 'lucide-react';

import { SYSTEM_COLLECTIONS } from '../../../constants/systemCollections';
import { CUSTOM_COLLECTIONS } from '../../../constants/collections';

const BooksList = ({
  books,
  onViewBook,
  onStartNewBook,
  isCreating,
  entryOrder,
  insights,
  sortDirection,
  onToggleSortDirection,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');

  const filteredBooks = books.filter(book => {
    const matchesStatus = statusFilter ? book.status === statusFilter : true;
    const matchesPerson = personFilter ? book.personName === personFilter : true;
    const matchesCollection = collectionFilter
      ? (book.collections || []).includes(collectionFilter)
      : true;

    return matchesStatus && matchesPerson && matchesCollection;
  });

  const hasActiveFilters = statusFilter || personFilter || collectionFilter;
  const activeFilterCount = [statusFilter, personFilter, collectionFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setStatusFilter('');
    setPersonFilter('');
    setCollectionFilter('');
  };

  return (
    <div className="mb-6">
      {/* Create New Book */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-6">
        <div className="flex items-center mb-2">
          <Heart className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium text-gray-800">Create a New Book</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Turn your insights into a meaningful book for someone special.
        </p>
        <button
          onClick={onStartNewBook}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          {isCreating ? 'Continue Book Creation' : 'Start New Book'}
        </button>
      </div>

      {/* Bookshelf Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Living Bookshelf</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{filteredBooks.length} books</span>
          <button
            onClick={onToggleSortDirection}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Toggle sort order"
          >
            {sortDirection === 'asc' ? (
              <CalendarArrowUp className="w-4 h-4" />
            ) : (
              <CalendarArrowDown className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Optional Description */}
      <p className="text-sm text-gray-600 mb-4">
        Curated collections and books you've created to share with your loved ones.
      </p>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Filter Books</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Person Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
              <div className="relative">
                <select
                  value={personFilter}
                  onChange={e => setPersonFilter(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All people</option>
                  {[...new Set(books.map(b => b.personName))].map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Collection Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              <div className="relative">
                <select
                  value={collectionFilter}
                  onChange={e => setCollectionFilter(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All collections</option>
                  {[...new Set(books.flatMap(b => b.collections || []))]
                    .map(collectionId => {
                      const allCollections = [...SYSTEM_COLLECTIONS, ...CUSTOM_COLLECTIONS];
                      const collection = allCollections.find(c => c.id === collectionId);
                      return collection ? (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ) : null;
                    })}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('')} className="text-blue-600 hover:text-blue-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {personFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Person: {personFilter}
              <button onClick={() => setPersonFilter('')} className="text-blue-600 hover:text-blue-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {collectionFilter && (() => {
            const allCollections = [...SYSTEM_COLLECTIONS, ...CUSTOM_COLLECTIONS];
            const collection = allCollections.find(c => c.id === collectionFilter);
            return (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Collection: {collection?.name || collectionFilter}
                <button onClick={() => setCollectionFilter('')} className="text-blue-600 hover:text-blue-800">
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })()}
        </div>
      )}

      {/* Book Cards */}
      <div className="space-y-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <BookItem
              key={book.id}
              book={book}
              onViewBook={onViewBook}
              isCreating={isCreating && book.id === 'new'}
              entryOrder={entryOrder}
              insights={insights}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Book className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No books match your current filters.</p>
            <button onClick={clearAllFilters} className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;
