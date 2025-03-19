import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the interface for the PDFControls component props
interface PDFControlsProps {
  pageNumber: number; // Current page number
  numPages: number | null; // Total number of pages in the PDF
  onPageChange: (page: number) => void; // Callback function for changing the page
  scale: number; // Current zoom scale
  onZoomIn: () => void; // Callback function for zooming in
  onZoomOut: () => void; // Callback function for zooming out
  onResetZoom: () => void; // Callback function for resetting the zoom
}

// Main PDFControls component
const PDFControls: React.FC<PDFControlsProps> = ({
  pageNumber,
  numPages,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  // Function to navigate to the previous page
  const goToPrevPage = () => onPageChange(Math.max(pageNumber - 1, 1));

  // Function to navigate to the next page
  const goToNextPage = () => {
    if (numPages) onPageChange(Math.min(pageNumber + 1, numPages));
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      {/* Zoom controls */}
      <div className="flex items-center space-x-2">
        {/* Zoom out button */}
        <button
          onClick={onZoomOut} // Trigger zoom out
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>

        {/* Reset zoom button */}
        <button
          onClick={onResetZoom} // Trigger reset zoom
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Reset zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z" />
            <path d="M9 9h6v6" />
            <path d="M9 15l6-6" />
          </svg>
        </button>

        {/* Zoom in button */}
        <button
          onClick={onZoomIn} // Trigger zoom in
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>

      {/* Page navigation controls */}
      {numPages && (
        <div className="flex items-center text-sm text-gray-600 font-medium">
          <span className="mr-2">Page</span>
          {/* Input for manually entering a page number */}
          <input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const page = parseInt(e.target.value); // Parse the input value
              if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
                onPageChange(page); // Update the page if the input is valid
              }
            }}
            className="w-12 text-center border border-gray-300 rounded py-1 px-2 mx-1"
            aria-label="Page number"
          />
          <span>of {numPages}</span> {/* Display total number of pages */}
        </div>
      )}

      {/* Previous and next page buttons */}
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        <button
          onClick={goToPrevPage} // Trigger previous page navigation
          disabled={pageNumber <= 1} // Disable if on the first page
          className={`p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors ${pageNumber <= 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" /> {/* Left arrow icon */}
        </button>

        {/* Next page button */}
        <button
          onClick={goToNextPage} // Trigger next page navigation
          disabled={pageNumber >= (numPages || 1)} // Disable if on the last page
          className={`p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors ${pageNumber >= (numPages || 1) ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
          aria-label="Next page"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" /> {/* Right arrow icon */}
        </button>
      </div>
    </div>
  );
};

export default PDFControls;