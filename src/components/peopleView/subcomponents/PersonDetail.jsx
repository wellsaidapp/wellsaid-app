import React, { useRef, useState } from 'react';
import { ChevronLeft, Edit3, Camera } from 'lucide-react';
import InsightCard from './InsightCard';
import SharedBooksSection from '../../home/SharedBooksSection'; // adjust path as needed
import BookPreviewModal from '../../home/BookPreviewModal'; // if needed
import CreateBook from '../../library/BookCreation/CreateBook'; // to show Start New Book CTA
import { SHARED_BOOKS, getBooksByRecipient } from '../../../constants/sharedBooks';
import ImageCropperModal from '../../library/BookCreation/ImageCropperModal';

const PersonDetail = ({
  person,
  insights,
  collections,
  books,
  onBack,
  setSelectedBook,
  setCurrentPage,
  onStartNewBook,
  onTempAvatarUpload,
  croppedAvatarImage
}) => {
  const personInsights = insights.filter(i =>
    i.recipients?.includes(person.id)
  );

  const personBooks = books.filter(b =>
    b.recipientId === person.id
  );

  const fileInputRef = useRef(null);

  const handleEditPerson = () => { /* ... */ };
  const handleUploadPhoto = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onTempAvatarUpload(reader.result); // passed from parent
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-blue-600 flex items-center gap-1">
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="w-6" /> {/* spacer */}
      </div>

      {/* Avatar and Name */}
      <div className="flex flex-col items-center mb-4 relative">
      <div className="relative w-20 h-20 mb-3">
        {person.avatarImage ? (
          <img
            src={person.avatarImage}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className={`w-20 h-20 rounded-full ${person.color} flex items-center justify-center text-white text-2xl font-medium`}>
            {person.avatar}
          </div>
        )}
        <button
          onClick={handleUploadPhoto}
          className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm"
        >
          <Camera className="w-4 h-4 text-gray-600" />
        </button>
      </div>
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <p className="text-gray-800 font-semibold text-lg">{person.name}</p>
            <button onClick={handleEditPerson}>
              <Edit3 className="w-4 h-4 text-gray-400 hover:text-blue-600" />
            </button>
          </div>
          <p className="text-sm text-gray-500">{person.relationship}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-center mb-6">
        <StatCard value={personInsights.length} label="Insights" color="blue" />
        <StatCard value={personBooks.length} label="Books" color="blue" />
      </div>

      {/* Recent Insights */}
      <h3 className="font-medium text-gray-800 mb-3">Recent Insights</h3>
      <div className="space-y-3 mb-6">
        {personInsights.slice(0, 3).map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      {/* Book Section (reusing from HomeView) */}
      <SharedBooksSection
        books={personBooks}
        onView={(book) => {
          setSelectedBook(book);
          setCurrentPage(0);
        }}
      />

      {/* CTA */}
      <div className="mt-6">
        <CreateBook
          currentView={null} // or 'people' if you'd like to track where it's triggered from
          onStartNewBook={() => onStartNewBook(person.id)}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

const StatCard = ({ value, label, color }) => (
  <div className={`bg-${color}-50 rounded-lg p-3`}>
    <div className={`font-bold text-${color}-600`}>{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);

export default PersonDetail;
