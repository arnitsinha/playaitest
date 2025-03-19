'use client';

import { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer';
import { PDFInitializer } from './components/PDFInitializer';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setPageNumber(1); // Reset to first page when new file is uploaded
    setNumPages(null); // Reset numPages
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <PDFInitializer />
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          {!file ? (
            // Centered uploader when no file is loaded
            <div className="flex justify-center items-center">
              <div className="w-full max-w-2xl">
                <PDFUploader 
                  onFileChange={handleFileChange} 
                  currentFile={file} 
                />
              </div>
            </div>
          ) : (
            // Two-column layout when a file is loaded
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Uploader and Controls */}
              <div className="lg:col-span-1">
                <PDFUploader 
                  onFileChange={handleFileChange} 
                  currentFile={file} 
                />
                
                {/* This empty div will be filled by moving the controls from PDFViewer */}
                <div id="audio-controls-container" className="bg-white rounded-lg shadow-lg mt-6"></div>
              </div>
              
              {/* Right column: PDF Viewer */}
              <div className="lg:col-span-2">
                <PDFViewer
                  file={file}
                  pageNumber={pageNumber}
                  numPages={numPages}
                  onPageChange={setPageNumber}
                  onDocumentLoadSuccess={handleDocumentLoadSuccess}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}