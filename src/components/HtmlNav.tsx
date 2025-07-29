import React from 'react';
import { FileText } from 'lucide-react';

interface HtmlNavProps {
  currentPage: number;
  supCount: number;
}

export const HtmlNav: React.FC<HtmlNavProps> = ({ currentPage, supCount }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <FileText size={18} className="text-gray-600" />
        <h2 className="font-semibold text-gray-800">HTML Output</h2>
      </div>
      
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