import { useState } from 'react';
import Header from '../appLayout/Header';
import PeopleSearch from './subcomponents/PeopleSearch';
import PeopleList from './subcomponents/PeopleList';
import PersonDetail from './subcomponents/PersonDetail';
import BookPreviewModal from '../home/BookPreviewModal';
import BookCreationModal from '../library/BookCreation/BookCreationModal';
import { SYSTEM_COLLECTIONS } from '../../constants/systemCollections';

const PeopleView = ({ individuals, insights, collections, sharedBooks }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [showBookCreation, setShowBookCreation] = useState(false);
  const [bookCreationStep, setBookCreationStep] = useState(0);
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
  const [entryOrder, setEntryOrder] = useState([]);

  const handleStartNewBookForPerson = (personId) => {
    setNewBook({
      title: '',
      description: '',
      selectedCollections: [],
      selectedEntries: [],
      coverImage: null,
      backCoverNote: '',
      recipient: personId,
      showTags: true,
      fontStyle: 'serif',
      isDraft: false
    });
    setEntryOrder([]);
    setBookCreationStep(0);
    setShowBookCreation(true);
  };

  // Build groupedEntries based on current insights
  const groupedEntries = insights.reduce((acc, entry) => {
    if (entry.collections && Array.isArray(entry.collections)) {
      entry.collections.forEach((colId) => {
        if (!acc[colId]) acc[colId] = [];
        acc[colId].push(entry);
      });
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <Header />

      <div className="p-4">
        <PeopleSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {!selectedPerson ? (
          <PeopleList
            individuals={individuals}
            insights={insights}
            onSelectPerson={setSelectedPerson}
          />
        ) : (
          <PersonDetail
            person={selectedPerson}
            insights={insights}
            collections={collections}
            onBack={() => setSelectedPerson(null)}
            books={sharedBooks}
            setSelectedBook={setSelectedBook}
            setCurrentPage={setCurrentPage}
            onStartNewBook={handleStartNewBookForPerson}
          />
        )}
      </div>
      {selectedBook && (
        <BookPreviewModal
          book={selectedBook}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onClose={() => {
            setSelectedBook(null);
            setCurrentPage(0);
          }}
        />
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
          collections={collections}
          groupedEntries={groupedEntries} // ✅ NOW INCLUDED
          SYSTEM_COLLECTIONS={SYSTEM_COLLECTIONS} // ✅ Safe to import here too
          currentView={'people'}
          setCurrentView={() => {}}
        />
      )}
    </div>
  );
};

export default PeopleView;
