import React, { useRef, useState } from 'react';
import { ChevronLeft, Edit3, Camera, Save, X } from 'lucide-react';
import SharedBooksSection from '../../home/SharedBooksSection';
import CreateBook from '../../library/BookCreation/CreateBook';
import CollectionsList from '../../library/CollectionsView/CollectionsList';
import PropTypes from 'prop-types';

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
  onAddToCollection
}) => {
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [showInactiveCollections, setShowInactiveCollections] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(person.name);
  const [editedRelationship, setEditedRelationship] = useState(person.relationship);

  // Filter insights for this person
  const personInsights = insights.filter(i => i.recipients?.includes(person.id));
  const personBooks = books.filter(b => b.recipientId === person.id);

  const fileInputRef = useRef(null);

  // Group entries by collection for this person
  const groupedEntries = personInsights.reduce((acc, entry) => {
    if (entry.collections?.length > 0) {
      entry.collections.forEach(collectionId => {
        if (!acc[collectionId]) acc[collectionId] = [];
        acc[collectionId].push(entry);
      });
    }
    return acc;
  }, {});

  // Filter and calculate collection stats
  const systemCollections = collections.filter(c =>
    c.type === 'system' && groupedEntries[c.id]?.length > 0
  );
  const userCollections = collections.filter(c =>
    c.type === 'occasion' && groupedEntries[c.id]?.length > 0
  );
  const inactiveCollections = collections.filter(c =>
    !groupedEntries[c.id]?.length
  );
  const totalCollections = collections.length;
  const activeCollectionsCount = systemCollections.length + userCollections.length;

  const handleEditPerson = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedName(person.name);
      setEditedRelationship(person.relationship);
    }
  };

  const handleSaveEdit = () => {
    person.name = editedName;
    person.relationship = editedRelationship;
    setIsEditing(false);
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
          {person.avatarImage ? (
            <img
              src={person.avatarImage}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className={`w-20 h-20 rounded-full ${person.color} flex items-center justify-center text-white text-2xl font-medium`}>
              {person.avatar}
            </div>
          )}
          <button
            onClick={handleUploadPhoto}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm"
          >
            <Camera className="w-4 h-4 text-gray-600" />
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
              className="text-sm text-gray-500 border-b border-gray-300 px-2 py-1 text-center w-32"
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
          value={personInsights.length}
          total={insights.length}
          showPercentage={true}
          color="blue"
        />
        <StatCard
          label="Shared Collections"
          value={activeCollectionsCount}
          total={totalCollections}
          showPercentage={true}
          color="blue"
        />
      </div>

      {/* Collections & Insights Section */}
      <div className="mb-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Shared Insights</h3>
          <p className="text-sm text-gray-600 mt-1">
            Collections of memories and moments you've shared with {person.name}.
          </p>
        </div>
        <CollectionsList
          systemCollections={systemCollections}
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
        />
      </div>

      {/* Book Section */}
      <SharedBooksSection
        books={personBooks}
        onView={(book) => {
          setSelectedBook(book);
          setCurrentPage(0);
        }}
      />

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
  onTempAvatarUpload: PropTypes.func.isRequired,
  croppedAvatarImage: PropTypes.string,
  expandedCollection: PropTypes.string,
  onToggleCollection: PropTypes.func,
  onEntryUpdate: PropTypes.func,
  onEntryDelete: PropTypes.func,
  onCollectionToggle: PropTypes.func,
  onRecipientToggle: PropTypes.func,
  onAddToCollection: PropTypes.func
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
