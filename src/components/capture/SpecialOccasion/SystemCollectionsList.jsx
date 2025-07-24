import { useState } from 'react';
import SystemCollectionGroup from './SystemCollectionGroup';

const SystemCollectionsList = ({ groupedCollections, selectedCollections, onCollectionToggle }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const handleGroupToggle = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleGroupSelect = (groupId, collections) => {
    const allSelected = collections.every(c => selectedCollections.includes(c.id));

    collections.forEach(collection => {
      if (allSelected) {
        // Deselect all if all are selected
        onCollectionToggle(collection.id, false);
      } else {
        // Select all if not all are selected
        onCollectionToggle(collection.id, true);
      }
    });
  };

  return (
    <div className="space-y-3">
      {groupedCollections.map(group => (
        <SystemCollectionGroup
          key={group.name}
          group={group}
          isExpanded={expandedGroups[group.name]}
          selectedCollections={selectedCollections}
          onToggle={() => handleGroupToggle(group.name)}
          onSelect={() => handleGroupSelect(group.name, group.collections)}
          onCollectionToggle={onCollectionToggle}
        />
      ))}
    </div>
  );
};

export default SystemCollectionsList;
