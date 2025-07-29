import React, { useState, useEffect, useRef } from 'react';
import { HtmlNav } from './HtmlNav';
import type { Highlight } from '../types';

interface HtmlViewerProps {
  currentPage: number;
  highlights: Highlight[];
  isHighlightMode: boolean;
  onAddHighlight: (highlight: Omit<Highlight, 'id'>) => void;
}

export const HtmlViewer: React.FC<HtmlViewerProps> = ({
  currentPage,
  highlights,
  isHighlightMode,
  onAddHighlight,
}) => {
  const [content, setContent] = useState<string>('');
  const [supCount, setSupCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1); // State for zoom level

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => prev + 0.1);
  const handleZoomOut = () => setZoom(prev => Math.max(0.2, prev - 0.1)); // Set minimum zoom to 20%

  useEffect(() => {
    const loadHtmlContent = async () => {
      setIsLoading(true);
      setError(null);
      setSupCount(0);

      try {
        const filename = String(currentPage).padStart(3, '0');
        const response = await fetch(`/html_output/complex_tables_all_${filename}.html`);

        if (!response.ok) {
          throw new Error(`Failed to load page ${currentPage}`);
        }

        let htmlContent = await response.text();
        const matches = htmlContent.match(/<sup>/g) || [];
        setSupCount(matches.length);

        htmlContent = htmlContent.replace(
          /<sup>(.*?)<\/sup>/g,
          '<sup style="background-color: #22c55e; color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.7em;">$1</sup>'
        );
        htmlContent = htmlContent.replace(
          /<head>(.*?)<\/head>/s,
          `<head>$1<style>body { font-size: 20px; }</style></head>`
        );

        setContent(htmlContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setContent(`<h2>Error loading page ${currentPage}</h2><p>${err instanceof Error ? err.message : ''}</p>`);
      } finally {
        setIsLoading(false);
      }
    };

    loadHtmlContent();
  }, [currentPage]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const handleMouseUp = () => {
      if (!isHighlightMode) return;

      const selection = iframe.contentWindow?.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const rects = Array.from(range.getClientRects());

      rects.forEach(rect => {
        if (rect.width > 0 && rect.height > 0) {
          onAddHighlight({
            pageNumber: currentPage,
            x: rect.left + (iframe.contentWindow?.scrollX || 0),
            y: rect.top + (iframe.contentWindow?.scrollY || 0),
            width: rect.width,
            height: rect.height,
          });
        }
      });

      selection.removeAllRanges();
    };

    const doc = iframe.contentWindow.document;
    doc.addEventListener('mouseup', handleMouseUp);
    return () => {
      doc.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isHighlightMode, currentPage, onAddHighlight]);

  const pageHighlights = highlights.filter(h => h.pageNumber === currentPage);

  return (
    <div className="flex flex-col h-full bg-white">
      <HtmlNav
        currentPage={currentPage}
        supCount={supCount}
        zoomLevel={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error Loading Content</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        ) : (
          <div
            className="relative transition-transform"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              // The container needs to have a defined size for scaling to work within the scrollable area
              width: '100%',
              height: '100%',
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={content}
              title={`HTML Output - Page ${currentPage}`}
              className="w-full h-full border-0 rounded-lg shadow-sm bg-white"
            />
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {pageHighlights.map(highlight => (
                <div
                  key={highlight.id}
                  style={{
                    position: 'absolute',
                    top: `${highlight.y}px`,
                    left: `${highlight.x}px`,
                    width: `${highlight.width}px`,
                    height: `${highlight.height}px`,
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};