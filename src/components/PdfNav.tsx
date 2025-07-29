import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      {/* Left: Title */}
      <div className="flex-1">
        <h2 className="font-semibold text-gray-800">PDF Document</h2>
      </div>
      
      {/* Center: Zoom Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="p-2 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>

        <span className="text-sm font-medium text-gray-600 px-2 w-16 text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={scale >= 3.0}
          className="p-2 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Right: Reset Button */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-white hover:bg-gray-100 shadow-sm border border-gray-200 transition-colors"
          title="Reset View"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};