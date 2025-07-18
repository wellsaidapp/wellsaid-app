import React, { useState, useEffect } from 'react';
import { BookOpen, Bookmark, CheckCircle } from 'lucide-react';
import { Switch } from 'antd';

const Step8Publish = ({ newBook, setNewBook, individuals, entryOrder, setBookCreationStep }) => {

  // 🔍 Log all book data for inspection
  useEffect(() => {
    console.log('🟦 newBook:', newBook);
  }, [newBook]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ready to publish your book</h3>
      <p className="text-sm text-gray-600 mb-6">
        Review your book details before finalizing.
      </p>

      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <div className="w-16 h-20 bg-white rounded-md shadow-sm mr-4 overflow-hidden">
            {newBook.coverImage ? (
              <img
                src={newBook.coverImage}
                alt="Book cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1">{newBook.title || 'Untitled Book'}</h4>
            <p className="text-sm text-gray-600 mb-2">{newBook.description || 'No description'}</p>

            <div className="flex items-center text-sm text-gray-500">
              <span>{entryOrder.length} pages</span>
              <span className="mx-2">•</span>
              <span>For {newBook.recipientName || 'No recipient selected'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Bookmark className="w-5 h-5 text-blue-500 mr-3" />
            <span className="font-medium">Save as draft</span>
          </div>
          <Switch
            checked={newBook.isDraft}
            onChange={() => setNewBook(prev => ({ ...prev, isDraft: !prev.isDraft }))}
          />
        </div>

        {newBook.isDraft ? (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-2">
              <Bookmark className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800">Saving as Draft</span>
            </div>
            <p className="text-sm text-yellow-700">
              This book will be saved as a draft. You can return to it later from your Library view to make edits or publish when you're ready.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium text-green-800">Ready to publish</span>
            </div>
            <p className="text-sm text-green-700">
              Your book meets all requirements for publishing. Click the button below to finalize.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step8Publish;
