export interface Highlight {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

export interface ViewerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PdfViewerState {
  scale: number;
  numPages: number;
  isLoading: boolean;
}

export interface HtmlViewerState {
  content: string;
  isLoading: boolean;
  error: string | null;
}