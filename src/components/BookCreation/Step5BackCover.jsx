import React, { useCallback } from 'react';
import { Sparkles } from 'lucide-react'; // Adjust if your icon path is different

const Step5BackCover = React.memo(({ newBook, setNewBook }) => {
  const handleChange = useCallback((field) => (e) => {
    setNewBook(prev => ({ ...prev, [field]: e.target.value }));
  }, [setNewBook]);
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a back cover note</h3>
      <p className="text-sm text-gray-600 mb-6">
        Add a personal message that will appear on the back cover of your book.
      </p>

      <div className="mb-4">
        <label htmlFor="book-title" className="block text-sm font-medium text-gray-700 mb-1">
          Book Title
        </label>
        <input
          id="book-title"
          name="title"
          type="text"
          autoComplete="off"
          value={newBook.title}
          onChange={(e) =>
            setNewBook(prev => {
              const val = e.target.value;
              return prev.title === val ? prev : { ...prev, title: val };
            })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter book title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="book-description" className="block text-sm font-medium text-gray-700 mb-1">
          Book Description
        </label>
        <input
          id="book-description"
          name="description"
          type="text"
          autoComplete="off"
          value={newBook.description}
          onChange={(e) =>
            setNewBook(prev => {
              const val = e.target.value;
              return prev.description === val ? prev : { ...prev, description: val };
            })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter short description"
        />
      </div>

      <div>
        <label htmlFor="back-cover-note" className="block text-sm font-medium text-gray-700 mb-1">
          Personal Note
        </label>
        <textarea
          id="back-cover-note"
          name="backCoverNote"
          autoComplete="off"
          value={newBook.backCoverNote}
          onChange={(e) =>
            setNewBook(prev => {
              const val = e.target.value;
              return prev.backCoverNote === val ? prev : { ...prev, backCoverNote: val };
            })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-32"
          placeholder="Write your personal note here..."
        />
      </div>

      <div className="mt-4 flex items-center">
        <button
          onClick={() => {
            setNewBook(prev => ({
              ...prev,
              backCoverNote: "I've collected these thoughts and lessons especially for you. May they guide, comfort, and inspire you throughout your life's journey."
            }));
          }}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Generate with AI
        </button>
      </div>
    </div>
  );
});

export default Step5BackCover;
