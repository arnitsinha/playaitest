// app/components/PDFInitializer.tsx
'use client';

import { useEffect } from 'react';
import { pdfjs } from 'react-pdf';

export function PDFInitializer() {
  useEffect(() => {
    // Set the worker source using unpkg CDN in client-side code only
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  return null;
}