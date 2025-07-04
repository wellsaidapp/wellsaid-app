import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Save, X, Mic, GripVertical, Library, User } from 'lucide-react';

const CaptureCard = ({
  entry,
  individuals = [],
  collections = [],
  systemCollections = [],
  onEdit,
  onDelete,
  onCollectionToggle,
  onPersonToggle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const promptRef = useRef(null);
  const responseRef = useRef(null);
  const handleChange = (field, value) => {
    setEditedEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onEdit(editedEntry);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEntry(entry);
    setIsEditing(false);
  };

  const handleCollectionToggle = (collectionId) => {
    setEditedEntry(prev => {
      const currentCollections = prev.collections || [];
      const newCollections = currentCollections.includes(collectionId)
        ? currentCollections.filter(id => id !== collectionId)
        : [...currentCollections, collectionId];

      return { ...prev, collections: newCollections };
    });

    // Propagate the change up if needed
    if (onCollectionToggle) {
      onCollectionToggle(collectionId);
    }
  };

  const handlePersonToggle = (personId) => {
    setEditedEntry(prev => {
      const currentPersonIds = prev.personIds || [];
      const newPersonIds = currentPersonIds.includes(personId)
        ? currentPersonIds.filter(id => id !== personId)
        : [...currentPersonIds, personId];

      return { ...prev, personIds: newPersonIds };
    });

    if (onPersonToggle) {
      onPersonToggle(personId);
    }
  };

  const [showRecipients, setShowRecipients] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  const currentEntry = isEditing ? editedEntry : entry;

  const autoResizeTextarea = (ref) => {
    if (ref?.current) {
      ref.current.style.height = 'auto'; // Reset height
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing) {
      autoResizeTextarea(promptRef);
      autoResizeTextarea(responseRef);
    }
  }, [isEditing]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
        <div className="flex-1 flex items-center space-x-2">
          {entry.isDraft && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
              Draft
            </span>
          )}
          <span className="text-xs text-gray-500">
            {new Date(entry.date).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                aria-label="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                aria-label="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Prompt */}
        {currentEntry.prompt && (
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Prompt
              </span>
            </div>
            {isEditing ? (
              <textarea
                ref={promptRef}
                value={currentEntry.prompt}
                onChange={(e) => {
                  handleChange('prompt', e.target.value);
                  autoResizeTextarea(promptRef);
                }}
                className="w-full bg-blue-50 rounded-lg p-3 text-sm text-gray-800 border border-blue-200 resize-none overflow-hidden"
              />
            ) : (
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-800">
                {currentEntry.prompt}
              </div>
            )}
          </div>
        )}

        {/* Response */}
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              {currentEntry.isDraft ? "Draft Content" : "Response"}
            </span>
          </div>
          {isEditing ? (
            <textarea
              ref={responseRef}
              value={currentEntry.response || currentEntry.content || ""}
              onChange={(e) => {
                handleChange('response', e.target.value);
                autoResizeTextarea(responseRef);
              }}
              className={`w-full rounded-lg p-3 text-sm resize-none overflow-hidden ${
                currentEntry.isDraft || currentEntry.isVoiceNote
                  ? "bg-gray-50 italic text-gray-600 border border-gray-200"
                  : "bg-green-50 text-gray-800 border border-green-200"
              }`}
            />
          ) : (
            <div className={`rounded-lg p-3 text-sm ${
              currentEntry.isDraft || currentEntry.isVoiceNote
                ? "bg-gray-50 italic text-gray-600"
                : "bg-green-50 text-gray-800"
            }`}>
              {currentEntry.response || currentEntry.content || "No content yet"}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 pt-2 border-t border-gray-100">
      {currentEntry.personIds?.length > 0 && (
        <div className="mb-3 p-3 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-2 font-medium">Shared with:</div>
          <div className="flex flex-wrap gap-2">
            {currentEntry.personIds.map(id => {
              const person = individuals.find(p => p.id === id);
              return person ? (
                <span
                  key={`readonly-person-${id}`}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  <User className="w-3 h-3 mr-1" />
                  {person.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Collections */}
        <div className="mb-2">
        {currentEntry.collections?.length > 0 && (
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-gray-500 font-medium">Collections tagged:</div>
            {isEditing && (
              <button
                onClick={() => setShowCollections(!showCollections)}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Edit Collections"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="flex flex-wrap gap-2">
              {currentEntry.collections.map(collectionId => {
                const collection = [...systemCollections, ...collections].find(c => c.id === collectionId);
                return collection ? (
                  <span
                    key={`view-col-${collectionId}`}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    <Library className="w-3 h-3 mr-1" />
                    {collection.name}
                  </span>
                ) : null;
              })}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentEntry.collections.map(collectionId => {
                  const collection = [...systemCollections, ...collections].find(c => c.id === collectionId);
                  return collection ? (
                    <span
                      key={`edit-col-preview-${collectionId}`}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      <Library className="w-3 h-3 mr-1" />
                      {collection.name}
                    </span>
                  ) : null;
                })}
              </div>

              {/* Divider */}
              <hr className="my-2 border-t border-gray-200" />

              {showCollections && (
                <div className="flex flex-wrap gap-2">
                  {[...new Map([...systemCollections, ...collections].map(c => [c.id, c])).values()].map(collection => (
                    <button
                      key={`edit-col-${collection.id}`}
                      onClick={() => handleCollectionToggle(collection.id)}
                      className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        currentEntry.collections?.includes(collection.id)
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Library className="w-3 h-3 mr-1" />
                      {collection.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CaptureCard;
