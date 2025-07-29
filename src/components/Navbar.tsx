import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit3, Undo, Trash2 } from 'lucide-react';

interface NavbarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onHighlightModeToggle: () => void;
  isHighlightMode: boolean;
  onUndo: () => void;
  onDeleteAll: () => void;
  canUndo: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onHighlightModeToggle,
  isHighlightMode,
  onUndo,
  onDeleteAll,
  canUndo
}) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setPageInput((currentPage - 1).toString());
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setPageInput((currentPage + 1).toString());
    }
  };

  React.useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-300">PDF vs HTML</h1>
        </div>

        {/* Center: Page Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <form onSubmit={handlePageInputSubmit} className="flex items-center space-x-2">
            <span className="text-sm">Page</span>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              min={1}
              max={totalPages}
              className="w-16 px-2 py-1 text-center bg-slate-700 rounded border border-slate-600 focus:border-blue-400 focus:outline-none"
            />
            <span className="text-sm">of {totalPages}</span>
          </form>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Right: Highlighting Tools */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onHighlightModeToggle}
            className={`p-2 rounded-lg transition-colors ${
              isHighlightMode 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title="Toggle Highlight Mode"
          >
            <Edit3 size={20} />
          </button>

          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo Last Highlight"
          >
            <Undo size={20} />
          </button>

          <button
            onClick={onDeleteAll}
            className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 transition-colors"
            title="Delete All Highlights"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};