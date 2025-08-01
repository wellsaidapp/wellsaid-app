import React, { useRef, useState } from 'react';
import { ChevronLeft, Edit3, Camera, Save, X, Trash2 } from 'lucide-react';
import SharedBooksSection from '../../home/SharedBooksSection';
import CreateBook from '../../library/BookCreation/CreateBook';
import CollectionsList from '../../library/CollectionsView/CollectionsList';
import PropTypes from 'prop-types';
import BookCreationModal from '../../library/BookCreation/BookCreationModal';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useContext } from 'react';
import { PeopleContext } from '../../../context/PeopleContext';

import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { useUserCollections } from '../../../context/UserCollectionsContext';

const PersonDetail = ({
  person,
  insights,
  collections = [],
  books,
  onBack,
  setSelectedBook,
  setCurrentPage,
  onStartNewBook,
  onTempAvatarUpload,
  croppedAvatarImage,
  onEntryUpdate,
  onEntryDelete,
  onCollectionToggle,
  onRecipientToggle,
  onAddToCollection,
  currentView,
  setCurrentView,
  onEditDraftBook,
  onSavePerson,
  isUploadingAvatar,
  onDeletePerson,
  onDeleteBook
}) => {

  // console.log("👤 [PersonDetail] Rendering with person:", {
  //   id: person.id,
  //   name: person.name,
  //   avatarUrl: person.avatarUrl ? 'exists' : 'null',
  //   avatarUrlLocation: person.avatarUrl
  // });
  const { systemCollections } = useSystemCollections();
  const { userCollections, loading } = useUserCollections();

  const [expandedCollection, setExpandedCollection] = useState(null);
  const [showInactiveCollections, setShowInactiveCollections] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(person.name);
  const [editedRelationship, setEditedRelationship] = useState(person.relationship);

  const [showBookCreation, setShowBookCreation] = useState(false);
  const [newBook, setNewBook] = useState(null);
  const [entryOrder, setEntryOrder] = useState([]);
  const [bookCreationStep, setBookCreationStep] = useState(0);

  // Filter insights for this person
  const personInsights = insights.filter(i => i.personIds?.includes(person.id));
  const personBooks = books.filter(b => b.personId === person.id);

  const fileInputRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { removePerson } = useContext(PeopleContext);

  // Group entries by collection for this person
  const groupedEntries = personInsights.reduce((acc, entry) => {
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

  // Filter and calculate collection stats
  const activeSystemCollections = systemCollections.filter(c =>
    groupedEntries[c.id]?.length > 0
  );
  const activeUserCollections = userCollections.filter(c =>
    groupedEntries[c.id]?.length > 0
  );
  const inactiveCollections = collections.filter(c =>
    !groupedEntries[c.id]?.length
  );
  const totalCollections = collections.length;
  const activeCollectionsCount = activeSystemCollections.length + activeUserCollections.length;

  const handleEditPerson = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedName(person.name);
      setEditedRelationship(person.relationship);
    }
  };

  const handleSaveEdit = async () => {
    const trimmedName = editedName.trim();
    const trimmedRelationship = editedRelationship.trim();
    if (!trimmedName) return;

    try {
      await onSavePerson(person.id, {
        name: trimmedName,
        relationship: trimmedRelationship
      });
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Failed to save person edit:", err);
    }
  };

  const handleUploadPhoto = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onTempAvatarUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const StatCard = ({
    value,
    label,
    color = 'blue',
    total = null,
    showPercentage = false
  }) => {
    const percentage =
      total && total > 0 ? Math.round((value / total) * 100) : 0;

    return (
      <div className={`bg-${color}-50 rounded-lg p-3 text-center`}>
        {/* Label at top */}
        <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>

        {/* Value next */}
        <div className={`text-2xl font-bold text-${color}-600 mb-1`}>
          {value}
        </div>

        {/* Optional percentage below value */}
        {showPercentage && (
          <div className="text-xs text-gray-500 mb-2">
            {label.includes('Insights')
              ? `${percentage}% of your insights`
              : `${percentage}% of collections`}
          </div>
        )}

        {/* Progress bar last */}
        {showPercentage && (
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-${color}-400`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  const handleDeletePerson = async () => {
    setIsDeleting(true);
    try {
      // Get the current auth session
      const { idToken } = (await fetchAuthSession()).tokens ?? {};

      if (!idToken) {
        throw new Error('No authenticated user');
      }

      const response = await fetch(
        `https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/people/${person.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': idToken.toString(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete person');
      }

      // Handle successful deletion
      removePerson(person.id);
      onBack(); // Navigate away
    } catch (error) {
      console.error('Delete error:', error);
      // User-friendly error handling
      alert(`Delete failed: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-blue-600 flex items-center gap-1">
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="w-6" />
      </div>

      {/* Avatar and Name */}
      <div className="flex flex-col items-center mb-4 relative">
        <div className="relative w-20 h-20 mb-3">
          {person.avatarUrl ? (
            <img
              src={person.avatarUrl}
              alt={`${person.name}'s avatar`}
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                console.error(`❌ Failed to load avatar for ${person.name}:`, person.avatarUrl);
                e.target.onerror = null;
                e.target.src = ""; // fallback if needed
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center`}>
              <span className="text-white text-2xl font-medium">{person.avatar}</span>
            </div>
          )}
          <button
            onClick={handleUploadPhoto}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm"
          >
            <Camera className={`w-4 h-4 text-gray-600 ${isUploadingAvatar ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-gray-800 font-semibold text-lg border-b border-gray-300 px-2 py-1 text-center"
              />
            ) : (
              <p className="text-gray-800 font-semibold text-lg">{person.name}</p>
            )}
            <div className="flex items-center">
              <button onClick={isEditing ? handleSaveEdit : handleEditPerson}>
                {isEditing ? (
                  <Save className="w-4 h-4 text-blue-600" />
                ) : (
                  <Edit3 className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                )}
              </button>
              {isEditing && (
                <X
                  className="w-4 h-4 text-gray-400 hover:text-red-600 ml-1"
                  onClick={handleCancelEdit}
                />
              )}
            </div>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedRelationship}
              onChange={(e) => setEditedRelationship(e.target.value)}
              className="text-base text-gray-500 border-b border-gray-300 px-2 py-1 text-center w-32"
            />
          ) : (
            <p className="text-sm text-gray-500">{person.relationship}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-center mb-6">
        <StatCard
          label="Shared Insights"
          value={person.insightCount}
          total={insights.length}
          showPercentage={true}
          color="blue"
        />
        <StatCard
          label="Shared Collections"
          value={person.systemCollectionCount}
          total={totalCollections}
          showPercentage={true}
          color="blue"
        />
      </div>

      {/* Collections & Insights Section */}
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Shared Insights</h3>
          <p className="text-sm text-gray-600 mt-1">
            Collections of memories and moments you've shared with {person.name}.
          </p>
        </div>
        <CollectionsList
          systemCollections={activeSystemCollections}
          userCollections={userCollections}
          groupedEntries={groupedEntries}
          expandedCollection={expandedCollection}
          onToggleCollection={(collectionId) => {
            setExpandedCollection(prev =>
              prev === collectionId ? null : collectionId
            );
          }}
          onAddToCollection={onAddToCollection}
          showInactiveCollections={showInactiveCollections}
          onToggleInactiveCollections={() =>
            setShowInactiveCollections(!showInactiveCollections)
          }
          inactiveCollections={inactiveCollections}
          individuals={[person]}
          collections={collections}
          onEntryUpdate={onEntryUpdate}
          onEntryDelete={onEntryDelete}
          onCollectionToggle={onCollectionToggle}
          onRecipientToggle={onRecipientToggle}
          isPersonView={true}
          currentPersonId={person.id}
        />
      </div>

      {/* Book Section */}
      <SharedBooksSection
        books={personBooks}
        onViewBook={(book) => {
          if (book.status === "Draft") {
            onEditDraftBook(book); // Use the passed handler
          } else {
            setSelectedBook(book);
            setCurrentPage(0);
          }
        }}
        showViewAll={false}
        onDeleteBook={onDeleteBook}
      />

      {/* Add BookCreationModal */}
      {showBookCreation && (
        <BookCreationModal
          onClose={() => setShowBookCreation(false)}
          newBook={newBook}
          setNewBook={setNewBook}
          bookCreationStep={bookCreationStep}
          setBookCreationStep={setBookCreationStep}
          entryOrder={entryOrder}
          setEntryOrder={setEntryOrder}
          individuals={[person]}
          insights={insights} // Make sure this contains ALL insights, not just person-specific ones
          collections={newBook?.isDraft ? userCollections : userCollections}
          groupedEntries={newBook?.isDraft ?
            // For drafts, use all insights grouped by collection
            insights.reduce((acc, entry) => {
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
            }, {})
            : groupedEntries // Otherwise use person-specific grouped entries
          }
          SYSTEM_COLLECTIONS={systemCollections}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      )}

      {/* CTA */}
      <div className="mt-6">
        <CreateBook
          currentView={null}
          onStartNewBook={() => onStartNewBook(person.id)}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Delete Button */}
     <div className="mt-8 flex justify-center">
       <button
         onClick={() => setShowDeleteModal(true)}
         className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium"
       >
         <Trash2 size={16} />
         Delete Person
       </button>
     </div>

     {/* Delete Confirmation Modal */}
     {showDeleteModal && (
       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
         <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
           <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete {person.name}?</h3>
           <p className="text-gray-600 mb-6">
             This will soft delete {person.name}. Their data will be permanently removed after 30 days.
           </p>
           <div className="flex justify-end gap-3">
             <button
               onClick={() => setShowDeleteModal(false)}
               className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
               disabled={isDeleting}
             >
               Cancel
             </button>
             <button
               onClick={handleDeletePerson}
               className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50"
               disabled={isDeleting}
             >
               {isDeleting ? 'Deleting...' : 'Delete'}
             </button>
           </div>
         </div>
       </div>
     )}
    </div>
  );
};

PersonDetail.propTypes = {
  person: PropTypes.object.isRequired,
  insights: PropTypes.array.isRequired,
  collections: PropTypes.array,
  books: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  setSelectedBook: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  onStartNewBook: PropTypes.func.isRequired,
  onEditDraftBook: PropTypes.func.isRequired,
  onTempAvatarUpload: PropTypes.func.isRequired,
  croppedAvatarImage: PropTypes.string,
  expandedCollection: PropTypes.string,
  onToggleCollection: PropTypes.func,
  onEntryUpdate: PropTypes.func,
  onEntryDelete: PropTypes.func,
  onCollectionToggle: PropTypes.func,
  onRecipientToggle: PropTypes.func,
  onAddToCollection: PropTypes.func,
  onSavePerson: PropTypes.func.isRequired,
  onDeletePerson: PropTypes.func.isRequired
};

PersonDetail.defaultProps = {
  collections: [],
  expandedCollection: null,
  onToggleCollection: () => {},
  onEntryUpdate: () => {},
  onEntryDelete: () => {},
  onCollectionToggle: () => {},
  onRecipientToggle: () => {},
  onAddToCollection: () => {}
};

export default PersonDetail;
