import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Display only a window of pages
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      <button
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          } ${page === '...' ? 'cursor-default' : ''}`}
          onClick={() => (page !== '...' ? onPageChange(page as number) : null)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      
      <button
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;