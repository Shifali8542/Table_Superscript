import React from 'react';
import { Navbar } from './components/Navbar';
import { PdfViewer } from './components/PdfViewer';
import { HtmlViewer } from './components/HtmlViewer';
import { useHighlights } from './hooks/useHighlights';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import type { StyleCounts } from './types';
import './components/Nav.scss';

function App() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [styleCounts, setStyleCounts] = React.useState<StyleCounts>({
    bold: 0,
    italic: 0,
    boldItalic: 0,
    superscript: 0,
  });

  const {
    highlights,
    isHighlightMode,
    addHighlight,
    removeLastHighlight,
    clearAllHighlights,
    toggleHighlightMode,
    canUndo
  } = useHighlights();

  const handlePdfLoadSuccess = (numPages: number) => {
    setTotalPages(numPages);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(prev => (prev === filter ? null : filter));
  };

  const handleStyleCountsChange = (counts: StyleCounts) => {
    setStyleCounts(counts);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onHighlightModeToggle={toggleHighlightMode}
        isHighlightMode={isHighlightMode}
        onUndo={removeLastHighlight}
        onDeleteAll={clearAllHighlights}
        canUndo={canUndo}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        styleCounts={styleCounts}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Left Side: PDF Viewer */}
        <div className="pdf-viewer-container">
          <PdfViewer
            currentPage={currentPage}
            onLoadSuccess={handlePdfLoadSuccess}
          />
        </div>

        {/* Right Side: HTML Viewer */}
        <div className="html-viewer-container">
          <HtmlViewer
            currentPage={currentPage}
            highlights={highlights}
            onAddHighlight={addHighlight}
            isHighlightMode={isHighlightMode}
            activeFilter={activeFilter}
            onStyleCountsChange={handleStyleCountsChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
