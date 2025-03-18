import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFControlsProps {
  pageNumber: number;
  numPages: number | null;
  onPageChange: (page: number) => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

const PDFControls: React.FC<PDFControlsProps> = ({
  pageNumber,
  numPages,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const goToPrevPage = () => onPageChange(Math.max(pageNumber - 1, 1));
  const goToNextPage = () => {
    if (numPages) onPageChange(Math.min(pageNumber + 1, numPages));
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-2">
        <button
          onClick={onZoomOut}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <button
          onClick={onResetZoom}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Reset zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"/><path d="M9 9h6v6"/><path d="M9 15l6-6"/></svg>
        </button>
        <button
          onClick={onZoomIn}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
      </div>

      {numPages && (
        <div className="flex items-center text-sm text-gray-600 font-medium">
          <span className="mr-2">Page</span>
          <input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
                onPageChange(page);
              }
            }}
            className="w-12 text-center border border-gray-300 rounded py-1 px-2 mx-1"
            aria-label="Page number"
          />
          <span>of {numPages}</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className={`p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors ${pageNumber <= 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          className={`p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors ${pageNumber >= (numPages || 1) ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
          aria-label="Next page"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default PDFControls;