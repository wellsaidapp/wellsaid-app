import React, { useState } from 'react';
import CaptureCard from './CaptureCard'; // Make sure this import exists
import { ChevronDown, ChevronUp, PlusCircle, FolderOpen, Calendar, Plus, Save, X, Brain, Zap, ArrowRight, Lightbulb, Clock, Pencil, User, Settings } from 'lucide-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { useUserCollections } from '../../../context/UserCollectionsContext';
import { useInsights } from '../../../context/InsightContext';
import EditUserCollectionsModal from './EditUserCollectionsModal';

const CollectionItem = ({
  collection,
  collections,
  entries = [],
  isActive,
  expanded,
  onToggle,
  showRecipient = false,
  onAddToCollection,
  individuals,
  systemCollections,
  onEntryUpdate,
  onEntryDelete,
  onCollectionToggle,
  onPersonToggle
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { refreshInsights } = useInsights();
  const { refreshSystemCollections } = useSystemCollections();
  const { refreshUserCollections } = useUserCollections();
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [draftEntry, setDraftEntry] = useState({
    prompt: '',
    response: '',
    collections: [collection.id], // Automatically include the current collection
    isDraft: true
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(collection.name);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCaptureCard, setShowCaptureCard] = useState(false);
  // console.log("Collection", collection);
  // console.log("Collections", collections);
  const handleCreateNew = () => {
    setIsCreating(true);
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const handleSaveDraft = async () => {
    setIsSaving(true); // Start loading
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    if (!token) {
      console.error("🔒 Missing access token");
      return;
    }

    const newEntry = {
      prompt: draftEntry.prompt,
      response: draftEntry.response,
      collections: [
        {
          id: collection.id,
          type: collection.type === 'system' ? 'system' : 'custom'
        }
      ]
    };

    try {
      const res = await fetch(
        'https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/insights',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify(newEntry)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ API error:", data.error || 'Unknown error');
        return;
      }

      // Inject the new insight directly into UI
      onEntryUpdate(data);

      // Reset form
      setIsCreating(false);
      setDraftEntry({
        prompt: '',
        response: '',
        collections: [collection.id],
        isDraft: true
      });

      await Promise.all([
        refreshInsights(),
        collection.type === 'system' ? refreshSystemCollections() : refreshUserCollections()
      ]);

    } catch (err) {
      console.error("❌ Failed to save insight:", err);
    } finally {
      setIsSaving(false); // Always stop loading when done
    }
  };

  const handleCancelDraft = () => {
    setIsCreating(false);
    setDraftEntry({
      prompt: '',
      response: '',
      collections: [collection.id],
      isDraft: true
    });
    setShowCaptureCard(false);
  };

  const handleDraftChange = (field, value) => {
    setDraftEntry(prev => ({ ...prev, [field]: value }));
  };

  // src/api/collections.js
  const deleteUserCollection = async (collectionId) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/collections/user/${collectionId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete collection');
    }

    return await response.json();
  };

  const updateCollectionName = async (collectionId, newName) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    if (!token) {
      console.error("🔒 Missing access token");
      throw new Error("Authentication required");
    }

    try {
      const response = await fetch(
        `https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/collections/user/${collectionId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify({
            name: newName
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update collection name');
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Failed to update collection:", error);
      throw error;
    }
  };

  return (
    <div className={`relative z-0 ${!isActive ? 'opacity-70' : ''}`}>
      <div
        onClick={isActive ? onToggle : () => onAddToCollection(collection)}
        className={`bg-white rounded-lg p-4 ${
          isActive ? 'cursor-pointer hover:bg-gray-50' : ''
        } transition-colors border ${
          isActive ? 'border-gray-200' : 'border-gray-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg ${
              isActive ? collection.color : 'bg-gray-300'
            } flex items-center justify-center mr-3`}>
              {collection.type === 'custom' ? (
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <FolderOpen className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />

                  {collection.type === 'custom' && (
                    <div className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-2.5 h-2.5 text-black" />
                    </div>
                  )}
                </div>
              ) : (
                <FolderOpen className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              )}
            </div>
            <div>
              <div className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                {collection.name}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span>{entries.length} insights</span>
                {collection.type === 'custom' && collection.personName && (
                  <>
                    <span>•</span>
                    <span>For {collection.personName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                  setShowCaptureCard(true);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Add New Insight"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}
            {isActive && (
              <>
                {collection.type === 'custom' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditModal(true);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Collection Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                {expanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {!isActive && showCaptureCard && (
        <div className="pl-4 border-l-2 border-gray-200 ml-5 mt-2">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
            {/* Header - unchanged */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
              {/* Left: Save button */}
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>

              {/* Right: New pill + Cancel button */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  New
                </span>
                <button
                  onClick={handleCancelDraft}
                  className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Prompt */}
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Prompt
                  </span>
                </div>
                <textarea
                  value={draftEntry.prompt}
                  onChange={(e) => handleDraftChange('prompt', e.target.value)}
                  className="w-full bg-blue-50 rounded-lg p-3 text-base text-gray-800 border border-blue-200 resize-none overflow-hidden"
                  placeholder="Enter your prompt..."
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Response */}
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Response
                  </span>
                </div>
                <textarea
                  value={draftEntry.response}
                  onChange={(e) => handleDraftChange('response', e.target.value)}
                  className="w-full bg-green-50 rounded-lg p-3 text-base text-gray-800 border border-green-200 resize-none overflow-hidden"
                  placeholder="Enter your response..."
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Enhanced Helper Text */}
              <div className="mt-6 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Need help? Try one of the guided capture experiences below.
                  </p>
                </div>
              </div>

              {/* Enhanced Wizard Buttons */}
              <div className="flex justify-center gap-3 pb-1">
              {/* Quick Capture Button */}
                <button
                  onClick={() => onAddToCollection(collection, 'quick')}
                  className="w-full max-w-[180px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <Zap size={18} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm">Quick Capture</h3>
                      <p className="text-blue-100 text-xs">Thoughtful prompts</p>
                    </div>
                  </div>
                  <p className="text-blue-100 text-xs leading-relaxed mb-3">
                    Answer thoughtful questions to capture what's on your mind
                  </p>
                  <div className="flex items-center text-blue-100 text-xs">
                    <Clock size={12} className="mr-1" />
                    <span>5-10 minutes</span>
                  </div>
                </button>

                {/* Insight Builder Button */}
                <button
                  onClick={() => onAddToCollection(collection, 'builder')}
                  className="w-full max-w-[180px] bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-xl p-4 hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                    <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        <Lightbulb size={18} className="text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm">Insight Builder</h3>
                        <p className="text-green-100 text-xs">Start with an idea</p>
                      </div>
                    </div>
                  <p className="text-green-100 text-xs leading-relaxed mb-2">
                    Shape raw thoughts into meaningful takeaways with AI
                  </p>
                  <div className="flex items-center text-green-100 text-xs">
                    <Pencil size={12} className="mr-1" />
                    <span>10-15 minutes</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isActive && expanded && (
        <div className="pl-4 border-l-2 border-gray-200 ml-5 mt-2 space-y-3">
          {/* Add New Insight Button */}
          <button
            onClick={handleCreateNew}
            className="w-full py-2 px-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} className="text-gray-500" />
            Add New Insight
          </button>

          {/* Draft Capture Card - shown when creating */}
          {isCreating && (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                {/* Left side - Save button */}
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>

                {/* Right side - New pill and Cancel button */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    New
                  </span>
                  <button
                    onClick={handleCancelDraft}
                    className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    aria-label="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content - unchanged */}
              <div className="p-4">
                {/* Prompt */}
                <div className="mb-4">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      Prompt
                    </span>
                  </div>
                  <textarea
                    value={draftEntry.prompt}
                    onChange={(e) => handleDraftChange('prompt', e.target.value)}
                    className="w-full bg-blue-50 rounded-lg p-3 text-base text-gray-800 border border-blue-200 resize-none overflow-hidden"
                    placeholder="Enter your prompt..."
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Response */}
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                      Response
                    </span>
                  </div>
                  <textarea
                    value={draftEntry.response}
                    onChange={(e) => handleDraftChange('response', e.target.value)}
                    className="w-full bg-green-50 rounded-lg p-3 text-base text-gray-800 border border-green-200 resize-none overflow-hidden"
                    placeholder="Enter your response..."
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Existing entries list */}
          {entries.length > 0 && (
            <div className="space-y-3">
              {entries.map(entry => (
                <CaptureCard
                  key={entry.id}
                  entry={entry}
                  individuals={individuals}
                  collections={[...systemCollections, ...collections]}
                  systemCollections={systemCollections}
                  onEdit={(updatedEntry) => {
                    if (typeof onEntryUpdate === 'function') {
                      onEntryUpdate(updatedEntry);
                    }
                  }}
                  onDelete={(entryId) => onEntryDelete(entryId)}
                  onCollectionToggle={(collectionId) => {
                    if (typeof onCollectionToggle === 'function') {
                      onCollectionToggle(entry.id, collectionId);
                    }
                  }}
                  onPersonToggle={(recipientId) => onPersonToggle(entry.id, recipientId)}
                  activeCollectionId={collection.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {showEditModal && (
        <EditUserCollectionsModal
          collection={collection}
          onClose={() => setShowEditModal(false)}
          onSave={async (newName) => {
            try {
              setIsSaving(true);
              await updateCollectionName(collection.id, newName);
              refreshUserCollections(); // Refresh the collections list
            } catch (error) {
              // You might want to show an error toast here
              console.error('Failed to update collection name:', error);
            } finally {
              setIsSaving(false);
              setShowEditModal(false);
            }
          }}
          onDelete={async () => {
            await deleteUserCollection(collection.id); // Your existing function
            refreshUserCollections();
          }}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default CollectionItem;
