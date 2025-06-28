import { useState } from 'react';
import { Pencil, Trash2, Save, X, Mic, GripVertical } from 'lucide-react';

const CaptureCard = ({
  entry,
  individuals = [],
  collections = [],
  systemCollections = [],
  onEdit,
  onDelete,
  onCollectionToggle,
  onRecipientToggle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);

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

  const handleRecipientToggle = (recipientId) => {
    setEditedEntry(prev => {
      const currentRecipients = prev.recipients || [];
      const newRecipients = currentRecipients.includes(recipientId)
        ? currentRecipients.filter(id => id !== recipientId)
        : [...currentRecipients, recipientId];

      return { ...prev, recipients: newRecipients };
    });

    // Propagate the change up if needed
    if (onRecipientToggle) {
      onRecipientToggle(recipientId);
    }
  };

  const currentEntry = isEditing ? editedEntry : entry;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
        <div className="flex-1 flex items-center space-x-2">
          {entry.isVoiceNote && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
              <Mic className="w-3 h-3 mr-1" /> Voice Note
            </span>
          )}
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
        {/* Question */}
        {currentEntry.question && (
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Question
              </span>
            </div>
            {isEditing ? (
              <textarea
                value={currentEntry.question}
                onChange={(e) => handleChange('question', e.target.value)}
                className="w-full bg-blue-50 rounded-lg p-3 text-sm text-gray-800 border border-blue-200"
              />
            ) : (
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-800">
                {currentEntry.question}
              </div>
            )}
          </div>
        )}

        {/* Answer */}
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              {currentEntry.isDraft ? "Draft Content" : "Answer"}
            </span>
          </div>
          {isEditing ? (
            <textarea
              value={currentEntry.text || currentEntry.content || ""}
              onChange={(e) => handleChange(entry.text ? 'text' : 'content', e.target.value)}
              className={`w-full rounded-lg p-3 text-sm ${
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
              {currentEntry.text || currentEntry.content || "No content yet"}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 pt-2 border-t border-gray-100">
        {/* Collections */}
        <div className="flex flex-wrap gap-2 mb-2">
          {isEditing ? (
            [...new Map([...systemCollections, ...collections].map(c => [c.id, c])).values()]
              .map(collection => (
                <button
                  key={`edit-col-${collection.id}`}
                  onClick={() => handleCollectionToggle(collection.id)}  // Changed from onCollectionToggle
                  className={`px-2 py-1 text-xs rounded-full ${
                    currentEntry.collections?.includes(collection.id)
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {collection.name}
                </button>
              ))
          ) : (
            currentEntry.collections?.map(collectionId => {
              const collection = [...systemCollections, ...collections]
                .find(c => c.id === collectionId);
              return collection ? (
                <span
                  key={`view-col-${collectionId}`}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {collection.name}
                </span>
              ) : null;
            })
          )}
        </div>

        {/* Recipients */}
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            individuals.map(person => (
              <button
                key={`edit-recipient-${person.id}`}
                onClick={() => handleRecipientToggle(person.id)}  // Changed from onRecipientToggle
                className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                  currentEntry.recipients?.includes(person.id)
                    ? "bg-blue-800 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${person.color} mr-1`}></span>
                {person.name}
              </button>
            ))
          ) : (
            currentEntry.recipients?.map(id => {
              const person = individuals.find(p => p.id === id);
              return person ? (
                <span
                  key={`view-recipient-${id}`}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  <span className={`w-2 h-2 rounded-full ${person.color} mr-1`}></span>
                  {person.name}
                </span>
              ) : null;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureCard;
