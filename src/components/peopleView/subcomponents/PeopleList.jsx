import { Plus } from 'lucide-react';
import PersonCard from './PersonCard';

const PeopleList = ({ individuals, insights, onSelectPerson }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Your People</h2>
        <span className="text-sm text-gray-500">{individuals.length} people</span>
      </div>

      <div className="space-y-3">
        {individuals.map(person => (
          <PersonCard
            key={person.id}
            person={person}
            insights={insights}
            onClick={() => onSelectPerson(person)}
          />
        ))}

        <button className="w-full mt-2 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} />
          Add New Person
        </button>
      </div>
    </div>
  );
};

export default PeopleList;
