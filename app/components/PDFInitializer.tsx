// app/components/PDFInitializer.tsx
'use client';

import { useEffect } from 'react';
import { pdfjs } from 'react-pdf';

// PDFInitializer component to set up the PDF.js worker
export function PDFInitializer() {
  useEffect(() => {
    // Set the worker source using unpkg CDN in client-side code only
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []); // Empty dependency array ensures this runs only once on mount

  return null; // This component doesn't render anything
}