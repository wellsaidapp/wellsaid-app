import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronUp, ChevronDown, Save, Trash2, Palette, Type, Image as ImageIcon } from 'lucide-react';
import Header from '../../appLayout/Header';
import { generateBookPDF } from '../BookCreation/BookPDFGenerator';
import ImageCropperModal from '../BookCreation/ImageCropperModal';
import { uploadData } from 'aws-amplify/storage';

const BookEditor = ({ book, onClose, onSave, onBackToViewer, returnToViewer, previousViewerState, editingBook }) => {
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState(book.name);
  const [description, setDescription] = useState(book.description || '');
  const [backCoverNote, setBackCoverNote] = useState(book.backCoverNote || '');
  const [coverImage, setCoverImage] = useState(book.coverImage || null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'design'
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // Inside the BookEditor component, add these state variables:
  const [fontStyle, setFontStyle] = useState(book.fontStyle || 'serif');
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(book.isBlackAndWhite || false);
  // Initialize editor with book content
  useEffect(() => {
    const initializeBookData = async () => {
      if (book.publishedContent) {
        setPages([...book.publishedContent]);
      }
      setDescription(book.description || '');
      setBackCoverNote(book.backCoverNote || '');

      // Handle cover image conversion if it's a URL
      if (book.coverImage && book.coverImage.startsWith('http')) {
        try {
          const base64Image = await fetchImageAsBase64(book.coverImage);
          setCoverImage(base64Image);
        } catch (error) {
          console.error('Failed to convert cover image:', error);
          setCoverImage(null);
        }
      } else {
        setCoverImage(book.coverImage || null);
      }
    };

    initializeBookData();
  }, [book]);

  // Add this utility function at the top of BookEditor.jsx
  const fetchImageAsBase64 = async (url) => {
    // If already base64, return as-is
    if (url.startsWith('data:')) return url;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // This is the critical line

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };

      img.onerror = () => {
        console.warn('Image load failed, falling back to original URL');
        resolve(url); // Fallback to original URL
      };

      // Add cache busting parameter
      img.src = url.includes('?') ? `${url}&ts=${Date.now()}` : `${url}?ts=${Date.now()}`;
    });
  };

  const handlePageReorder = (index, direction) => {
    const newPages = [...pages];
    if (direction === 'up' && index > 0) {
      [newPages[index], newPages[index - 1]] = [newPages[index - 1], newPages[index]];
    } else if (direction === 'down' && index < newPages.length - 1) {
      [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
    }
    setPages(newPages);
  };

  const handlePageEdit = (index, field, value) => {
    const newPages = [...pages];
    newPages[index][field] = value;
    setPages(newPages);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setCoverImage(croppedImage);
    setShowCropper(false);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedBook = {
        ...book,
        title,
        description,
        backCoverNote,
        coverImage,
        fontStyle,
        isBlackAndWhite,
        publishedState: {
          ...book.publishedState,
          contentSnapshot: pages,
          lastEdited: new Date().toISOString()
        }
      };

      // 1. Generate PDF
      const pdfBlob = await generateBookPDF(
        updatedBook,
        updatedBook.publishedState.entryOrder || [],
        updatedBook.publishedState.contentSnapshot || []
      );

      // 2. Overwrite existing PDF in S3 using the known key
      try {
        let keyFromUrl = book.publishedBook
          .replace('https://', '')
          .split('.amazonaws.com/')[1];

        // Remove redundant 'public/' prefix if present
        if (keyFromUrl.startsWith('public/')) {
          keyFromUrl = keyFromUrl.replace('public/', '');
        }

        console.log("📦 Attempting to upload PDF to:", keyFromUrl);

        const uploadResult = await uploadData({
          key: keyFromUrl,
          data: pdfBlob,
          options: {
            contentType: 'application/pdf',
            accessLevel: 'public',
          }
        });

        await uploadResult.result; // 🧠 Await upload completion

        console.log("✅ Upload completed successfully");

      } catch (uploadError) {
        console.error("❌ PDF upload to S3 failed:", uploadError);
      }

      // 3. Save book without changing publishedBook URL
      const savedBook = await onSave(updatedBook);

      // 4. Navigation handling
      if (returnToViewer) {
        onBackToViewer(savedBook || updatedBook);
      } else {
        onClose();
      }

    } catch (error) {
      console.error("❌ Error saving book:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <Header />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              onBackToViewer?.(editingBook);
            }}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Viewer
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
              isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Save size={18} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'design' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('design')}
          >
            Cover & Design
          </button>
        </div>

        {/* Add this new section right here - below the tab buttons but above the content sections */}
        {activeTab === 'design' && (
          <div className="flex justify-end gap-2 mb-4">
            {/* Font Style Toggle */}
            <button
              onClick={() => setFontStyle(prev => prev === 'serif' ? 'sans' : 'serif')}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              title={fontStyle === 'serif' ? 'Switch to Sans Serif' : 'Switch to Serif'}
            >
              <Type className={`w-4 h-4 ${fontStyle === 'serif' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="text-sm">{fontStyle === 'serif' ? 'Serif' : 'Sans'}</span>
            </button>

            {/* Black & White Toggle */}
            <button
              onClick={() => setIsBlackAndWhite(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              title={isBlackAndWhite ? 'Show in Color' : 'Show in B&W'}
            >
              <Palette className={`w-4 h-4 ${isBlackAndWhite ? 'text-gray-400' : 'text-blue-600'}`} />
              <span className="text-sm">{isBlackAndWhite ? 'B&W' : 'Color'}</span>
            </button>
          </div>
        )}

        {activeTab === 'content' ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4 border border-white/50 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Pages ({pages.length})</h3>

              {pages.map((page, index) => (
                <div key={`${page.insightId}-${index}`} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Page {index + 1}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageReorder(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handlePageReorder(index, 'down')}
                        disabled={index === pages.length - 1}
                        className={`p-1 rounded ${index === pages.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Prompt</label>
                      <textarea
                        value={page.prompt}
                        onChange={(e) => handlePageEdit(index, 'prompt', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Response</label>
                      <textarea
                        value={page.response}
                        onChange={(e) => handlePageEdit(index, 'response', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4 border border-white/50 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Book cover"
                    className="w-full max-w-md h-auto rounded-lg object-cover"
                  />
                  <button
                    onClick={handleRemoveCoverImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Back Cover Note</label>
              <textarea
                value={backCoverNote}
                onChange={(e) => setBackCoverNote(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Add a personal note for the back cover..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Cropper Modal - moved outside of the main content */}
      {showCropper && (
        <ImageCropperModal
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default BookEditor;
