import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import './PdfNav.scss'; // Import the new SCSS file

interface PdfNavProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onReset: () => void;
}

export const PdfNav: React.FC<PdfNavProps> = ({ scale, onScaleChange, onReset }) => {
  const handleZoomIn = () => {
    onScaleChange(Math.min(scale + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    onScaleChange(Math.max(scale - 0.25, 0.5));
  };

  return (
    <div className="pdf-nav">
      {/* Left: Title */}
      <div className="pdf-nav__left">
        <h2 className="pdf-nav__title">PDF Document</h2>
      </div>
      
      {/* Center: Zoom Controls */}
      <div className="pdf-nav__center">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="pdf-nav__button"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>

        <span className="pdf-nav__scale-display">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={scale >= 3.0}
          className="pdf-nav__button"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Right: Reset Button */}
      <div className="pdf-nav__right">
        <button
          onClick={onReset}
          className="pdf-nav__button"
          title="Reset View"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};
