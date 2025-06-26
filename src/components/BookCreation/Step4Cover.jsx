
import React, { useRef, useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react'; // Or wherever your icons are sourced from

const Step4Cover = ({ newBook, setNewBook, coverImageState, setCoverImageState }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('coverImageState changed:', coverImageState);
  }, [coverImageState]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      console.log('FileReader result:', event.target.result);
      setCoverImageState({
        tempImage: event.target.result,
        showCropModal: true
      });
      setIsLoading(false);
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setIsLoading(false);
      alert('Error loading image');
    };

    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage) => {
    setNewBook(prev => ({ ...prev, coverImage: croppedImage }));
    setCoverImageState({ tempImage: null, showCropModal: false });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload a cover image</h3>
      <p className="text-sm text-gray-600 mb-6">
        Choose an image that represents your book.
      </p>

      <div className="flex flex-col items-center">
        {/* Changed to square container w-64 h-64 */}
        <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-gray-50 relative">
          {newBook.coverImage ? (
            <img
              src={newBook.coverImage}
              alt="Book cover"
              className="w-full h-full object-contain"  // Changed to object-contain
            />
          ) : isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-500">Loading image...</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No cover selected</p>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : newBook.coverImage ? 'Change Image' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
};

export default Step4Cover;
