// app/page.tsx
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
          
          <PDFUploader 
            onFileChange={handleFileChange} 
            currentFile={file} 
          />

          {file && (
            <PDFViewer
              file={file}
              pageNumber={pageNumber}
              numPages={numPages}
              onPageChange={setPageNumber}
              onDocumentLoadSuccess={handleDocumentLoadSuccess}
            />
          )}
        </main>
      </div>
    </>
  );
}