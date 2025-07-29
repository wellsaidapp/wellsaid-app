import { useState, useEffect } from 'react';
import PeopleSearch from './subcomponents/PeopleSearch';
import PeopleList from './subcomponents/PeopleList';
import PersonDetail from './subcomponents/PersonDetail';
import BookCreationModal from '../library/BookCreation/BookCreationModal';
import { useSystemCollections } from '../../context/SystemCollectionsContext';
import ImageCropperModal from '../library/BookCreation/ImageCropperModal';
import PDFViewerWrapper from '../library/BooksView/PDFViewerWrapper';
import BookPreviewModal from '../home/BookPreviewModal';
import BookEditor from '../library/BooksView/BookEditor';
import AddPersonFlow from './subcomponents/AddPersonFlow';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import { usePeople } from '../../context/PeopleContext';
import { useUser } from '../../context/UserContext';
import { useBooks } from '../../context/BooksContext';

const PeopleView = ({
  individuals,
  insights,
  collections,
  sharedBooks,
  setCurrentView,
  selectedPerson,
  setSelectedPerson
}) => {
  // console.log("📄 PeopleView rendering");
  // console.log("🔍 individuals (from props):", individuals);

  const { systemCollections } = useSystemCollections();
  const { people, refetchPeople, updatePerson, refreshPeople } = usePeople();
  // console.log("🧠 people (from context):", people);
  const { userData, loading: loadingAppUser, refetchUser } = useUser();
  const [isCompletingAddPerson, setIsCompletingAddPerson] = useState(false);
  const { books, loadingBooks, updateBook, refreshBooks } = useBooks();
  const [showAddPerson, setShowAddPerson] = useState(false);
  const handleAddPersonComplete = async (newPerson) => {
    try {
      setIsCompletingAddPerson(true);
      setShowAddPerson(false);
    } finally {
      setIsCompletingAddPerson(false);
    }
  };

  const handleDeleteBook = async (book) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const response = await fetch(
        `https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/books/${book.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete book');
      }

      // ✅ Only refresh after confirmed deletion
      await refreshBooks();
      await refetchPeople();
    } catch (err) {
      console.error("❌ Book deletion failed:", err);
      // Optionally show toast or user feedback
    }
  };

  const [scrollBlocked, setScrollBlocked] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookCreation, setShowBookCreation] = useState(false);
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);

  useEffect(() => {
    const modalIsOpen =
      editingBook !== null ||
      selectedBook?.status === "Published" ||
      showBookCreation ||
      showAvatarCropper;

    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [editingBook, selectedBook, showBookCreation, showAvatarCropper]);

  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(0);


  const [returnToViewer, setReturnToViewer] = useState(false);
  const [previousViewerState, setPreviousViewerState] = useState(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadTemp, setAvatarUploadTemp] = useState(null); // base64 temp image

  const [croppedAvatarImage, setCroppedAvatarImage] = useState(null); // Final cropped avatar image

  const systemCollectionIds = new Set(systemCollections.map(c => c.id));

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

  const handleEditDraftBook = (book) => {
    const draftInsights = book.draftState.insightIds.map(id =>
      insights.find(insight => insight.id === id)
    ).filter(Boolean);

    setNewBook({
      title: book.name,
      description: book.description,
      selectedCollections: book.collections || [],
      selectedEntries: draftInsights.map(i => i.id),
      coverImage: book.draftState.coverImage || null,
      backCoverNote: book.backCoverNote || '',
      recipient: book.personId || null,
      recipientName: book.personName || '',
      showTags: true,
      fontStyle: book.fontStyle || 'serif',
      isBlackAndWhite: book.isBlackAndWhite || false,
      isDraft: true,
      color: book.color || 'bg-blue-500',
      existingBookId: book.id,
    });

    setEntryOrder(book.draftState.insightIds);
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

  const handleAvatarSave = async (croppedImage) => {
    // console.log("📸 [handleAvatarSave] Starting avatar upload process");
    if (!selectedPerson?.id) {
      console.error("❌ No person selected");
      return;
    }

    const personId = selectedPerson.id;
    // console.log(`📸 [handleAvatarSave] Processing avatar for person ID: ${personId}`);
    setIsUploadingAvatar(true); // 🌀 Start spinner here

    try {
      // console.log("📸 [handleAvatarSave] Preparing image data...");
      setCroppedAvatarImage(croppedImage);
      setShowAvatarCropper(false);
      setAvatarUploadTemp(null);

      const session = await fetchAuthSession();
      const idToken = session?.tokens?.idToken;
      const userId = idToken?.payload?.sub;

      if (!userId) throw new Error("User ID not found in session");

      const fileName = `Users/Active/${userId}/images/${personId}.jpg`;

      // ✅ Convert base64 to Blob
      const base64Data = croppedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const imageBlob = new Blob(byteArrays, { type: 'image/jpeg' });

      // console.log("📸 [handleAvatarSave] Uploading image to S3...");
      // ✅ Upload to S3
      await uploadData({
        key: fileName,
        data: imageBlob,
        options: {
          contentType: 'image/jpeg',
          accessLevel: 'public',
          metadata: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
          }
        }
      }).result;

      // ✅ Use Amplify getUrl to resolve base URL
      const { url } = await getUrl({
        key: fileName,
        options: {
          accessLevel: 'public',
          expiresIn: 0  // This prevents signed URLs with expiration
        }
      });
      const cleanUrl = url.toString().split('?')[0];
      const avatarUrl = cleanUrl; // Use this clean URL for storage
      const cacheBustedUrl = `${avatarUrl}?t=${Date.now()}`;

      // console.log("📸 [handleAvatarSave] Updating database record...");
      // ✅ Store clean version in DB
      await fetch(`https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/people/${personId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken.toString()
        },
        body: JSON.stringify({ avatarUrl }) // if variable name matches key
      });

      // ✅ Update local context and rehydrate
      // console.log("📸 [handleAvatarSave] Updating local state...");
      updatePerson({ id: personId, avatarUrl: cacheBustedUrl });
      setSelectedPerson(prev => ({
        ...prev,
        avatarUrl: cacheBustedUrl
      }));

      // ✅ Rehydrate from server but preserve the selected person
      // console.log("📸 [handleAvatarSave] Refreshing people data...");
      const refreshedPerson = await refreshPeople(personId);
      // console.log("📸 [handleAvatarSave] Refresh completed. Refreshed person:", refreshedPerson);

      if (refreshedPerson) {
        // console.log("📸 [handleAvatarSave] Updating selected person with refreshed data");
        setSelectedPerson(refreshedPerson);
      } else {
        console.warn("⚠️ [handleAvatarSave] No refreshed person data returned");
      }

    } catch (err) {
      console.error("❌ Error uploading person avatar:", err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSavePerson = async (personId, updatedFields) => {
    try {
      const session = await fetchAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      if (!idToken) throw new Error("No ID token found");

      await fetch(`https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/people/${personId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken
        },
        body: JSON.stringify(updatedFields)
      });

      // Update context and local selectedPerson
      updatePerson({ id: personId, ...updatedFields });

      setSelectedPerson(prev => ({
        ...prev,
        ...updatedFields
      }));
    } catch (err) {
      console.error("❌ Error saving person update:", err);
    }
  };

  const [sortField, setSortField] = useState('name'); // name | insights | collections
  const [sortDirection, setSortDirection] = useState('asc'); // asc | desc

  const getSortedEnrichedIndividuals = () => {
    // First filter the original individuals by search query
    const filteredIndividuals = individuals.filter(person => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        person.name.toLowerCase().includes(query)
      );
    });

    // Then enrich the filtered individuals
    const enrichedFiltered = filteredIndividuals.map(person => {
      const sharedSystemCollectionIds = new Set();

      insights.forEach(insight => {
        if (insight.personIds?.includes(person.id)) {
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

    // Then sort the enriched filtered results
    return enrichedFiltered.sort((a, b) => {
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

  if (showAddPerson) {
    return (
      <AddPersonFlow
        onComplete={handleAddPersonComplete}
        onCancel={() => setShowAddPerson(false)}
      />
    );
  }

  useEffect(() => {
    if (selectedBook?.status === "Published") {
      setScrollBlocked(true);
    }
  }, [selectedBook]);

  useEffect(() => {
    if (showBookCreation) {
      setScrollBlocked(true);
    }
  }, [showBookCreation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
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
            onPersonClick={setSelectedPerson}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            onAddNewPerson={() => setShowAddPerson(true)}
            selectionMode={false}
          />
        ) : (
          <PersonDetail
            person={{
              ...selectedPerson,
              avatarUrl: selectedPerson.avatarUrl
                ? `${selectedPerson.avatarUrl.split('?')[0]}?t=${Date.now()}`
                : null,
              avatarInitial: selectedPerson.avatar // Pass the initial separately
            }}
            insights={insights}
            collections={[...systemCollections, ...collections]}
            onBack={() => setSelectedPerson(null)}
            books={sharedBooks}
            setSelectedBook={setSelectedBook}
            setCurrentPage={setCurrentPage}
            onStartNewBook={handleStartNewBookForPerson}
            onEditDraftBook={handleEditDraftBook}
            onTempAvatarUpload={(image) => {
              setAvatarUploadTemp(image);
              setShowAvatarCropper(true);
            }}
            croppedAvatarImage={croppedAvatarImage}
            onViewBook={(book) => {
              setSelectedBook(book);
              setCurrentPage(0);
            }}
            onSavePerson={handleSavePerson}
            isUploadingAvatar={isUploadingAvatar}
            onDeleteBook={handleDeleteBook}
          />
        )}
      </div>
      {selectedBook && (
        selectedBook.status === "Published" && selectedBook.publishedBook ? (
          <PDFViewerWrapper
            book={selectedBook}
            onClose={() => {
              setSelectedBook(null);
              setCurrentPage(0);
              setScrollBlocked(false);
            }}
            onEdit={(book) => {
              setPreviousViewerState({
                book: selectedBook,
                showPdfViewer: true
              });
              setEditingBook(book);
              setSelectedBook(null);
              setReturnToViewer(true);
              setScrollBlocked(false);
            }}
            userData={userData}
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
        )
      )}
      {showBookCreation && (
        <BookCreationModal
          onClose={() => {
            setShowBookCreation(false);
            setScrollBlocked(false); // ✅ Allow scroll again
          }}
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
          SYSTEM_COLLECTIONS={systemCollections} // ✅ Safe to import here too
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
      {showAddPerson && (
        <AddPersonFlow
          onComplete={handleAddPersonComplete}
          onCancel={() => setShowAddPerson(false)}
          isCompleting={isCompletingAddPerson}
        />
      )}
      {editingBook && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setEditingBook(null);
              setReturnToViewer(false);
            }}
          />
          {/* modal content */}
          <div className="relative z-10 w-full max-w-4xl">
            <BookEditor
              variant="modal"
              book={editingBook}
              editingBook={editingBook}
              returnToViewer={returnToViewer}
              previousViewerState={previousViewerState}
              userData={userData}
              onClose={() => {
                setEditingBook(null);
                setReturnToViewer(false);
              }}
              onSave={async (updatedBook) => {
                setEditingBook(null);
                setReturnToViewer(false);
                // TODO: Update context or re-fetch people if needed
              }}
              onBackToViewer={(savedBook) => {
                const bookToShow = savedBook || previousViewerState?.book;
                setSelectedBook(bookToShow);
                setEditingBook(null);
                setReturnToViewer(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleView;
