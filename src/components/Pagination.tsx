import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-amber-500/15">
      {/* Information text */}
      <div className="text-xs text-stone-400 font-medium">
        Showing <span className="font-semibold text-white font-mono">{startItem}–{endItem}</span> of{' '}
        <span className="font-semibold text-white font-mono">{totalItems}</span> applications (18 per page)
      </div>

      {/* Page Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }
          }}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel text-stone-300 hover:text-amber-300 hover:border-amber-400 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => {
              onPageChange(page);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            className={`w-8 h-8 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center ${
              currentPage === page
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                : 'glass-panel text-stone-300 hover:text-amber-300 hover:border-amber-500/30'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }
          }}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel text-stone-300 hover:text-amber-300 hover:border-amber-400 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
