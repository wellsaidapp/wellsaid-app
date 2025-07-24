import { ChevronDown, ChevronRight, Check, Minus } from 'lucide-react';

const SystemCollectionGroup = ({
  group,
  isExpanded,
  selectedCollections,
  onToggle,
  onSelect,
  onCollectionToggle
}) => {
  const allSelected = group.collections.every(c => selectedCollections.includes(c.id));
  const someSelected = group.collections.some(c => selectedCollections.includes(c.id)) && !allSelected;

  return (
    <div className={`border rounded-lg overflow-hidden ${group.color.replace('bg-', 'border-')}`}>
      {/* Group header */}
      <div
        className={`flex items-center justify-between p-4 cursor-pointer ${group.color} bg-opacity-10`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`flex items-center justify-center w-5 h-5 rounded border ${
              allSelected || someSelected
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 bg-white'
            }`}
          >
            {allSelected ? (
              <Check className="w-3 h-3 text-white" />
            ) : someSelected ? (
              <Minus className="w-3 h-3 text-white" />
            ) : null}
          </button>
          <h3 className="font-medium text-gray-800">{group.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              group.color
            } bg-opacity-100 text-white`}
          >
            {group.collections.length} collections
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Group content */}
      {isExpanded && (
        <div className="divide-y">
          {group.collections.map(collection => (
            <div
              key={collection.id}
              className="flex items-center p-4 pl-12 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                id={`collection-${collection.id}`}
                checked={selectedCollections.includes(collection.id)}
                onChange={(e) => onCollectionToggle(collection.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <label
                htmlFor={`collection-${collection.id}`}
                className="text-[16px] text-gray-700"
              >
                {collection.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SystemCollectionGroup;
