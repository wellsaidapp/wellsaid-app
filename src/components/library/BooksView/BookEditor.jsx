import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronUp, ChevronDown, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import Header from '../../appLayout/Header';
import { generateBookPDF } from '../BookCreation/BookPDFGenerator';
import ImageCropperModal from '../BookCreation/ImageCropperModal'

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

  // Initialize editor with book content
  useEffect(() => {
    if (book.publishedState?.contentSnapshot) {
      setPages([...book.publishedState.contentSnapshot]);
    }
    setDescription(book.description || '');
    setBackCoverNote(book.backCoverNote || '');
    setCoverImage(book.coverImage || null);
  }, [book]);

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
        publishedState: {
          ...book.publishedState,
          contentSnapshot: pages,
          lastEdited: new Date().toISOString()
        }
      };

      // Generate the new PDF
      const pdfBlob = await generateBookPDF(
        updatedBook,
        updatedBook.publishedState.entryOrder || [],
        updatedBook.publishedState.contentSnapshot || []
      );

      // Convert blob to base64 for storage
      const pdfBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(pdfBlob);
      });

      // Update the book with the new PDF
      const finalBook = {
        ...updatedBook,
        publishedState: {
          ...updatedBook.publishedState,
          pdfBase64: pdfBase64,
          contentSnapshot: pages // Save the current pages as snapshot
        }
      };

      // Save the updated book
      const savedBook = await onSave(finalBook);

      // Trigger download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'book'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // If we're supposed to return to viewer, do that with the updated book
      if (returnToViewer) {
        onBackToViewer(savedBook || finalBook);
      } else {
        onClose();
      }
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
              {showCropper && (
                <ImageCropperModal
                  image={selectedImage}
                  onCropComplete={handleCropComplete}
                  onClose={() => setShowCropper(false)}
                />
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
    </div>
  );
};

export default BookEditor;
