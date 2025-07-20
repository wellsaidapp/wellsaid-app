import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Download, ShoppingCart, Edit, Share, Share2, Send } from 'lucide-react';
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
  const [isSending, setIsSending] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const containerRef = useRef(null);

  // Pre-render adjacent pages
  const prevPageNumber = Math.max(1, pageNumber - 1);
  const nextPageNumber = Math.min(numPages || 1, pageNumber + 1);

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

  // Smooth page change with animation
  const changePage = (newPage) => {
    if (isTransitioning || newPage === pageNumber) return;

    setIsTransitioning(true);
    setPageNumber(newPage);

    // Animation duration matches CSS transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;

    // Minimum swipe distance to trigger page turn
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0 && pageNumber < numPages) {
        // Swipe left - next page
        changePage(pageNumber + 1);
      } else if (deltaX < 0 && pageNumber > 1) {
        // Swipe right - previous page
        changePage(pageNumber - 1);
      }
    }

    setTouchStartX(null);
  };

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
    if (!recipientEmail || !book.publishedBook || isSending) return;
    setIsSending(true); // Start loading
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
    } finally {
      setIsSending(false); // Always stop loading
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100] pointer-events-none">
      <div
        className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl pointer-events-auto flex flex-col"
        style={{ maxHeight: '90vh' }}
        ref={containerRef}
      >
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
                  onClick={() => setShowShareModal(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                  title="Share Book"
                >
                  <Send className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                  title={book.status === "Draft" ? "Continue Editing" : "Convert to Draft & Edit"}
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Add to Cart">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
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

        {/* Scrollable PDF Content with enhanced transitions */}
        <div
          className="flex-1 overflow-auto touch-pan-y overscroll-contain relative"
          style={{
            WebkitOverflowScrolling: 'touch',
            paddingTop: '60px',
            paddingBottom: '60px'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="text-center py-20">Loading PDF...</div>}
            onLoadError={(error) => console.error("PDF load error:", error)}
          >
            <div className="p-4 flex justify-center">
              <div className="relative w-full" style={{ maxWidth: `${dimensions.width}px` }}>
                {/* Current Page with transition effect */}
                <div
                  className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                  }}
                >
                  <Page
                    key={`page-${pageNumber}`}
                    pageNumber={pageNumber}
                    width={dimensions.width - 8}
                    loading={<div className="text-center py-20">Loading page...</div>}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>

                {/* Pre-render next page (hidden) for faster transitions */}
                {pageNumber < numPages && (
                  <div
                    className="absolute top-0 left-0 opacity-0 pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    <Page
                      key={`preload-next-${nextPageNumber}`}
                      pageNumber={nextPageNumber}
                      width={dimensions.width - 8}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                )}

                {/* Pre-render previous page (hidden) for faster transitions */}
                {pageNumber > 1 && (
                  <div
                    className="absolute top-0 left-0 opacity-0 pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    <Page
                      key={`preload-prev-${prevPageNumber}`}
                      pageNumber={prevPageNumber}
                      width={dimensions.width - 8}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                )}
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
                  onClick={handleShareBook}
                  disabled={isSending}
                  className={`px-5 py-3 text-base rounded-lg flex items-center justify-center gap-2 ${
                    isSending
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors`}
                >
                  {isSending ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Pagination with animation feedback */}
        {numPages && (
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-center items-center">
            <button
              onClick={() => changePage(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1 || isTransitioning}
              className={`px-4 py-2 mx-2 rounded-full transition-all duration-200 ${
                pageNumber <= 1 ? 'opacity-50' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="mx-4 text-sm font-medium">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => changePage(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages || isTransitioning}
              className={`px-4 py-2 mx-2 rounded-full transition-all duration-200 ${
                pageNumber >= numPages ? 'opacity-50' : 'bg-gray-100 hover:bg-gray-200'
              }`}
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
