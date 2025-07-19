import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Download, ShoppingCart, Edit, Share } from 'lucide-react';
import BookEditor from './BookEditor';
import { fetchAuthSession } from 'aws-amplify/auth';
import ToastMessage from '../BookCreation/ToastMessage';

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.NODE_ENV === 'development'
    ? `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    : '/pdf.worker.min.js';

export default function PDFViewerWrapper({ book, onClose, onEdit }) {
  const file = book.status === "Published"
    ? book.publishedBook
    : null;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [toasts, setToasts ] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Update handleEdit function
  const handleEdit = () => {
    onEdit(book);
  };

  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 1000
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (book.status === "Draft" && !file) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white p-6 rounded-lg max-w-md text-center">
          <h3 className="text-lg font-medium mb-2">Draft Not Viewable</h3>
          <p className="mb-4">This book is still in draft mode. Please publish it to view as PDF.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth * 0.9, 800),
        height: Math.min(window.innerHeight * 0.7, 1000)
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = () => {
    const cleanName = book.name
      ? book.name.replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
      : 'document';

    const filename = `${cleanName}.pdf`;

    try {
      const base64Data = file.split(',')[1] || file;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // Mobile behavior - open in new tab
        const newTab = window.open('', '_blank');
        if (newTab) {
          newTab.location.href = url;
          // Mobile Safari workaround - may still show toolbar briefly
          setTimeout(() => {
            try {
              newTab.document.title = filename;
              // This helps prevent the "Back" button from reloading your app
              newTab.history.replaceState(null, '', window.location.href);
            } catch (e) {
              console.log("Couldn't modify new tab", e);
            }
          }, 500);
        } else {
          // Fallback if popup blocked
          window.location.href = url;
        }

        // Clean up after longer delay for mobile
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      } else {
        // Desktop behavior - standard download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback for base64 errors
      const link = document.createElement('a');
      link.href = file;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  const handleShareBook = async () => {
    if (!recipientEmail || !book.publishedBook) return;

    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    try {
      const response = await fetch(`https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/books/${book.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          recipientEmail,
          senderName: book.userName || 'A WellSaid user',
          personalMessage,
          bookUrl: book.publishedBook,
          bookId: book.id,
          expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // optional
        })
      });

      const result = await response.json();
      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Book Shared',
          message: `Successfully shared with ${recipientEmail}`,
          onDismiss: () => {
            setShowShareModal(false);
            setRecipientEmail('');
            setPersonalMessage('');
          }
        });
        // Close modal immediately
        setShowShareModal(false);
        setRecipientEmail('');
        setPersonalMessage('');
      } else {
        addToast({
          type: 'error',
          title: 'Sharing Failed',
          message: result?.error || 'Failed to share book'
        });
      }
    } catch (err) {
      console.error("Share error:", err);
      addToast({
        type: 'error',
        title: 'Unexpected Error',
        message: 'Error sharing book. Please try again.'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100] pointer-events-none">
      {/* Main modal container */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl pointer-events-auto flex flex-col" style={{ maxHeight: '90vh' }}>

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all"
              title="Options"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-800" />
            </button>

            {/* Expanded Actions */}
            <div className={`flex items-center ml-2 transition-all duration-200 ${isMenuOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
              <div className="flex gap-2 bg-white rounded-full pl-2 pr-3 py-1 shadow-lg">
                <button
                  onClick={handleDownload}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Add to Cart">
                  <ShoppingCart className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                  title={book.status === "Draft" ? "Continue Editing" : "Convert to Draft & Edit"}
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                  title="Share Book"
                >
                  <Share className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              setPageNumber(1);
            }}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Scrollable PDF Content */}
        <div
          className="flex-1 overflow-auto touch-pan-y overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            paddingTop: '60px', // Space for header
            paddingBottom: '60px' // Space for pagination
          }}
        >
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="text-center py-20">Loading PDF...</div>}
            onLoadError={(error) => console.error("PDF load error:", error)}
          >
            <div className="p-4 flex justify-center">
              <div className="relative">
                {/* Shadow element that will appear on all sides */}
                <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,0,0,0.1)] -z-10" />

                <Page
                  pageNumber={pageNumber}
                  width={dimensions.width - 8} // Reduced width to allow shadow space
                  loading={<div className="text-center py-20">Loading page...</div>}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </div>
          </Document>
        </div>

        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[110]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">Share this book</h2>

              <label className="block mb-4">
                <span className="text-base font-medium text-gray-700">Recipient Email</span>
                <input
                  type="email"
                  className="mt-2 block w-full border rounded px-4 py-3 text-[16px]"
                  placeholder="email@example.com"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                />
              </label>

              <label className="block mb-5">
                <span className="text-base font-medium text-gray-700">Personal Message</span>
                <textarea
                  className="mt-2 block w-full border rounded px-4 py-3 text-[16px]"
                  rows={4}
                  placeholder="Write something thoughtful..."
                  value={personalMessage}
                  onChange={e => setPersonalMessage(e.target.value)}
                />
              </label>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-5 py-3 text-base rounded-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-3 text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleShareBook}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {numPages && (
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-center items-center">
            <button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 mx-2 bg-gray-100 rounded-full disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="mx-4 text-sm font-medium">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 mx-2 bg-gray-100 rounded-full disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 space-y-2 z-[120]">
          {toasts.map((toast) => (
            <ToastMessage
              key={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
