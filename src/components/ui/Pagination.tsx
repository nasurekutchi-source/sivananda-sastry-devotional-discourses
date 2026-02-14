'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btnBase = `px-3 py-2 text-sm rounded border transition-all duration-200 font-body`;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} border-border-medium text-text-secondary
                   hover:bg-accent-light hover:text-accent-primary hover:-translate-y-0.5
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
      >
        Prev
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-text-tertiary">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} w-10 h-10 ${
              page === currentPage
                ? 'bg-accent-primary text-white border-accent-primary font-semibold'
                : 'border-border-medium text-text-secondary hover:bg-accent-light hover:text-accent-primary'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} border-border-medium text-text-secondary
                   hover:bg-accent-light hover:text-accent-primary hover:-translate-y-0.5
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
      >
        Next
      </button>
    </div>
  );
}
