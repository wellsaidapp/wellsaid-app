import { useState } from 'react';
import Header from '../appLayout/Header';
import PeopleSearch from './subcomponents/PeopleSearch';
import PeopleList from './subcomponents/PeopleList';
import PersonDetail from './subcomponents/PersonDetail';
import BookCreationModal from '../library/BookCreation/BookCreationModal';
import { SYSTEM_COLLECTIONS } from '../../constants/systemCollections';
import ImageCropperModal from '../library/BookCreation/ImageCropperModal';
import PDFViewerWrapper from '../library/BooksView/PDFViewerWrapper';
import BookPreviewModal from '../home/BookPreviewModal';

const PeopleView = ({ individuals, insights, collections, sharedBooks }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [avatarUploadTemp, setAvatarUploadTemp] = useState(null); // base64 temp image
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [croppedAvatarImage, setCroppedAvatarImage] = useState(null); // Final cropped avatar image

  const systemCollectionIds = new Set(SYSTEM_COLLECTIONS.map(c => c.id));
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

  const handleStartNewBookForPerson = (id) => {
    setNewBook({
      title: '',
      description: '',
      selectedCollections: [],
      selectedEntries: [],
      coverImage: null,
      backCoverNote: '',
      personId: id,
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

  const handleAvatarSave = (croppedImage) => {
    setSelectedPerson((prev) => ({
      ...prev,
      avatarImage: croppedImage
    }));
    setShowAvatarCropper(false);
    setAvatarUploadTemp(null);
  };

  const [sortField, setSortField] = useState('name'); // name | insights | collections
  const [sortDirection, setSortDirection] = useState('asc'); // asc | desc

  const getSortedEnrichedIndividuals = () => {
    return [...enrichedIndividuals].sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'insights':
          aVal = insights.filter(i => i.personIds?.includes(a.id)).length;
          bVal = insights.filter(i => i.personIds?.includes(b.id)).length;
          break;
        case 'collections':
          aVal = a.activeCollectionsCount || 0;
          bVal = b.activeCollectionsCount || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const enrichedIndividuals = individuals.map(person => {
    const sharedSystemCollectionIds = new Set();

    // Loop over all insights
    insights.forEach(insight => {
      // Only consider insights explicitly shared with this person
      if (insight.personIds?.includes(person.id)) {
        // For each collection on the insight, if it's a system collection, count it
        insight.collections?.forEach(colId => {
          if (systemCollectionIds.has(colId)) {
            sharedSystemCollectionIds.add(colId);
          }
        });
      }
    });

    return {
      ...person,
      activeCollectionsCount: sharedSystemCollectionIds.size,
      totalCollectionsCount: systemCollectionIds.size
    };
  });

  console.log('✅ Enriched Individuals:', enrichedIndividuals.map(p => ({
    name: p.name,
    id: p.id,
    activeCollectionsCount: p.activeCollectionsCount,
    totalCollectionsCount: p.totalCollectionsCount,
    avatarImage: p.avatarImage,
    isImageUsed: Boolean(p.avatarImage?.trim?.())
  })));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <Header />

      <div className="p-4">
        {!selectedPerson && (
          <PeopleSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {!selectedPerson ? (
          <PeopleList
            individuals={getSortedEnrichedIndividuals()}
            insights={insights}
            onSelectPerson={setSelectedPerson}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        ) : (
          <PersonDetail
            person={selectedPerson}
            insights={insights}
            collections={[...SYSTEM_COLLECTIONS, ...collections]}
            onBack={() => setSelectedPerson(null)}
            books={sharedBooks}
            setSelectedBook={setSelectedBook}
            setCurrentPage={setCurrentPage}
            onStartNewBook={handleStartNewBookForPerson}
            onTempAvatarUpload={(image) => {
              setAvatarUploadTemp(image);
              setShowAvatarCropper(true);
            }}
            croppedAvatarImage={croppedAvatarImage}
            onViewBook={(book) => {
              setSelectedBook(book);
              setCurrentPage(0);
            }}
          />
        )}
      </div>
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100]">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
            {selectedBook.pdfBase64 ? (
              <PDFViewerWrapper
                file={selectedBook.pdfBase64}
                name={selectedBook.name}
                onClose={() => {
                  setSelectedBook(null);
                  setCurrentPage(0);
                }}
              />
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
            )}
          </div>
        </div>
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
      {showAvatarCropper && avatarUploadTemp && (
        <ImageCropperModal
          image={avatarUploadTemp}
          onCropComplete={handleAvatarSave}
          onClose={() => {
            setShowAvatarCropper(false);
            setAvatarUploadTemp(null);
          }}
        />
      )}
    </div>
  );
};

export default PeopleView;
