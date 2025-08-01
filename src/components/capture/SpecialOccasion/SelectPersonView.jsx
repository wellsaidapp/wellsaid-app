import { useState, useEffect } from 'react';
import { usePeople } from '../../../context/PeopleContext';
import PeopleList from '../../peopleView/subcomponents/PeopleList';
import { useInsights } from '../../../context/InsightContext';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { SquareX, X, SquareArrowLeft } from 'lucide-react';
import AddPersonFlow from '../../peopleView/subcomponents/AddPersonFlow';

const SelectPersonView = ({ onSelectPerson, onBack }) => {
  const { people, refetchPeople } = usePeople();
  const { insights } = useInsights();
  const { systemCollections } = useSystemCollections();
  const systemCollectionIds = new Set(systemCollections.map(c => c.id));
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const handlePersonSelected = (person) => {
    setSelectedPersonId(person.id);
    if (onSelectPerson) {
      onSelectPerson(person);
    }
  };

  const handleAddPersonComplete = async () => {
    // Refresh the people list
    await refetchPeople();
    // Close the add person flow
    setShowAddPerson(false);
  };

  if (showAddPerson) {
    return (
      <AddPersonFlow
        onComplete={handleAddPersonComplete}
        onCancel={() => setShowAddPerson(false)}
        shouldAutoClose={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 z-50 flex flex-col">
      {/* Top instruction bar */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <SquareArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold">Who is this for?</h2>
        </div>
      </div>

      {/* People list taking up remaining space */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <PeopleList
            individuals={people}
            insights={insights}
            totalCollectionsCount={systemCollectionIds.size}
            onSelectPerson={handlePersonSelected}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            onAddNewPerson={() => setShowAddPerson(true)}
            selectedPersonId={selectedPersonId}
            selectionMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectPersonView;
