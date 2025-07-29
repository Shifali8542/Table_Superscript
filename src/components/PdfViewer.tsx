import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// import { PdfNav } from './PdfNav'; // Commented out temporarily
import { Highlight } from '../types';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  currentPage: number;
  onLoadSuccess: (numPages: number) => void;
  highlights: Highlight[];
  onAddHighlight: (highlight: Omit<Highlight, 'id'>) => void;
  isHighlightMode: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  currentPage,
  onLoadSuccess,
  highlights,
  onAddHighlight,
  isHighlightMode
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
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


  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!isHighlightMode) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setIsSelecting(true);
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
  }, [isHighlightMode]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isSelecting || !selectionStart) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setSelectionEnd({ x, y });
  }, [isSelecting, selectionStart]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !selectionStart || !selectionEnd) return;

    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    if (width > 10 && height > 10) {
      onAddHighlight({
        x,
        y,
        width,
        height,
        pageNumber: currentPage
      });
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isSelecting, selectionStart, selectionEnd, currentPage, onAddHighlight]);

  const renderSelection = () => {
    if (!isSelecting || !selectionStart || !selectionEnd) return null;

    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    return (
      <div
        className="absolute bg-red-500 bg-opacity-30 border-2 border-red-500 pointer-events-none"
        style={{
          left: x,
          top: y,
          width,
          height
        }}
      />
    );
  };

  const renderHighlights = () => {
    return highlights
      .filter(highlight => highlight.pageNumber === currentPage)
      .map(highlight => (
        <div
          key={highlight.id}
          className="absolute bg-red-500 bg-opacity-30 border border-red-400 pointer-events-none"
          style={{
            left: highlight.x,
            top: highlight.y,
            width: highlight.width,
            height: highlight.height
          }}
        />
      ));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* <PdfNav />  <- This line is removed to prevent the error */}
      
      <div className="flex-1 overflow-auto bg-gray-100">
        <div 
          ref={containerRef}
          className="relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: isHighlightMode ? 'crosshair' : 'default' }}
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
              className="flex justify-center"
            >
              <Page
                pageNumber={currentPage}
                width={containerWidth}
                className="shadow-lg"
              />
            </Document>
            
            {renderHighlights()}
            {renderSelection()}
          </div>
        </div>
      </div>
    </div>
  );
};