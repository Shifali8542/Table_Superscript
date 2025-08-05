import React from 'react';
import { FileText, ZoomIn, ZoomOut } from 'lucide-react';
import './HtmlNav.scss'; // Import the new SCSS file

interface HtmlNavProps {
  currentPage: number;
  supCount: number;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const HtmlNav: React.FC<HtmlNavProps> = ({
  currentPage,
  supCount,
  zoomLevel,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="html-nav">
      {/* Left: Title */}
      <div className="html-nav__left">
        <FileText size={18} className="html-nav__icon" />
        <h2 className="html-nav__title">HTML Output</h2>
      </div>

      {/* Center: Zoom Controls */}
      <div className="html-nav__center">
        <button
          onClick={onZoomOut}
          className="html-nav__button"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <span className="html-nav__zoom-level">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="html-nav__button"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
      </div>

      {/* Right: Info */}
      <div className="html-nav__right">
        <span className="html-nav__info-item">
          Superscripts: <span className="html-nav__info-count">{supCount}</span>
        </span>
        <span className="html-nav__separator">|</span>
        <span>Page {currentPage}</span>
      </div>
    </div>
  );
};
