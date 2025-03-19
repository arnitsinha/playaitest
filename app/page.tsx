'use client';

import { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer';
import { PDFInitializer } from './components/PDFInitializer';

export default function Home() {
  // State to manage the uploaded PDF file
  const [file, setFile] = useState<File | null>(null);

  // State to store the total number of pages in the PDF
  const [numPages, setNumPages] = useState<number | null>(null);

  // State to track the current page number
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Function to handle file selection from the PDFUploader component
  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile); // Update the file state
    setPageNumber(1); // Reset to the first page when a new file is uploaded
    setNumPages(null); // Reset the total number of pages
  };

  // Function to handle successful document load in the PDFViewer component
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages); // Update the total number of pages
  };

  return (
    <>
      {/* Initialize the PDF.js worker */}
      <PDFInitializer />

      {/* Main container for the page */}
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          {/* Conditional rendering based on whether a file is uploaded */}
          {!file ? (
            // Centered uploader when no file is loaded
            <div className="flex justify-center items-center">
              <div className="w-full max-w-2xl">
                {/* PDFUploader component for file selection */}
                <PDFUploader 
                  onFileChange={handleFileChange} // Pass the file change handler
                  currentFile={file} // Pass the current file (null in this case)
                />
              </div>
            </div>
          ) : (
            // Two-column layout when a file is loaded
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Uploader and Controls */}
              <div className="lg:col-span-1">
                {/* PDFUploader component for file selection */}
                <PDFUploader 
                  onFileChange={handleFileChange} // Pass the file change handler
                  currentFile={file} // Pass the current file
                />
                
                {/* Container for audio controls (to be populated dynamically) */}
                <div id="audio-controls-container" className="bg-white rounded-lg shadow-lg mt-6"></div>
              </div>
              
              {/* Right column: PDF Viewer */}
              <div className="lg:col-span-2">
                {/* PDFViewer component for displaying the PDF */}
                <PDFViewer
                  file={file} // Pass the uploaded file
                  pageNumber={pageNumber} // Pass the current page number
                  numPages={numPages} // Pass the total number of pages
                  onPageChange={setPageNumber} // Pass the page change handler
                  onDocumentLoadSuccess={handleDocumentLoadSuccess} // Pass the document load success handler
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}