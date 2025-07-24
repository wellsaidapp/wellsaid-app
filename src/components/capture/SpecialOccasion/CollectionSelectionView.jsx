import { useState, useEffect } from 'react';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import SystemCollectionsList from './SystemCollectionsList';
import { SquareArrowLeft } from 'lucide-react';

const CollectionSelectionView = ({ selectedPerson, onCollectionsSelected, onBack }) => {
  const { systemCollections } = useSystemCollections();
  const [selectedCollections, setSelectedCollections] = useState([]);

  // Group collections by their collectionGroup
  const groupedCollections = systemCollections.reduce((groups, collection) => {
    const groupName = collection.collectionGroup;
    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        color: collection.color,
        collections: []
      };
    }
    groups[groupName].collections.push(collection);
    return groups;
  }, {});

  const handleContinue = () => {
    onCollectionsSelected(selectedCollections);
  };

  if (!selectedPerson) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 z-50 flex flex-col">
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center max-w-4xl mx-auto">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4">
              <SquareArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold">No person selected</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 mb-4">
                Please go back and select a person first.
              </p>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                ← Back to Person Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 z-50 flex flex-col">
      {/* Header with title and person chip */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4">
              <SquareArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold">Select Collections</h2>
          </div>

          <div className="flex-shrink-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium break-words max-w-[200px]">
            {selectedPerson.name}
          </div>
        </div>
      </div>

      {/* Optional helper text */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3">
        <p className="text-sm text-gray-500">
          Optional - select collections you would like to include
        </p>
      </div>

      {/* Main content with extra bottom padding */}
      <div className="flex-1 overflow-y-auto pb-32"> {/* Increased from pb-24 to pb-32 */}
        <div className="max-w-4xl mx-auto p-4">
          <SystemCollectionsList
            groupedCollections={Object.values(groupedCollections)}
            selectedCollections={selectedCollections}
            onCollectionToggle={(collectionId, isSelected) => {
              setSelectedCollections(prev =>
                isSelected
                  ? [...prev, collectionId]
                  : prev.filter(id => id !== collectionId)
              );
            }}
          />
        </div>
      </div>

      {/* Full-width Continue button with blue gradient */}
      <div className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 z-40">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Continue {selectedCollections.length > 0 && `(${selectedCollections.length} selected)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionSelectionView;
