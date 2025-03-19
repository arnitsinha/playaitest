'use client';

import { useRef, useState } from 'react';

// Define the interface for the PDFUploader component props
interface PDFUploaderProps {
  onFileChange: (file: File) => void; // Callback function when a file is selected
  currentFile: File | null; // The currently uploaded file (if any)
}

// Main PDFUploader component
const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileChange, currentFile }) => {
  // Refs and state for managing file input and drag-and-drop behavior
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input element
  const [isDragging, setIsDragging] = useState(false); // Whether a file is being dragged over the drop zone
  const [showFullUploader, setShowFullUploader] = useState(!currentFile); // Whether to show the full uploader UI or just the file info

  // Function to handle file selection via the file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Get the selected file
    if (selectedFile) {
      onFileChange(selectedFile); // Trigger the callback with the selected file
      setShowFullUploader(false); // Hide the full uploader UI
    }
  };

  // Function to handle drag-over event (for drag-and-drop)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDragging(true); // Set dragging state to true
  };

  // Function to handle drag-leave event (for drag-and-drop)
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDragging(false); // Set dragging state to false
  };

  // Function to handle drop event (for drag-and-drop)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDragging(false); // Set dragging state to false

    const droppedFile = e.dataTransfer.files[0]; // Get the dropped file
    if (droppedFile && droppedFile.type === 'application/pdf') { // Ensure the file is a PDF
      onFileChange(droppedFile); // Trigger the callback with the dropped file
      setShowFullUploader(false); // Hide the full uploader UI
    }
  };

  // Function to handle uploading a different file
  const handleUploadDifferentFile = () => {
    // Trigger the file input directly instead of showing the full uploader
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-8 transition-all max-w-4xl mx-auto">
      {/* Show the full uploader UI if no file is uploaded */}
      {showFullUploader ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload PDF Document</h3>
          
          {/* Drag-and-drop area */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' // Styling when dragging over
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50' // Default styling
            }`}
            onDragOver={handleDragOver} // Handle drag-over event
            onDragLeave={handleDragLeave} // Handle drag-leave event
            onDrop={handleDrop} // Handle drop event
          >
            <div className="flex flex-col items-center justify-center text-center">
              {/* Icon for drag-and-drop */}
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {/* Text instructions */}
              <p className="mb-2 text-sm font-medium text-gray-900">
                {isDragging ? 'Drop your PDF here' : 'Drag and drop your PDF here'}
              </p>
              <p className="mb-4 text-xs text-gray-500">
                or
              </p>
              {/* Button to browse files */}
              <button
                onClick={() => fileInputRef.current?.click()} // Trigger file input
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Browse Files
              </button>
              {/* File size restriction notice */}
              <p className="mt-4 text-xs text-gray-500">
                PDF files only (max 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Show file info and option to upload a different file if a file is already uploaded
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Checkmark icon */}
            <div className="text-green-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* File name and size */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-0.5">{currentFile?.name}</p>
              <p className="text-xs text-gray-500">
                {currentFile ? `${(currentFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </p>
            </div>
          </div>
          {/* Button to upload a different file */}
          <button
            onClick={handleUploadDifferentFile}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Upload Different File
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="application/pdf" // Only allow PDF files
        onChange={handleFileChange} // Handle file selection
        className="hidden" // Hide the input
        ref={fileInputRef} // Attach the ref
      />
    </div>
  );
};

export default PDFUploader;