import React, { useState, useEffect, useRef } from 'react';
import { HtmlNav } from './HtmlNav';
import type { Highlight, StyleCounts } from '../types';
import './HtmlViewer.scss'; // Import the new SCSS file

interface HtmlViewerProps {
  currentPage: number;
  highlights: Highlight[];
  isHighlightMode: boolean;
  onAddHighlight: (highlight: Omit<Highlight, 'id'>) => void;
  activeFilter: string | null;
  onStyleCountsChange: (counts: StyleCounts) => void;
}

export const HtmlViewer: React.FC<HtmlViewerProps> = ({
  currentPage,
  highlights, 
  isHighlightMode,
  onAddHighlight,
  activeFilter,
  onStyleCountsChange,
}) => {
  const [content, setContent] = useState<string>('');
  const [supCount, setSupCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleZoomIn = () => setZoom(prev => prev + 0.1);
  const handleZoomOut = () => setZoom(prev => Math.max(0.2, prev - 0.1));
 
  useEffect(() => {
    const loadHtmlContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filename = String(currentPage).padStart(3, '0');
        const response = await fetch(`html_output//complex_tables_all_${filename}.html`);
        if (!response.ok) throw new Error(`Failed to load page ${currentPage}`);
        let htmlContent = await response.text();
        htmlContent = htmlContent.replace(
          /<head>(.*?)<\/head>/s,
          `<head>$1<style>body { font-size: 20px; }</style></head>`
        );
        setContent(htmlContent);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        setContent(`<h2>Error loading page ${currentPage}</h2><p>${errorMsg}</p>`);
      } finally {
        setIsLoading(false);
      }
    };
    loadHtmlContent();
  }, [currentPage]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const iDoc = iframe.contentWindow?.document;
      if (!iDoc) return;

      const allElements = iDoc.body.getElementsByTagName('*');
      const counts: StyleCounts = { bold: 0, italic: 0, boldItalic: 0, superscript: 0 };
      
      Array.from(allElements).forEach(el => {
        const style = window.getComputedStyle(el);
        const isBold = style.fontWeight === '700' || style.fontWeight === 'bold';
        const isItalic = style.fontStyle === 'italic';

        el.removeAttribute('data-style-bold');
        el.removeAttribute('data-style-italic');
        el.removeAttribute('data-style-bold-italic');
        
        if (isBold && isItalic) {
          counts.boldItalic++;
          el.setAttribute('data-style-bold-italic', 'true');
        } else if (isBold) {
          counts.bold++;
          el.setAttribute('data-style-bold', 'true');
        } else if (isItalic) {
          counts.italic++;
          el.setAttribute('data-style-italic', 'true');
        }
      });
      
      const supElements = iDoc.getElementsByTagName('sup');
      counts.superscript = supElements.length;
      Array.from(supElements).forEach(el => el.setAttribute('data-style-superscript', 'true'));
      
      setSupCount(counts.superscript);
      onStyleCountsChange(counts);
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);

  }, [content, onStyleCountsChange]);
  
  useEffect(() => {
    const iDoc = iframeRef.current?.contentWindow?.document;
    if (!iDoc) return;

    let styleElement = iDoc.getElementById('filter-style');
    if (!styleElement) {
      styleElement = iDoc.createElement('style');
      styleElement.id = 'filter-style';
      iDoc.head.appendChild(styleElement);
    }
    
    const styleRule = "text-decoration: underline; text-decoration-color: lightblue; text-decoration-thickness: 3px;";
    let cssText = `
      sup { background-color: #22c55e; color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.7em; }
    `;

    if (activeFilter) {
      const kebabCaseFilter = activeFilter.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
      cssText += `[data-style-${kebabCaseFilter}] { ${styleRule} }`;
    }
    
    styleElement.textContent = cssText;

  }, [activeFilter, content]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const handleMouseUp = () => {
      if (!isHighlightMode) return;
      const selection = iframe.contentWindow?.getSelection();
      if (!selection || selection.isCollapsed) return;
      const range = selection.getRangeAt(0);
      Array.from(range.getClientRects()).forEach(rect => {
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
    return () => doc.removeEventListener('mouseup', handleMouseUp);
  }, [isHighlightMode, currentPage, onAddHighlight]);

  const pageHighlights = highlights.filter(h => h.pageNumber === currentPage);

  return (
    <div className="html-viewer">
      <HtmlNav
        currentPage={currentPage}
        supCount={supCount}
        zoomLevel={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <div className="html-viewer__content-area">
        {isLoading ? (
          <div className="html-viewer__loader-container">
            <div className="html-viewer__spinner"></div>
          </div>
        ) : error ? (
          <div className="html-viewer__error-box">
            <h3 className="html-viewer__error-title">Error Loading Content</h3>
            <p className="html-viewer__error-message">{error}</p>
          </div>
        ) : (
          <div className="html-viewer__iframe-wrapper" style={{ transform: `scale(${zoom})` }}>
            <iframe
              ref={iframeRef}
              srcDoc={content}
              title={`HTML Output - Page ${currentPage}`}
              className="html-viewer__iframe"
            />
            <div className="html-viewer__highlight-overlay">
              {pageHighlights.map(highlight => (
                <div 
                  key={highlight.id} 
                  className="html-viewer__highlight"
                  style={{ 
                    top: `${highlight.y}px`, 
                    left: `${highlight.x}px`, 
                    width: `${highlight.width}px`, 
                    height: `${highlight.height}px`
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
