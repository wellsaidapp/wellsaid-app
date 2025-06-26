import React from 'react';
import { Check } from 'lucide-react'; // Adjust path if you're not using lucide-react

const Step6Recipient = ({ newBook, setNewBook, individuals }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Who is this book for?</h3>
      <p className="text-sm text-gray-600 mb-6">
        Select the person you're creating this book for.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {individuals.map(person => (
          <div
            key={person.id}
            onClick={() => setNewBook(prev => ({ ...prev, recipient: person.id }))}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              newBook.recipient === person.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 ${person.color} rounded-full flex items-center justify-center mr-3`}>
                <span className="text-white font-medium">
                  {person.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{person.name}</h4>
                <p className="text-xs text-gray-500">
                  {person.relationship || 'Family member'}
                </p>
              </div>
              {newBook.recipient === person.id && (
                <div className="ml-auto text-blue-600">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step6Recipient;
