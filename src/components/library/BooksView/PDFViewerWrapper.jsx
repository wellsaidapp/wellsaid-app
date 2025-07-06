import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.NODE_ENV === 'development'
    ? `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    : '/pdf.worker.min.js';

export default function PDFViewerWrapper({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 1000
  });

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100]">
      {/* Main container with rounded corners */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden"
           style={{ maxHeight: '90vh' }}>

        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setPageNumber(1);
          }}
          className="absolute -top-10 right-0 p-2 bg-white rounded-full shadow hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        {/* PDF Container with scroll - added rounded corners */}
        <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="text-center py-8">Loading PDF...</div>}
          >
            <div className="rounded-lg overflow-hidden">
              <Page
                pageNumber={pageNumber}
                width={dimensions.width}
                loading={<div className="text-center py-8">Loading page...</div>}
              />
            </div>
          </Document>
        </div>

        {/* Pagination - added rounded-b-lg */}
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
