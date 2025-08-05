import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit3, Undo, Trash2, Filter } from 'lucide-react';
import type { StyleCounts } from '../types';
import './Nav.scss'; // Import the SCSS file

interface NavbarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onHighlightModeToggle: () => void;
  isHighlightMode: boolean;
  onUndo: () => void;
  onDeleteAll: () => void;
  canUndo: boolean;
  activeFilter: string | null;
  onFilterChange: (filter: string) => void;
  styleCounts: StyleCounts;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onHighlightModeToggle,
  isHighlightMode,
  onUndo,
  onDeleteAll,
  canUndo,
  activeFilter,
  onFilterChange,
  styleCounts,
}) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

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
      const newPage = currentPage - 1;
      onPageChange(newPage);
      setPageInput(newPage.toString());
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      onPageChange(newPage);
      setPageInput(newPage.toString());
    }
  };

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const FilterButton: React.FC<{ name: string; filterKey: keyof StyleCounts }> = ({ name, filterKey }) => (
    <button
      onClick={() => onFilterChange(filterKey)}
      className={`filter-button ${activeFilter === filterKey ? 'filter-button--active' : ''}`}
    >
      <span>{name}</span>
      <span className="filter-count">
        {styleCounts[filterKey]}
      </span>
    </button>
  );

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left: Title */}
        <div className="navbar-left">
          <h1 className="navbar-title">PDF vs HTML</h1>
        </div>

        {/* Center: Page Navigation */}
        <div className="navbar-center">
          <button
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className="nav-button"
          >
            <ChevronLeft size={20} />
          </button>

          <form onSubmit={handlePageInputSubmit} className="page-form">
            <span className="page-label">Page</span>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              min={1}
              max={totalPages}
              className="page-input"
            />
            <span className="page-label">of {totalPages}</span>
          </form>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="nav-button"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Right: Tools */}
        <div className="navbar-right">
          {/* Highlighting Tools */}
          <button
            onClick={onHighlightModeToggle}
            className={`tool-button tool-button--highlight ${isHighlightMode ? 'active' : ''}`}
            title="Toggle Highlight Mode"
          >
            <Edit3 size={20} />
          </button>

          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="tool-button"
            title="Undo Last Highlight"
          >
            <Undo size={20} />
          </button>

          <button
            onClick={onDeleteAll}
            className="tool-button tool-button--delete"
            title="Delete All Highlights"
          >
            <Trash2 size={20} />
          </button>

          {/* Filter Tools */}
          <div className="filter-menu-container">
            <button
              onClick={() => setIsFilterMenuOpen(prev => !prev)}
              className={`tool-button tool-button--filter ${isFilterMenuOpen || activeFilter ? 'active' : ''}`}
              title="Toggle Style Filters"
            >
              <Filter size={20} />
            </button>
            {isFilterMenuOpen && (
              <div className="filter-menu">
                <FilterButton name="Bold" filterKey="bold" />
                <FilterButton name="Italic" filterKey="italic" />
                <FilterButton name="Bold-Italic" filterKey="boldItalic" />
                <FilterButton name="Superscript" filterKey="superscript" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
