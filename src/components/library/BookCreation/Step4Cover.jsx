import React, { useRef, useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { fetchAuthSession } from 'aws-amplify/auth';

const Step4Cover = ({ newBook, setNewBook, coverImageState, setCoverImageState }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchCoverImage = async (bookId) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const res = await fetch(
          `https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/books/${bookId}/coverImage`,
          {
            method: 'GET',
            headers: {
              Authorization: token,
            }
          }
        );

        if (!res.ok) throw new Error('Failed to fetch cover image');

        const base64 = await res.text();
        const contentType = 'image/jpeg';
        const blob = b64toBlob(base64, contentType);
        const blobUrl = URL.createObjectURL(blob);

        setCoverPreviewUrl(blobUrl);
        setNewBook(prev => ({
          ...prev,
          coverImage: blobUrl,
        }));
      } catch (err) {
        console.error("🔴 Error fetching cover image:", err);
        setCoverPreviewUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    const loadImage = async () => {
      if (
        newBook.existingBookId &&
        (!newBook.coverImage || newBook.coverImage.startsWith('https://'))
      ) {
        setIsLoading(true);
        await fetchCoverImage(newBook.existingBookId);
      }
    };

    loadImage();
  }, [newBook.existingBookId]);

  useEffect(() => {
    // This effect handles both initial load and crop updates
    if (newBook.coverImage) {
      setCoverPreviewUrl(newBook.coverImage);
    }
  }, [newBook.coverImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = event.target.result;
      setCoverImageState({
        tempImage: base64,
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

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload a cover image</h3>
      <p className="text-sm text-gray-600 mb-6">
        Choose an image that represents your book.
      </p>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-xs aspect-square border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-gray-50 relative">
          {newBook.coverImage ? (
            <img
              src={newBook.coverImage}
              alt="Book cover"
              className="w-full h-full object-contain"
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

function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export default Step4Cover;
