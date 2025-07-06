import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Download, ShoppingCart, Edit } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.NODE_ENV === 'development'
    ? `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    : '/pdf.worker.min.js';

export default function PDFViewerWrapper({ file, name, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
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

  const handleDownload = () => {
    // Clean the filename by removing special characters
    const cleanName = name
      ? name.replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
            .replace(/\s+/g, ' ')     // Collapse multiple spaces
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
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100]">
      {/* Top Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        {/* Expandable Menu Button */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all focus:outline-none focus:ring-0"
            title="Options"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-800" />
          </button>

          {/* Expanded Actions */}
          <div className={`flex items-center ml-2 transition-all duration-200 overflow-hidden ${isMenuOpen ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0'}`}>
            <div className="flex gap-2 bg-white bg-opacity-90 rounded-full pl-2 pr-3 py-1 shadow-lg backdrop-blur-sm">
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
              <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Edit">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setPageNumber(1);
          }}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all focus:outline-none focus:ring-0"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* PDF Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl mt-12" style={{ maxHeight: 'calc(90vh - 48px)' }}>
        <div className="overflow-auto rounded-lg" style={{ maxHeight: '80vh' }}>
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="text-center py-8">Loading PDF...</div>}
          >
            <Page
              pageNumber={pageNumber}
              width={dimensions.width}
              loading={<div className="text-center py-8">Loading page...</div>}
            />
          </Document>
        </div>

        {/* Pagination */}
        {numPages && (
          <div className="flex justify-center items-center p-4 border-t sticky bottom-0 bg-white rounded-b-lg">
            <button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 mx-2 bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="mx-4">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 mx-2 bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
