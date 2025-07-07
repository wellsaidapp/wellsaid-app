import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronUp, ChevronDown, Save, Trash2 } from 'lucide-react';
import Header from '../../appLayout/Header';
import { convertPdfToEditableFormat, generateNewPdf } from '../utils/pdfEditor';

const BookEditor = ({ book, onClose, onSave, onBackToViewer }) => {
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState(book.name);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize editor with book content
  useEffect(() => {
    if (book.publishedState?.contentSnapshot) {
      setPages([...book.publishedState.contentSnapshot]);
    } else if (book.publishedState?.pdfBase64) {
      // Convert PDF back to editable format if no snapshot exists
      convertPdfToEditableFormat(book.publishedState.pdfBase64)
        .then(convertedPages => setPages(convertedPages));
    }
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Generate new PDF from edited content
      const newPdfBase64 = await generateNewPdf(title, pages);

      // Update the book object
      const updatedBook = {
        ...book,
        name: title,
        publishedState: {
          ...book.publishedState,
          pdfBase64: newPdfBase64,
          contentSnapshot: pages,
          lastEdited: new Date().toISOString()
        }
      };

      await onSave(updatedBook);
      onClose();
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
              onBackToViewer(); // Remove the onClose() call here
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
      </div>
    </div>
  );
};

export default BookEditor;
