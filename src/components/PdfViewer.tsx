import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfNav } from './PdfNav';
import './PdfViewer.scss'; // Import the new SCSS file

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
  const [scale, setScale] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>();

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setIsLoading(false);
    onLoadSuccess(numPages);
  };

  useEffect(() => {
    const setWidth = () => {
      // Set width for scaling, subtracting padding for better fit
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 40);
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
    <div className="pdf-viewer">
      {/* PdfNav for zoom controls */}
      <PdfNav 
        scale={scale}
        onScaleChange={setScale}
        onReset={handleReset}
      />
      {/* Main PDF Display Area */}
      <div className="pdf-viewer__content-area" ref={containerRef}>
        <div className="pdf-viewer__document-container">
          {isLoading && (
            <div className="pdf-viewer__loader-container">
              <div className="pdf-viewer__spinner"></div>
            </div>
          )}
          
          <div>
            <Document
              file="/sample.pdf"
              onLoadSuccess={handleDocumentLoadSuccess}
              loading=""
            >
              <Page
                pageNumber={currentPage}
                width={containerWidth ? containerWidth * scale : undefined}
                scale={1} // Use width for scaling primarily
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};
