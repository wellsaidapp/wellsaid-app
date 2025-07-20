import { useState, useEffect } from 'react';
import Header from '../appLayout/Header';
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

const PeopleView = ({ individuals, insights, collections, sharedBooks, setCurrentView }) => {
  const { systemCollections } = useSystemCollections();
  if (Array.isArray(individuals)) {
    console.log("🧑‍🤝‍🧑 Received individuals prop:", individuals.map(p => ({
      name: p?.name,
      id: p?.id,
      avatarUrl: p?.avatarUrl,
      hasImage:
        typeof p.avatarUrl === 'string'
          ? p.avatarUrl.trim() !== ''
          : !!p.avatarUrl?.href
    })));
  } else {
    console.warn("⚠️ individuals is not an array:", individuals);
  }
  const { people, refetchPeople, updatePerson } = usePeople();
  const [isCompletingAddPerson, setIsCompletingAddPerson] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const handleAddPersonComplete = async (newPerson) => {
    try {
      setIsCompletingAddPerson(true);

      // This will wait for ALL operations in AddPersonFlow to complete
      // before closing the modal
      setShowAddPerson(false);

      // Optional: Do something with newPerson if needed
      console.log("Added person:", newPerson);

    } finally {
      setIsCompletingAddPerson(false);
    }
  };

  const [scrollBlocked, setScrollBlocked] = useState(false);

  useEffect(() => {
    if (scrollBlocked) {
      window.scrollTo(0, 1); // ensure not at 0 for pull-to-refresh
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [scrollBlocked]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [editingBook, setEditingBook] = useState(null);
  const [returnToViewer, setReturnToViewer] = useState(false);
  const [previousViewerState, setPreviousViewerState] = useState(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadTemp, setAvatarUploadTemp] = useState(null); // base64 temp image
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [croppedAvatarImage, setCroppedAvatarImage] = useState(null); // Final cropped avatar image

  const systemCollectionIds = new Set(systemCollections.map(c => c.id));
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
    if (!selectedPerson?.id) {
      console.error("❌ No person selected");
      return;
    }

    setIsUploadingAvatar(true); // 🌀 Start spinner here

    try {
      setCroppedAvatarImage(croppedImage);
      setShowAvatarCropper(false);
      setAvatarUploadTemp(null);

      const personId = selectedPerson.id;
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

      // ✅ Upload to S3
      await uploadData({
        key: fileName,
        data: imageBlob,
        options: {
          contentType: 'image/jpeg',
          accessLevel: 'public'
        }
      }).result;

      // ✅ Get public URL
      const avatarBaseUrl = `https://wellsaidappdeva7ff28b66c7e4c6785e936c0092e78810660a-dev.s3.us-east-2.amazonaws.com/public/${fileName}`;
      const cacheBustedUrl = `${avatarBaseUrl}?t=${Date.now()}`;

      // ✅ Store clean URL in DB
      await fetch(`https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people/${personId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken.toString()
        },
        body: JSON.stringify({ avatarUrl: avatarBaseUrl }) // ✅ clean URL only
      });

      // ✅ Use cache-busted version locally
      updatePerson({ id: personId, avatarUrl: cacheBustedUrl });
      setSelectedPerson(prev => ({
        ...prev,
        avatarUrl: cacheBustedUrl
      }));

    } catch (err) {
      console.error("❌ Error uploading person avatar:", err);
    } finally {
      setIsUploadingAvatar(false); // ✅ Always stop spinner
    }
  };

  const handleSavePerson = async (personId, updatedFields) => {
    try {
      console.log("✏️ Saving person update:", personId, updatedFields);

      const session = await fetchAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      if (!idToken) throw new Error("No ID token found");

      await fetch(`https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people/${personId}`, {
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

      console.log("✅ Person update complete and UI refreshed");

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

  useEffect(() => {
    const result = getSortedEnrichedIndividuals();
    console.log("🔍 getSortedEnrichedIndividuals output:", result.map(p => ({
      id: p.id,
      name: p.name,
      avatarUrl: p.avatarUrl,
      activeCollectionsCount: p.activeCollectionsCount
    })));
  }, [individuals, insights, searchQuery, sortField, sortDirection]);

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
    avatarUrl: p.avatarUrl,
    isImageUsed: Boolean(p.avatarUrl?.trim?.())
  })));

  if (showAddPerson) {
    return (
      <AddPersonFlow
        onComplete={handleAddPersonComplete}
        onCancel={() => setShowAddPerson(false)}
      />
    );
  }

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
            onAddNewPerson={() => setShowAddPerson(true)}
          />
        ) : (
          <PersonDetail
            person={{
              ...selectedPerson,
              avatarUrl: selectedPerson.avatarUrl?.toString?.().trim() || null, // Use the URL href
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
    </div>
  );
};

export default PeopleView;
