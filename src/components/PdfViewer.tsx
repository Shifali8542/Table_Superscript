import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfNav } from './PdfNav';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  currentPage: number;
  onLoadSuccess: (numPages: number) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  currentPage,
  onLoadSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1.0); // State for PDF zoom
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>();

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setIsLoading(false);
    onLoadSuccess(numPages);
  };

  useEffect(() => {
    const setWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    setWidth();
    window.addEventListener('resize', setWidth);

    return () => {
      window.removeEventListener('resize', setWidth);
    };
  }, []);

  const handleReset = useCallback(() => {
    setScale(1.0);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* PdfNav for zoom controls */}
      <PdfNav 
        scale={scale}
        onScaleChange={setScale}
        onReset={handleReset}
      />
      
      <div className="flex-1 overflow-auto bg-gray-100">
        <div 
          ref={containerRef}
          className="relative"
        >
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <div className="relative">
            <Document
              file="/sample.pdf"
              onLoadSuccess={handleDocumentLoadSuccess}
              loading=""
              className="flex"
            >
              <Page
                pageNumber={currentPage}
                // Apply scale to the page width
                width={containerWidth ? containerWidth * scale : undefined}
                className="shadow-lg"
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};