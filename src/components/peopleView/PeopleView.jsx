import { useState } from 'react';
import Header from '../appLayout/Header';
import PeopleSearch from './subcomponents/PeopleSearch';
import PeopleList from './subcomponents/PeopleList';
import PersonDetail from './subcomponents/PersonDetail';
import BookPreviewModal from '../home/BookPreviewModal';

const PeopleView = ({ individuals, insights, collections, sharedBooks }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
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
    </div>
  );
};

export default PeopleView;
