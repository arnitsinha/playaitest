'use client';

import { useRef, useState } from 'react';

interface PDFUploaderProps {
  onFileChange: (file: File) => void;
  currentFile: File | null;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileChange, currentFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFullUploader, setShowFullUploader] = useState(!currentFile);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
      setShowFullUploader(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onFileChange(droppedFile);
      setShowFullUploader(false);
    }
  };

  const handleUploadDifferentFile = () => {
    // Instead of showing the full uploader, directly trigger the file input
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-8 transition-all max-w-4xl mx-auto">
      {showFullUploader ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload PDF Document</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="mb-2 text-sm font-medium text-gray-900">
                {isDragging ? 'Drop your PDF here' : 'Drag and drop your PDF here'}
              </p>
              <p className="mb-4 text-xs text-gray-500">
                or
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Browse Files
              </button>
              <p className="mt-4 text-xs text-gray-500">
                PDF files only (max 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-0.5">{currentFile?.name}</p>
              <p className="text-xs text-gray-500">
                {currentFile ? `${(currentFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleUploadDifferentFile}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Upload Different File
          </button>
        </div>
      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
};

export default PDFUploader;