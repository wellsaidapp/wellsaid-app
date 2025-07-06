import React from 'react';
import DraggableEntry from './DraggableEntry';

const Step3Arrange = ({ newBook, entryOrder, setEntryOrder, insights, moveEntry, setNewBook }) => {

  // Filter out entries that are no longer selected or don't exist
  const filteredEntries = entryOrder.filter(entryId =>
    newBook.selectedEntries.includes(entryId) &&
    insights.some(e => e.id === entryId)
  );

  // If filteredEntries is different from entryOrder, update the state
  React.useEffect(() => {
    if (filteredEntries.length !== entryOrder.length) {
      setEntryOrder(filteredEntries);
    }
  }, [filteredEntries]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Arrange your book pages</h3>
      <p className="text-sm text-gray-600 mb-6">
        Drag and drop your insights into the slots. The top slot will become Page 1.
      </p>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No insights selected. Go back to Step 2 to add insights.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entryId, index) => {
            const entry = insights.find(e => e.id === entryId);
            if (!entry) return null;

            return (
              <div
                key={entryId}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="text-sm font-semibold text-gray-500 mb-2">Page {index + 1}</div>
                <DraggableEntry
                  entry={entry}
                  index={index}
                  moveEntry={moveEntry}
                  onRemove={() => {
                    setEntryOrder(prev => prev.filter(id => id !== entryId));
                    setNewBook(prev => ({
                      ...prev,
                      selectedEntries: prev.selectedEntries.filter(id => id !== entryId)
                    }));
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions remain the same */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            const sorted = [...filteredEntries].sort((a, b) => {
              const entryA = insights.find(e => e.id === a);
              const entryB = insights.find(e => e.id === b);
              return new Date(entryB.date) - new Date(entryA.date);
            });
            setEntryOrder(sorted);
          }}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Arrange by Date
        </button>
        <button
          onClick={() => {
            const sorted = [...filteredEntries].sort((a, b) => {
              const entryA = insights.find(e => e.id === a);
              const entryB = insights.find(e => e.id === b);
              return entryA.collections?.[0]?.localeCompare(entryB.collections?.[0] || '');
            });
            setEntryOrder(sorted);
          }}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Arrange by Collection
        </button>
      </div>
    </div>
  );
};

export default Step3Arrange;
