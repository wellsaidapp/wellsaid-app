import { useState } from 'react';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import SystemCollectionsList from './SystemCollectionsList';

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
    if (selectedCollections.length > 0) {
      onCollectionsSelected(selectedCollections);
    }
  };

  if (!selectedPerson) {
    return (
      <div className="p-4 pb-24">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4">
            ← Back
          </button>
          <h2 className="text-2xl font-bold">No person selected</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">
            Please go back and select a person first.
          </p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            ← Back to Person Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4">
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold">Select Collections</h2>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">For:</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {selectedPerson.name}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Choose the categories that best fit this special occasion.
      </p>

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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedCollections.length === 0}
          className={`px-6 py-3 rounded-lg text-white ${
            selectedCollections.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          Continue ({selectedCollections.length} selected)
        </button>
      </div>
    </div>
  );
};

export default CollectionSelectionView;
