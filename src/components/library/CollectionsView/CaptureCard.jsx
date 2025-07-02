import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Save, X, Mic, GripVertical } from 'lucide-react';

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
                handleChange(entry.response ? 'text' : 'content', e.target.value);
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
      {/* Collections */}
        <div className="mb-2">
          {!isEditing ? (
            // Normal display of tagged collections
            <div className="flex flex-wrap gap-2">
              {currentEntry.collections?.map(collectionId => {
                const collection = [...systemCollections, ...collections].find(c => c.id === collectionId);
                return collection ? (
                  <span
                    key={`view-col-${collectionId}`}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {collection.name}
                  </span>
                ) : null;
              })}
            </div>
          ) : (
            <>
              {/* Show currently tagged collections */}
              <div className="flex flex-wrap gap-2 mb-2">
                {currentEntry.collections?.map(collectionId => {
                  const collection = [...systemCollections, ...collections].find(c => c.id === collectionId);
                  return collection ? (
                    <span
                      key={`edit-col-preview-${collectionId}`}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {collection.name}
                    </span>
                  ) : null;
                })}
              </div>

              <button
                onClick={() => setShowCollections(!showCollections)}
                className="text-xs text-gray-500 underline mb-2"
              >
                {showCollections ? "Hide Collections" : "Edit Collections"}
              </button>

              {showCollections && (
                <div className="flex flex-wrap gap-2">
                  {[...new Map([...systemCollections, ...collections].map(c => [c.id, c])).values()].map(collection => (
                    <button
                      key={`edit-col-${collection.id}`}
                      onClick={() => handleCollectionToggle(collection.id)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        currentEntry.collections?.includes(collection.id)
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Recipients */}
        <div>
          {!isEditing ? (
            <div className="flex flex-wrap gap-2">
              {currentEntry.personIds?.map(id => {
                const person = individuals.find(p => p.id === id);
                return person ? (
                  <span key={`view-person-${id}`} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    <span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
                    {person.name}
                  </span>
                ) : null;
              })}
            </div>
          ) : (
            <>
              {/* Show currently tagged people */}
              <div className="flex flex-wrap gap-2 mb-2">
                {currentEntry.recipients?.map(id => {
                  const person = individuals.find(p => p.id === id);
                  return person ? (
                    <span
                      key={`edit-recipient-preview-${id}`}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      <span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
                      {person.name}
                    </span>
                  ) : null;
                })}
              </div>

              <button
                onClick={() => setShowRecipients(!showRecipients)}
                className="text-xs text-gray-500 underline mb-2"
              >
                {showRecipients ? "Hide Tagged People" : "Edit Tagged People"}
              </button>

              {showRecipients && (
                <div className="flex flex-wrap gap-2">
                  {individuals.map(person => (
                    <button
                      key={`edit-person-${person.id}`}
                      onClick={() => handlePersonToggle(person.id)}
                      className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        currentEntry.personIds?.includes(person.id)
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
                      {person.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureCard;
