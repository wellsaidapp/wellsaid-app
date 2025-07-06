import { useState, useCallback } from 'react';
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
  const [showPDFPreview, setShowPDFPreview] = useState(false);
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
  //const [currentView, setCurrentView] = useState('collections');
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
  const groupedEntries = insights.reduce((acc, entry) => {
    if (!entry.collections || entry.collections.length === 0) {
      if (!acc.unorganized) acc.unorganized = [];
      acc.unorganized.push(entry);
      return acc;
    }

    entry.collections.forEach(collectionId => {
      if (!acc[collectionId]) acc[collectionId] = [];
      acc[collectionId].push(entry);
    });

    return acc;
  }, {});

  const [sortDirection, setSortDirection] = useState('desc');

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const sortedBooks = [...SHARED_BOOKS].sort((a, b) => {
    const dateA = new Date(a.savedOn);
    const dateB = new Date(b.savedOn);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

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
  const performRAGSearch = async (query) => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const results = insights.filter(entry => {
      const matchesText = entry.text?.toLowerCase().includes(query.toLowerCase()) ||
                        entry.content?.toLowerCase().includes(query.toLowerCase()) ||
                        entry.question?.toLowerCase().includes(query.toLowerCase());
      const matchesTopics = selectedFilters.topics.length === 0 ||
                          entry.topics?.some(topic => selectedFilters.topics.includes(topic));
      const matchesPersons = selectedFilters.personIds.length === 0 ||
                          entry.personIds?.some(id => selectedFilters.personIds.includes(id));
      const matchesType = selectedFilters.entryTypes.length === 0 ||
                        (selectedFilters.entryTypes.includes('draft') && entry.isDraft) ||
                        (selectedFilters.entryTypes.includes('voice') && entry.isVoiceNote) ||
                        (selectedFilters.entryTypes.includes('insight') && !entry.isDraft && !entry.isVoiceNote);

      return matchesText && matchesTopics && matchesPersons && matchesType;
    });
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchQuery.trim() ? performRAGSearch(searchQuery) : setSearchResults([]);
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
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isSearching={isSearching}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            allPersonIds={individuals.map(p => p.id)}
            individuals={individuals}
          />
        )}


        {viewMode === 'collections' ? (
          <CollectionsList
            userCollections={filteredUserCollections}
            groupedEntries={groupedEntries}
            expandedCollection={expandedCollection}
            onToggleCollection={(collectionId) => {
              setExpandedCollection(prev =>
                prev === collectionId ? null : collectionId
              );
            }}
            onAddToCollection={(collectionId) => {
              setCurrentCollection(collectionId);
              setCurrentView('capture');
            }}
            showInactiveCollections={showInactiveCollections}
            onToggleInactiveCollections={() => setShowInactiveCollections(!showInactiveCollections)}
            inactiveCollections={SYSTEM_COLLECTIONS.filter(c => !groupedEntries[c.id]?.length)}
            startQuickCaptureFromCollection={startQuickCaptureFromCollection}
            systemCollections={SYSTEM_COLLECTIONS} // Pass the full system collections
            onEntryUpdate={handleEntryUpdate}
            onEntryDelete={handleEntryDelete}
            onCollectionToggle={handleCollectionToggle}
            onPersonToggle={handlePersonToggle}
            individuals={individuals}
            collections={CUSTOM_COLLECTIONS}
            setInsights={setInsights}
            selectedFilters={selectedFilters}
            onClearFilters={() =>
              setSelectedFilters({ personIds: [], topics: [], entryTypes: [] })
            }
          />
        ) : (
          <BooksList
            books={sortedBooks}
            onViewBook={(book) => {
              setSelectedBook(book); // No need to modify the book object
              setCurrentPage(0); // Always start at first page
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
        selectedBook.pdfBase64 ? (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100]">
            <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
              <PDFViewerWrapper
                file={selectedBook.pdfBase64}
                name={selectedBook.name}  // Add this line
                onClose={() => {
                  setSelectedBook(null);
                  setCurrentPage(0);
                }}
              />
            </div>
          </div>
        ) : (
          <BookPreviewModal
            book={selectedBook}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onClose={() => {
              setSelectedBook(null);
              setCurrentPage(0);
            }}
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
