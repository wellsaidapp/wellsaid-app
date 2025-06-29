import React from 'react';
import DraggableEntry from './DraggableEntry';

const Step3Arrange = ({ newBook, entryOrder, setEntryOrder, insights, moveEntry, setNewBook }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Arrange your book pages</h3>
      <p className="text-sm text-gray-600 mb-6">
        Drag and drop your insights into the slots. The top slot will become Page 1.
      </p>

      <div className="space-y-4">
        {entryOrder.map((entryId, index) => {
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

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            const sorted = [...entryOrder].sort((a, b) => {
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
            const sorted = [...entryOrder].sort((a, b) => {
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
