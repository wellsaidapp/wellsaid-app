import { useState } from 'react';
import { usePeople } from '../../../context/PeopleContext';
import PeopleList from '../../peopleView/subcomponents/PeopleList';
import { useInsights } from '../../../context/InsightContext';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';

const SelectPersonView = ({ onSelectPerson, onBack }) => {
  const { people } = usePeople();
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

  return (
    <div className="p-4 pb-[80px]">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 mr-4"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Who is this for?</h2>
      </div>
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
  );
};

export default SelectPersonView;
