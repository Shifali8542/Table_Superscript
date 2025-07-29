import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PdfViewer } from './components/PdfViewer';
import { HtmlViewer } from './components/HtmlViewer';
import { useHighlights } from './hooks/useHighlights';

// Add these two lines
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: PDF Viewer */}
        <div className="w-1/2 border-r border-gray-300">
          <PdfViewer
            currentPage={currentPage}
            onLoadSuccess={handlePdfLoadSuccess}
          />
        </div>

        {/* Right Side: HTML Viewer */}
        <div className="w-1/2">
          <HtmlViewer
            currentPage={currentPage}
            highlights={highlights}
            onAddHighlight={addHighlight}
            isHighlightMode={isHighlightMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;