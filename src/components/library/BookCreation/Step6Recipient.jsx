import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const Step6Recipient = ({ newBook, setNewBook, individuals }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Who is this book for?</h3>
      <p className="text-sm text-gray-600 mb-6">
        Select the person you're creating this book for.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {individuals.map((person) => {
          const isSelected = newBook.recipient === person.id;

          return (
            <div
              key={person.id}
              onClick={() => setNewBook((prev) => ({ ...prev, recipient: person.id }))}
              className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 text-center ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {/* Check in top-right corner */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              )}

              {/* Avatar */}
              <div className={`mx-auto w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2`}>
                <span className="text-white font-semibold text-sm">
                  {person.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Name */}
              <h4 className="font-medium text-gray-800 text-sm truncate">
                {person.name}
              </h4>

              {/* Relationship */}
              <p className="text-xs text-gray-500 truncate">
                {person.relationship || 'Family member'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step6Recipient;
