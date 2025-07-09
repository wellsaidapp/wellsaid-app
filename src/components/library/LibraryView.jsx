import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SYSTEM_COLLECTIONS } from '../../constants/systemCollections';
import { CUSTOM_COLLECTIONS } from '../../constants/collections';
import { SHARED_BOOKS } from '../../constants/sharedBooks';
import { X } from 'lucide-react';

// Component imports
import BookCreationModal from './BookCreation/BookCreationModal';
import TagEditor from './utils/TagEditor';
import Header from '../appLayout/Header';
import SearchAndFilterBar from './utils/SearchAndFilterBar';
import ViewModeToggle from './utils/ViewModeToggle';
import CollectionsList from './CollectionsView/CollectionsList';
import BooksList from './BooksView/BooksList';
import BookPreviewModal from '../home/BookPreviewModal';
import CreateBook from './BookCreation/CreateBook';
import PDFViewerWrapper from './BooksView/PDFViewerWrapper';
import BookEditor from './BooksView/BookEditor';

const LibraryView = ({
  insights,
  individuals,
  setInsights,
  currentView,
  setCurrentView,
  setIndividuals,
  defaultViewMode = 'collections'
}) => {
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    topics: [],
    personIds: [],
    entryTypes: []
  });
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showBookCreation, setShowBookCreation] = useState(false);
  const [bookCreationStep, setBookCreationStep] = useState(0); // Add this to your state
  const [hasPerformedSearch, setHasPerformedSearch] = useState(false);
  const [showInactiveCollections, setShowInactiveCollections] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [entryOrder, setEntryOrder] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
    selectedCollections: [],
    selectedEntries: [],
    coverImage: null,
    backCoverNote: '',
    recipient: null,
    showTags: true,
    fontStyle: 'serif',
    isDraft: false
  });
  const [editingBook, setEditingBook] = useState(null);
  const [returnToViewer, setReturnToViewer] = useState(false);
  const [previousViewerState, setPreviousViewerState] = useState(null);

  const shouldUseSearchResults =
    searchQuery.trim().length > 0 && searchResults.length > 0;

  const insightsToUse = shouldUseSearchResults ||
    Object.values(selectedFilters).some(f => f.length > 0)
    ? searchResults
    : insights;

    const groupedEntries = useMemo(() => {
      return insightsToUse.reduce((acc, entry) => {
        // Handle unorganized entries (no collections)
        if (!entry.collections || entry.collections.length === 0) {
          if (!acc.unorganized) acc.unorganized = [];
          acc.unorganized.push(entry);
          return acc;
        }

        // Group entries by their collections
        entry.collections.forEach(collectionId => {
          if (!acc[collectionId]) acc[collectionId] = [];
          acc[collectionId].push(entry);
        });

        return acc;
      }, {});
    }, [insightsToUse]);

  const [sortDirection, setSortDirection] = useState('desc');

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const sortedBooks = [...SHARED_BOOKS].sort((a, b) => {
    const dateA = new Date(a.savedOn);
    const dateB = new Date(b.savedOn);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleEditBook = (book) => {
    setPreviousViewerState({
      book: selectedBook,
      showPdfViewer: true
    });
    setEditingBook(book);
    setSelectedBook(null); // Close the viewer
    setReturnToViewer(true);
  };

  // Derived state
  const filteredSystemCollections = SYSTEM_COLLECTIONS.filter(collection => {
    const hasEntries = groupedEntries[collection.id]?.length > 0;
    if (!hasEntries) return false;

    if (collectionFilter === 'person') {
      return groupedEntries[collection.id].some(entry => entry.personIds?.length > 0);
    }
    if (collectionFilter === 'occasion') {
      return false;
    }
    return true;
  });

  const filteredUserCollections = CUSTOM_COLLECTIONS.filter(collection => {
    const hasEntries = groupedEntries[collection.id]?.length > 0;
    if (!hasEntries) return false;

    if (collectionFilter === 'person') {
      return collection.type === 'person' ||
             groupedEntries[collection.id].some(entry => entry.personIds?.length > 0);
    }
    if (collectionFilter === 'occasion') {
      return collection.type === 'occasion';
    }
    return true;
  });

  // Handlers
  const performRAGSearch = async (query = '') => {
    // If query is empty and no filters, return early
    // if (query.trim() === '' && !Object.values(selectedFilters).some(f => f.length > 0)) {
    //   setSearchResults([]);
    //   setIsSearching(false);
    //   return;
    // }

    setIsSearching(true);

    try {
      const queryLower = query.toLowerCase().trim();
      const currentInsights = [...insights];

      const results = currentInsights.filter(entry => {
        // Text search (if query exists)
        if (queryLower && queryLower.length > 0) {
          const promptText = entry.prompt?.toLowerCase() || '';
          const responseText = entry.response?.toLowerCase() || '';
          if (!(promptText.includes(queryLower) || responseText.includes(queryLower))) {
            return false;
          }
        }

        // Apply all active filters
        if (selectedFilters.personIds?.length > 0) {
          const personIds = entry.personIds || [];
          if (!selectedFilters.personIds.some(id => personIds.includes(id))) {
            return false;
          }
        }

        return true;
      });

      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasPerformedSearch(true); // Add this line
    performRAGSearch(searchQuery);
  };

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
    }));
  };

  const handleStartNewBook = useCallback(() => {
    if (!showBookCreation) {
      setNewBook({
        title: '',
        description: '',
        selectedCollections: [],
        selectedEntries: [],
        coverImage: null,
        backCoverNote: '',
        recipient: null,
        showTags: true,
        fontStyle: 'serif',
        isDraft: false
      });
      setEntryOrder([]);
    }
    setShowBookCreation(true);
  }, [showBookCreation]);

  const startQuickCaptureFromCollection = (collection) => {
    // Your quick capture implementation
  };

  const updateEntry = (updatedEntry) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  // Add these state handlers to your LibraryView component
  const handleEntryUpdate = (updatedEntry) => {
    setInsights(prevInsights =>
      prevInsights.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
  );
  };

  const handleEntryDelete = (entryId) => {
    setInsights(prevInsights =>
      prevInsights.filter(entry => entry.id !== entryId)
    );
  };

  const handleCollectionToggle = (entryId, collectionId) => {
    setInsights(prevInsights =>
      prevInsights.map(entry => {
        if (entry.id !== entryId) return entry;

        const currentCollections = entry.collections || [];
        const newCollections = currentCollections.includes(collectionId)
          ? currentCollections.filter(id => id !== collectionId)
          : [...currentCollections, collectionId];

        return { ...entry, collections: newCollections };
      })
    );
  };

  const handlePersonToggle = (entryId, personId) => {
    setInsights(prevInsights =>
      prevInsights.map(entry => {
        if (entry.id !== entryId) return entry;

        const currentPersonIds = entry.personIds || [];
        const newPersonIds = currentPersonIds.includes(personId)
          ? currentPersonIds.filter(id => id !== personId)
          : [...currentPersonIds, personId];

        return { ...entry, personIds: newPersonIds };
      })
    );
  };

  useEffect(() => {
    // Only perform search if either:
    // 1. There's a search query (even if filters are empty)
    // 2. There are active filters (even if search query is empty)
    if (searchQuery.trim().length > 0 || Object.values(selectedFilters).some(f => f.length > 0)) {
      performRAGSearch(searchQuery);
    } else {
      setSearchResults([]);
      setHasPerformedSearch(false);
    }
  }, [selectedFilters, searchQuery]);

  useEffect(() => {
    console.log('Selected book changed:', selectedBook);
  }, [selectedBook]);

  if (editingBook) {
    return (
      <BookEditor
        book={editingBook}
        onClose={() => {
          setEditingBook(null);
          setReturnToViewer(false);
        }}
        onSave={async (updatedBook) => {
          // TODO: Implement your save logic here
          // await updateBook(updatedBook);
          setEditingBook(null);
          setReturnToViewer(false);
        }}
        onBackToViewer={() => {
          if (returnToViewer && previousViewerState) {
            setSelectedBook(previousViewerState.book);
          }
          setEditingBook(null);
          setReturnToViewer(false);
        }}
      />
    );
  }

  const getFilteredCollections = useCallback(() => {
    const insightsToUse = searchQuery || selectedFilters.personIds.length > 0 ?
      searchResults :
      insights;

    return CUSTOM_COLLECTIONS.filter(collection => {
      const hasEntries = insightsToUse.some(entry =>
        entry.collections?.includes(collection.id)
      );

      if (!hasEntries) return false;

      // Your existing filter logic...
      if (collectionFilter === 'person') {
        return collection.type === 'person' ||
               insightsToUse.some(entry => entry.personIds?.length > 0);
      }
      // ... other filter conditions
    });
  }, [searchResults, selectedFilters, collectionFilter]);

  const isFiltering = searchQuery.trim().length > 0 || Object.values(selectedFilters).some(f => f.length > 0);
  const filteredInsights = isFiltering ? searchResults : insights;
  const noMatchesFound = hasPerformedSearch && isFiltering && searchResults.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <Header />
      <div className="p-4">

        <ViewModeToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
          collectionFilter={collectionFilter}
          setCollectionFilter={setCollectionFilter}
        />

        {viewMode !== 'books' && (
          <SearchAndFilterBar
            searchQuery={searchQuery}
            setSearchQuery={(query) => {
              setSearchQuery(query);
              if (query === '') {
                setHasPerformedSearch(false);
                setSearchResults([]); // Clear search results when query is empty
              }
            }}
            handleSearch={handleSearch}
            isSearching={isSearching}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            allPersonIds={individuals.map(p => p.id)}
            individuals={individuals}
            insights={insights}
          />
        )}

        {viewMode === 'collections' ? (
          <CollectionsList
            userCollections={CUSTOM_COLLECTIONS} // Pass all collections and let CollectionsList handle filtering
            systemCollections={SYSTEM_COLLECTIONS}
            groupedEntries={groupedEntries}
            expandedCollection={expandedCollection}
            onToggleCollection={(collectionId) => {
              setExpandedCollection(prev =>
                prev === collectionId ? null : collectionId
              );
            }}
            showInactiveCollections={showInactiveCollections}
            onToggleInactiveCollections={() => setShowInactiveCollections(!showInactiveCollections)}
            startQuickCaptureFromCollection={startQuickCaptureFromCollection}
            onEntryUpdate={handleEntryUpdate}
            onEntryDelete={handleEntryDelete}
            onCollectionToggle={handleCollectionToggle}
            onPersonToggle={handlePersonToggle}
            individuals={individuals}
            collections={CUSTOM_COLLECTIONS}
            selectedFilters={selectedFilters}
            onClearFilters={() => {
              setSelectedFilters({ personIds: [], topics: [], entryTypes: [] });
              setHasPerformedSearch(false); // Add this
              setSearchQuery(''); // Also clear the search query if you want
            }}
            isPersonView={false}
            filteredInsights={filteredInsights}
            noMatchesFound={noMatchesFound}
          />
        ) : (
          // In LibraryView.jsx, update the BooksList component
          <BooksList
            books={sortedBooks}
            onViewBook={(book) => {
              if (book.status === "Draft") {
                // For draft books, open the creation modal with preloaded data
                const draftInsights = book.draftState.insightIds.map(id =>
                  insights.find(insight => insight.id === id)
                ).filter(Boolean); // Filter out any undefined in case insights were deleted

                setNewBook({
                  title: book.name,
                  description: book.description,
                  selectedCollections: book.collections || [],
                  selectedEntries: book.draftState.insightIds,
                  coverImage: book.draftState.coverImage || null,
                  backCoverNote: book.backCoverNote || '',
                  recipient: book.personId || null, // Ensure this is set
                  recipientName: book.personName || '', // Add this if needed
                  showTags: true,
                  fontStyle: book.fontStyle || 'serif',
                  isBlackAndWhite: book.isBlackAndWhite || false,
                  isDraft: true,
                  color: book.color || 'bg-blue-500',
                  existingBookId: book.id, // Track the original book ID for updating
                  coverMode: book.coverMode || 'color'
                });

                // Set the entry order to maintain the original arrangement
                setEntryOrder(book.draftState.insightIds);

                // Open the modal at the first step
                setBookCreationStep(0);
                setShowBookCreation(true);
              } else {
                // For published books, show the preview
                setSelectedBook(book);
              }
            }}
            onStartNewBook={handleStartNewBook}
            isCreating={currentView === 'arrangeBook'}
            entryOrder={entryOrder}
            insights={insights}
            sortDirection={sortDirection}
            onToggleSortDirection={toggleSortDirection}
          />
        )}
      </div>

      {/* Modals */}
      {selectedBook && (
        selectedBook.status === "Published" ? (
          <PDFViewerWrapper
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onEdit={(book) => {
              setPreviousViewerState({
                book: selectedBook,
                showPdfViewer: true
              });
              setEditingBook(book);
              setSelectedBook(null);
              setReturnToViewer(true);
            }}
          />
        ) : (
          <BookPreviewModal
            book={selectedBook}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onClose={() => setSelectedBook(null)}
          />
        )
      )}

      {showBookCreation && (
        <BookCreationModal
          onClose={() => setShowBookCreation(false)}
          newBook={newBook}
          setNewBook={setNewBook}
          bookCreationStep={bookCreationStep} // Make sure this is passed
          setBookCreationStep={setBookCreationStep} // And this
          entryOrder={entryOrder}
          setEntryOrder={setEntryOrder}
          individuals={individuals}
          insights={insights}
          collections={CUSTOM_COLLECTIONS}
          groupedEntries={groupedEntries}
          SYSTEM_COLLECTIONS={SYSTEM_COLLECTIONS}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      )}


      {showTagEditor && selectedEntry && (
        <TagEditor
          entry={selectedEntry}
          onClose={() => {
            setShowTagEditor(false);
            setSelectedEntry(null);
          }}
          onSave={updateEntry}
        />
      )}
    </div>
  );
};

export default LibraryView;
