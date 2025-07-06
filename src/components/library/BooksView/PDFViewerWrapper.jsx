import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Download, ShoppingCart, Edit } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.NODE_ENV === 'development'
    ? `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    : '/pdf.worker.min.js';

export default function PDFViewerWrapper({ book, onClose }) {
  const file = book.status === "Published"
    ? book.publishedState.pdfBase64
    : null;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 1000
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEdit = () => {
    if (book.status === "Draft") {
      // Open in editor with draft state
      openBookEditor(book.id);
    } else {
      // Convert published book to draft first
      if (confirm("Editing will convert this published book to a draft. Continue?")) {
        convertToDraft(book.id);
        openBookEditor(book.id);
      }
    }
    onClose();
  };

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
    // Use the book's name for the filename
    const cleanName = book.name
      ? book.name.replace(/[^\w\s-]/g, '') // Remove special chars
                .replace(/\s+/g, ' ')     // Collapse spaces
                .trim()                   // Trim whitespace
      : 'document';

    const filename = `${cleanName}.pdf`;

    // Convert base64 to Blob
    try {
      // First, ensure we're working with the base64 data part only (remove data:application/pdf;base64, if present)
      const base64Data = file.split(',')[1] || file;

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback to simple download if Base64 decoding fails
      const link = document.createElement('a');
      link.href = file;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      </div>
    </div>
  );
}
