import React from 'react';
import { FileText, ZoomIn, ZoomOut } from 'lucide-react';

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
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      {/* Left: Title */}
      <div className="flex items-center space-x-2">
        <FileText size={18} className="text-gray-600" />
        <h2 className="font-semibold text-gray-800">HTML Output</h2>
      </div>

      {/* Center: Zoom Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onZoomOut}
          className="p-1 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <span className="text-sm font-semibold text-gray-700 w-12 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-1 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
      </div>

      {/* Right: Info */}
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <span className="font-medium">
          Superscripts: <span className="text-green-600 font-bold">{supCount}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span>Page {currentPage}</span>
      </div>
    </div>
  );
};