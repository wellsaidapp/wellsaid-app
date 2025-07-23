import { useState } from 'react';
import { usePeople } from '../../../context/PeopleContext';
import PeopleList from '../../peopleView/subcomponents/PeopleList';
import { useInsights } from '../../../context/InsightContext';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';

const SelectPersonView = ({ onPersonChosen }) => {
  const { people } = usePeople();
  const { insights } = useInsights();
  const { systemCollections } = useSystemCollections();
  const systemCollectionIds = new Set(systemCollections.map(c => c.id));
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  return (
    <div className="p-4 pb-[80px]"> {/* Add space for bottom nav */}
      <h2 className="text-2xl font-bold mb-4 text-center">Who is this for?</h2>
      <PeopleList
        individuals={people}
        insights={insights}
        totalCollectionsCount={systemCollectionIds.size}
        onSelectPerson={onPersonChosen}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        onAddNewPerson={() => setShowAddPerson(true)} // ← hook this up below
      />
    </div>
  );
};

export default SelectPersonView;
