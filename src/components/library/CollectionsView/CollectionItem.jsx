import React, { useState } from 'react';
import CaptureCard from './CaptureCard'; // Make sure this import exists
import { ChevronDown, ChevronUp, PlusCircle, FolderOpen, Calendar, Plus, Save, X } from 'lucide-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { useUserCollections } from '../../../context/UserCollectionsContext';
import { useInsights } from '../../../context/InsightContext';

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

  const [isCreating, setIsCreating] = useState(false);
  const [draftEntry, setDraftEntry] = useState({
    prompt: '',
    response: '',
    collections: [collection.id], // Automatically include the current collection
    isDraft: true
  });

  const handleCreateNew = () => {
    setIsCreating(true);
  };

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
        'https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/insights',
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
  };

  const handleDraftChange = (field, value) => {
    setDraftEntry(prev => ({ ...prev, [field]: value }));
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
              {collection.type === 'occasion' ? (
                <Calendar className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              ) : (
                <FolderOpen className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              )}
            </div>
            <div>
              <div className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                {collection.name}
              </div>
              <div className="text-sm text-gray-500">
                {entries.length} insights
                {showRecipient && collection.metadata?.personName && ` • For ${collection.metadata.personName}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(collection);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <PlusCircle className="w-5 h-5 text-blue-700" />
                <span className="ml-1">Capture</span>
              </button>
            )}
            {isActive && (
              expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )
            )}
          </div>
        </div>
      </div>

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
              <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                <div className="flex-1 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    New
                  </span>
                </div>
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? (
                      <>
                        {/* Spinner icon - replaces the save icon while loading */}
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        {/* Your original save icon */}
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <span>Save</span>
                      </>
                    )}
                  </button>
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
                    className="w-full bg-blue-50 rounded-lg p-3 text-sm text-gray-800 border border-blue-200 resize-none overflow-hidden"
                    placeholder="Enter your prompt..."
                    autoFocus
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
                    className="w-full bg-green-50 rounded-lg p-3 text-sm text-gray-800 border border-green-200 resize-none overflow-hidden"
                    placeholder="Enter your response..."
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
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionItem;
