'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import { useEffect, useState, useRef, useCallback } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFControls from './PDFControls';

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  pageNumber: number;
  numPages: number | null;
  onPageChange: (page: number) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

const voices = [
  {
    name: 'Angelo',
    accent: 'american',
    language: 'English (US)',
    languageCode: 'EN-US',
    value: 's3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json',
    sample: 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Angelo_Sample.wav',
    gender: 'male',
    style: 'Conversational',
  },
  {
    name: 'Deedee',
    accent: 'american',
    language: 'English (US)',
    languageCode: 'EN-US',
    value: 's3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/original/manifest.json',
    sample: 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Deedee_Sample.wav',
    gender: 'female',
    style: 'Conversational',
  },
  {
    name: 'Jennifer',
    accent: 'american',
    language: 'English (US)',
    languageCode: 'EN-US',
    value: 's3://voice-cloning-zero-shot/801a663f-efd0-4254-98d0-5c175514c3e8/jennifer/manifest.json',
    sample: 'https://peregrine-samples.s3.amazonaws.com/parrot-samples/jennifer.wav',
    gender: 'female',
    style: 'Conversational',
  },
  {
    name: 'Briggs',
    accent: 'american',
    language: 'English (US)',
    languageCode: 'EN-US',
    value: 's3://voice-cloning-zero-shot/71cdb799-1e03-41c6-8a05-f7cd55134b0b/original/manifest.json',
    sample: 'https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Briggs_Sample.wav',
    gender: 'male',
    style: 'Narrative',
  },
  {
    name: 'Samara',
    accent: 'american',
    language: 'English (US)',
    languageCode: 'EN-US',
    value: 's3://voice-cloning-zero-shot/90217770-a480-4a91-b1ea-df00f4d4c29d/original/manifest.json',
    sample: 'https://parrot-samples.s3.amazonaws.com/gargamel/Samara.wav',
    gender: 'female',
    style: 'Conversational',
  },
];

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  pageNumber,
  numPages,
  onPageChange,
  onDocumentLoadSuccess,
}) => {
  const [pagesToPreload, setPagesToPreload] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.2);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voices[0].value);
  const [speed, setSpeed] = useState(1);
  const [temperature, setTemperature] = useState(1);
  const [progress, setProgress] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCache = useRef<Record<number, string>>({});
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const [fitMode, setFitMode] = useState<'width' | 'height' | 'both' | 'none'>('both');
  const controlsContainerRef = useRef<HTMLDivElement | null>(null);
  const [settingsChanged, setSettingsChanged] = useState(false);

  const renderAudioControlsInContainer = useCallback(() => {
    if (!controlsContainerRef.current) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'p-4';
    wrapper.innerHTML = `
      <h3 class="text-lg font-medium text-gray-800 mb-4">Audio Settings</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Select Voice</label>
        <select id="voice-select" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
          ${voices.map(voice => `
            <option value="${voice.value}" ${selectedVoice === voice.value ? 'selected' : ''}>
              ${voice.name} (${voice.gender}, ${voice.style})
            </option>
          `).join('')}
        </select>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Speed: ${speed}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value="${speed}"
          id="speed-control"
          class="w-full"
        />
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Temperature: ${temperature}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value="${temperature}"
          id="temp-control"
          class="w-full"
        />
      </div>
      
      ${isAudioLoading && progress !== null ? `
        <div class="mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full"
              style="width: ${progress}%"
            ></div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Generating audio... ${Math.round(progress)}%</p>
        </div>
      ` : isAudioLoading ? `
        <div class="flex items-center justify-center mb-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="text-sm text-gray-500 ml-2">Generating audio...</p>
        </div>
      ` : ''}
      
      <div class="flex space-x-2">
        ${(!audioSrc || settingsChanged) ? `
          <button
            id="fetch-audio-btn"
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            ${isAudioLoading ? 'disabled' : ''}
          >
            Generate Audio
          </button>
        ` : ''}
        
        ${audioSrc ? `
          <button
            id="toggle-audio-btn"
            class="${(!audioSrc || settingsChanged) ? 'flex-1' : 'w-full'} bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            ${isPlaying ? 'Pause' : 'Play'}
          </button>
        ` : ''}
      </div>
    `;

    controlsContainerRef.current.innerHTML = '';
    controlsContainerRef.current.appendChild(wrapper);

    document.getElementById('voice-select')?.addEventListener('change', (e) => {
      // @ts-expect-error - Event target value is guaranteed to be a string
      setSelectedVoice(e.target.value);
      setSettingsChanged(true);
    });
    
    document.getElementById('speed-control')?.addEventListener('input', (e) => {
      // @ts-expect-error - Event target value is guaranteed to be a string
      setSpeed(parseFloat(e.target.value));
      setSettingsChanged(true);
    });
    
    document.getElementById('temp-control')?.addEventListener('input', (e) => {
      // @ts-expect-error - Event target value is guaranteed to be a string
      setTemperature(parseFloat(e.target.value));
      setSettingsChanged(true);
    });

    document.getElementById('fetch-audio-btn')?.addEventListener('click', handleFetchAudio);

    document.getElementById('toggle-audio-btn')?.addEventListener('click', () => {
      if (isPlaying) {
        handlePauseAudio();
      } else {
        handlePlayAudio();
      }
    });
  }, [selectedVoice, speed, temperature, audioSrc, isPlaying, isAudioLoading, progress, settingsChanged]);

  useEffect(() => {
    const controlsContainer = document.getElementById('audio-controls-container');
    if (controlsContainer) {
      controlsContainerRef.current = controlsContainer as HTMLDivElement;
      renderAudioControlsInContainer();
    }

    return () => {
      if (controlsContainerRef.current) {
        controlsContainerRef.current.innerHTML = '';
      }
    };
  }, [renderAudioControlsInContainer]);

  useEffect(() => {
    renderAudioControlsInContainer();
  }, [renderAudioControlsInContainer]);

  // Reset all parameters when a new file is loaded
  useEffect(() => {
    onPageChange(1);
    audioCache.current = {};
    setAudioSrc(null);
    setIsPlaying(false);
    setIsAudioLoading(false);
    setScale(1.2);
    setPagesToPreload([]);
    setProgress(null);
    setFitMode('both');
    setSettingsChanged(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [file, onPageChange]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  
    // Set audio source if the page's audio is already cached
    if (audioCache.current[pageNumber]) {
      setAudioSrc(audioCache.current[pageNumber]);
      setSettingsChanged(false);
    } else {
      setAudioSrc(null); // Reset audio source if no cached audio exists
      setSettingsChanged(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    if (numPages) {
      const adjacentPages = [];
      if (pageNumber + 1 <= numPages) adjacentPages.push(pageNumber + 1);
      if (pageNumber - 1 >= 1) adjacentPages.push(pageNumber - 1);
      setPagesToPreload(adjacentPages);
    }
  }, [pageNumber, numPages]);

  // Reset audio when voice, temperature, or speed changes
  useEffect(() => {
    if (audioSrc) {
      setAudioSrc(null); // Reset audio source
      setIsPlaying(false); // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      // Clear the audio cache for the current page
      delete audioCache.current[pageNumber];
      setSettingsChanged(true);
    }
  }, [selectedVoice, temperature, speed, pageNumber]);

  // Fit PDF to container width and/or height based on fitMode
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pageWidth || !pageHeight) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // Subtract padding (8px on each side = 16px total)
        const availableWidth = width - 16;
        const availableHeight = height - 16;

        let newScale: number;
        
        switch (fitMode) {
          case 'width':
            newScale = availableWidth / pageWidth;
            break;
          case 'height':
            newScale = availableHeight / pageHeight;
            break;
          case 'both':
            // Use the smaller scale to ensure both dimensions fit
            const widthScale = availableWidth / pageWidth;
            const heightScale = availableHeight / pageHeight;
            newScale = Math.min(widthScale, heightScale);
            break;
          case 'none':
            // Keep current scale
            return;
          default:
            newScale = scale;
        }
        
        setScale(newScale);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, [pageWidth, pageHeight, fitMode, scale]);

  const extractTextFromPage = async (pageNum: number) => {
    const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = textContent.items.filter((item: any) => item.str).map((item: any) => item.str).join(' ');
    return text;
  };

  const fetchAudioForPage = async (pageNum: number) => {
    if (audioCache.current[pageNum] && !settingsChanged) {
      setAudioSrc(audioCache.current[pageNum]);
      return audioCache.current[pageNum];
    }
  
    try {
      setIsAudioLoading(true);
      setProgress(0); // Reset progress to 0%
  
      const text = await extractTextFromPage(pageNum);
  
      const options = {
        method: 'POST',
        headers: {
          AUTHORIZATION: 'ak-c3eaeadb838944cfaec82e41129a71f3',
          'X-USER-ID': '5jcbndHqeMg9yRPw95Ti5cVfNus2',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outputFormat: 'mp3',
          voiceConditioningSeconds: 20,
          voiceConditioningSeconds2: 20,
          language: 'english',
          model: 'PlayDialog',
          text: text,
          voice: selectedVoice,
          speed: speed,
          temperature: temperature,
        }),
      };
  
      console.log('Fetching audio for page:', pageNum);
      console.log('Request options:', options);
  
      const response = await fetch('https://api.play.ai/api/v1/tts/stream', options);
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const contentLength = response.headers.get('content-length');
      const totalLength = contentLength ? parseInt(contentLength, 10) : null;
  
      const reader = response.body?.getReader();
      let receivedLength = 0;
      const chunks = [];
  
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
  
          if (done) {
            break;
          }
  
          chunks.push(value);
          receivedLength += value.length;
  
          // Update progress if totalLength is available
          if (totalLength) {
            const newProgress = (receivedLength / totalLength) * 100;
            setProgress(newProgress);
          } else {
            // Fallback: Increment progress by a small amount for each chunk
            setProgress((prev) => Math.min((prev || 0) + 10, 90)); // Cap at 90% until done
          }
        }
      }
  
      const audioBlob = new Blob(chunks);
      const audioUrl = URL.createObjectURL(audioBlob);
  
      audioCache.current[pageNum] = audioUrl;
      setAudioSrc(audioUrl);
      setProgress(100); // Set progress to 100% when done
      setSettingsChanged(false); // Reset settings changed flag after successful generation
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      setProgress(null); // Reset progress on error
      return null;
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleFetchAudio = async () => {
    const audioUrl = await fetchAudioForPage(pageNumber);
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageLoadSuccess = (page: any) => {
    setPageWidth(page.originalWidth);
    setPageHeight(page.originalHeight);
  };

  // Enhanced zoom controls with fit options
  const handleZoomIn = () => {
    setFitMode('none');
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setFitMode('none');
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setFitMode('both');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto h-screen flex flex-col">
      {/* PDF Controls */}
      <PDFControls
        pageNumber={pageNumber}
        numPages={numPages}
        onPageChange={onPageChange}
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />

      {/* PDF Container */}
      <div
        ref={containerRef}
        className="relative flex justify-center p-4 bg-gray-100 overflow-auto flex-grow"
      >
        <div>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full min-h-72">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }
            error={
              <div className="text-red-500 p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="font-medium">Error loading PDF</p>
                <p className="text-sm mt-1">Please check that the file is a valid PDF document</p>
              </div>
            }
          >
            <Page
              key={`page_${pageNumber}`}
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              scale={scale}
              className="shadow-lg"
              onLoadSuccess={handlePageLoadSuccess}
            />

            <div className="hidden">
              {pagesToPreload.map(pageNum => (
                <Page
                  key={`preload_page_${pageNum}`}
                  pageNumber={pageNum}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={scale}
                />
              ))}
            </div>
          </Document>
        </div>
      </div>

      {/* Hidden audio element */}
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} controls className="hidden" />
      )}
    </div>
  );
};

export default PDFViewer;