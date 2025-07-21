import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Save, X, Mic, GripVertical, Library, User } from 'lucide-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import DeleteInsightModal from './DeleteInsightModal';

const CaptureCard = ({
  entry,
  activeCollectionId,
  individuals = [],
  collections = [],
  systemCollections = [],
  onEdit,
  onDelete,
  onCollectionToggle,
  onPersonToggle
}) => {
  console.log("Collection inside:", activeCollectionId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const promptRef = useRef(null);
  const responseRef = useRef(null);
  const [showMinCollectionAlert, setShowMinCollectionAlert] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const handleChange = (field, value) => {
    setEditedEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteInsight = async () => {
    setIsDeleting(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const collectionCount = entry.collections?.length || 0;
      let deleteType = 'partial';

      if (collectionCount <= 1) {
        deleteType = 'full';
      }

      const res = await fetch(
        `https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/insights/${entry.id}?collectionId=${entry.collections[0]}&type=${deleteType}`,
        {
          method: 'DELETE',
          headers: { Authorization: token }
        }
      );

      if (res.ok) {
        onDelete(entry.id); // remove from context
      } else {
        console.error("❌ Failed to delete insight");
      }
    } catch (err) {
      console.error("❌ Error during deletion:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!editedEntry.collections || editedEntry.collections.length === 0) {
      console.warn("Must have at least one collection");
      setShowMinCollectionAlert(true);
      setTimeout(() => setShowMinCollectionAlert(false), 2500);
      return;
    }
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const res = await fetch(`https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/insights/${entry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          prompt: editedEntry.prompt,
          response: editedEntry.response,
          collectionIds: editedEntry.collections || []
        })
      });

      if (!res.ok) throw new Error('Failed to update insight');

      onEdit(editedEntry); // Update local context or state
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error saving insight:", err);
      // Optionally: toast.error("Failed to save changes");
    }
  };

  const handleUnlink = async () => {
    if (!editedEntry.collections || editedEntry.collections.length <= 1) {
      setShowMinCollectionAlert(true);
      setTimeout(() => setShowMinCollectionAlert(false), 2500);
      return;
    }

    if (!activeCollectionId) {
      console.warn("No active collection to unlink from.");
      return;
    }

    setIsUnlinking(true);
    const updatedCollections = editedEntry.collections.filter(id => id !== activeCollectionId);
    const updatedEntry = { ...editedEntry, collections: updatedCollections };

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const res = await fetch(`https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/insights/${entry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          prompt: updatedEntry.prompt,
          response: updatedEntry.response,
          collectionIds: updatedEntry.collections
        })
      });

      if (!res.ok) throw new Error('Failed to update insight');

      setEditedEntry(updatedEntry);
      onEdit(updatedEntry); // update local context or state
      setIsEditing(false);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("❌ Error unlinking collection:", err);
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleCancel = () => {
    setEditedEntry(entry);
    setIsEditing(false);
  };

  const handleCollectionToggle = (collectionId) => {
    setEditedEntry(prev => {
      const currentCollections = prev.collections || [];
      const isSelected = currentCollections.includes(collectionId);

      if (isSelected && currentCollections.length === 1) {
        // Don't allow removing the last one
        setShowMinCollectionAlert(true);
        setTimeout(() => setShowMinCollectionAlert(false), 2500);
        return prev; // No change
      }

      const newCollections = isSelected
        ? currentCollections.filter(id => id !== collectionId)
        : [...currentCollections, collectionId];

      return { ...prev, collections: newCollections };
    });
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

  // iOS-friendly base font size (16px minimum)
  const baseFontSize = "text-[16px]";
  const smallFontSize = "text-[14px]"; // For non-editable text

  // Remove the auto-focus useEffect completely
  useEffect(() => {
    if (isEditing) {
      autoResizeTextarea(promptRef);
      autoResizeTextarea(responseRef);
    }
  }, [isEditing]);

  useEffect(() => {
    if (showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDeleteModal]);

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
                onClick={() => setShowDeleteModal(true)}
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
                className={`w-full bg-blue-50 rounded-lg p-3 ${baseFontSize} text-gray-800 border border-blue-200 resize-none overflow-hidden`}
                style={{ fontSize: '16px' }} // Explicit iOS fix
              />
            ) : (
              <div className={`bg-blue-50 rounded-lg p-3 ${smallFontSize} text-gray-800`}>
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
              className={`w-full rounded-lg p-3 ${baseFontSize} resize-none overflow-hidden ${
                currentEntry.isDraft || currentEntry.isVoiceNote
                  ? "bg-gray-50 italic text-gray-600 border border-gray-200"
                  : "bg-green-50 text-gray-800 border border-green-200"
              }`}
              style={{ fontSize: '16px' }} // Explicit iOS fix
            />
          ) : (
            <div className={`rounded-lg p-3 ${smallFontSize} ${
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
          {showMinCollectionAlert && (
            <div className="text-red-600 text-xs mt-2 font-medium">
              ⚠️ At least one relationship must be tagged.
            </div>
          )}
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
                  {[...new Map([...systemCollections, ...collections].map(c => [c.id, c])).values()].map(collection => {
                    const isSystem = systemCollections.some(sc => sc.id === collection.id);
                    const isSelected = currentEntry.collections?.includes(collection.id);

                    const baseClasses = 'inline-flex items-center px-2 py-1 text-xs rounded-full transition-colors';
                    const selectedSystem = 'bg-gray-800 text-white';
                    const unselectedSystem = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                    const selectedCustom = 'bg-pink-600 text-white';
                    const unselectedCustom = 'bg-pink-100 text-pink-800 hover:bg-pink-200';

                    return (
                      <button
                        key={`edit-col-${collection.id}`}
                        onClick={() => handleCollectionToggle(collection.id)}
                        className={`${baseClasses} ${
                          isSystem
                            ? isSelected ? selectedSystem : unselectedSystem
                            : isSelected ? selectedCustom : unselectedCustom
                        }`}
                      >
                        <Library className="w-3 h-3 mr-1" />
                        {collection.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
          </div>
        )}
        {showDeleteModal && (
          <DeleteInsightModal
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDeleteInsight}
            onUnlink={handleUnlink}
            isDeleting={isDeleting}
            isUnlinking={isUnlinking}
            showUnlink={entry.collections?.length > 1}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default CaptureCard;
