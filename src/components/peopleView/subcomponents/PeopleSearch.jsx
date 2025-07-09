import { Search } from 'lucide-react';

const PeopleSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-white/50">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your people..."
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
    </div>
  );
};

export default PeopleSearch;
