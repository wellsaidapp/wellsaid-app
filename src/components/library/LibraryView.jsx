import { useState, useCallback, useEffect, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';
import { useSystemCollections } from '../../context/SystemCollectionsContext';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { useBooks } from '../../context/BooksContext';
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
  defaultViewMode = 'collections'
}) => {
  console.log("INDIVIDUALS IN LIBRARY:", individuals);
  const { systemCollections, loading: loadingSystem } = useSystemCollections();
  const { userCollections, loading: loadingUser } = useUserCollections();
  const { books, loadingBooks, updateBook } = useBooks();
  const { userData, loading: loadingAppUser, refetchUser } = useUser();
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
  const [showPdfViewer, setShowPdfViewer] = useState(false);
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

  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      const dateA = new Date(a.savedOn);
      const dateB = new Date(b.savedOn);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [books, sortDirection]); // ← important dependencies!

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
  const filteredSystemCollections = systemCollections.filter(collection => {
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

  const filteredUserCollections = userCollections.filter(collection => {
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

  const getFilteredCollections = useCallback(() => {
    const insightsToUse = searchQuery || selectedFilters.personIds.length > 0 ?
      searchResults :
      insights;

    return userCollections.filter(collection => {
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

  // console.log("📚 Books in LibraryView:", books);
  // console.log("🧮 Sorted Books:", sortedBooks.map(b => ({ id: b.id, name: b.name })));
  //
  // Add this to your LibraryView component (where setNewBook is called)
  useEffect(() => {
    console.log('📘 newBook state updated:', newBook);
  }, [newBook]); // This will run every time newBook changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      {editingBook ? (
        <BookEditor
          key={editingBook.id}
          book={editingBook}
          returnToViewer={returnToViewer}
          previousViewerState={previousViewerState}
          onClose={() => {
            setEditingBook(null);
            setReturnToViewer(false);
          }}
          onSave={async (updatedBook) => {
            updateBook({ ...updatedBook, _renderNonce: Date.now() }); // force uniqueness
            setEditingBook(null);
            setReturnToViewer(false);
          }}
          onBackToViewer={(savedBook) => {
            const bookToShow = savedBook || previousViewerState?.book;

            const cleanUrl = bookToShow.publishedBook?.split('?')[0] || '';
            const cacheBustedUrl = `${cleanUrl}?ts=${Date.now()}`;

            setSelectedBook({
              ...bookToShow,
              publishedBook: cacheBustedUrl
            });

            setEditingBook(null);
            setReturnToViewer(false);
            setShowPdfViewer(true); // ⬅️ Ensure this is defined in LibraryView

            setCurrentPage(prev => prev + 1);
            setTimeout(() => setCurrentPage(prev => prev - 1), 10);
          }}
          userData={userData}
        />
      ) : (
        <>
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
                    setSearchResults([]);
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
                userCollections={userCollections}
                systemCollections={systemCollections}
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
                collections={userCollections}
                selectedFilters={selectedFilters}
                onClearFilters={() => {
                  setSelectedFilters({ personIds: [], topics: [], entryTypes: [] });
                  setHasPerformedSearch(false);
                  setSearchQuery('');
                }}
                isPersonView={false}
                filteredInsights={filteredInsights}
                noMatchesFound={noMatchesFound}
              />
            ) : (
              <BooksList
                books={sortedBooks}
                onViewBook={(book) => {
                  // Enhanced initial log
                  console.groupCollapsed('📘 Book Clicked:', book.name);
                  console.log('📚 Raw book data:', JSON.parse(JSON.stringify(book)));

                  const latestBook = books.find(b => b.id === book.id) || book;
                  console.log('🔍 Latest book from context:', {
                    id: latestBook.id,
                    status: latestBook.status,
                    insights: latestBook.insightIds?.length,
                    hasCover: !!latestBook.coverImage
                  });

                  if (latestBook.status === "Draft") {
                    console.log('✏️ Editing DRAFT book');

                    // Pre-process the data before setting state
                    const draftPayload = {
                      title: latestBook.name,
                      description: latestBook.description,
                      selectedCollections: latestBook.collections || [],
                      selectedEntries: latestBook.insightIds,
                      coverImage: latestBook.coverImage || null,
                      backCoverNote: latestBook.backCoverNote || '',
                      recipient: latestBook.personId || null,
                      recipientName: latestBook.personName || '',
                      showTags: true,
                      fontStyle: latestBook.fontStyle || 'serif',
                      isBlackAndWhite: latestBook.isBlackAndWhite || false,
                      isDraft: true,
                      color: latestBook.color || 'bg-blue-500',
                      existingBookId: latestBook.id,
                      coverMode: latestBook.coverMode || 'color'
                    };

                    console.log('🔄 Draft payload prepared:', {
                      keyFields: {
                        existingId: draftPayload.existingBookId,
                        entries: draftPayload.selectedEntries.length,
                        coverType: draftPayload.coverImage ? 'image' : `color: ${draftPayload.color}`
                      }
                    });

                    setNewBook(draftPayload);
                    setEntryOrder(latestBook.insightIds);
                    setBookCreationStep(0);
                    setShowBookCreation(true);

                    console.log('🏁 Modal opening with draft data');
                  } else {
                    console.log('👀 Viewing PUBLISHED book');
                    setSelectedBook(latestBook);
                  }

                  console.groupEnd();
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
              bookCreationStep={bookCreationStep}
              setBookCreationStep={setBookCreationStep}
              entryOrder={entryOrder}
              setEntryOrder={setEntryOrder}
              individuals={individuals}
              insights={insights}
              collections={userCollections}
              groupedEntries={groupedEntries}
              SYSTEM_COLLECTIONS={systemCollections}
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
        </>
      )}
    </div>
  );
};

export default LibraryView;
