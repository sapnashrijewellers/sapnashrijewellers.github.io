"tsx"
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Product pagination"
      className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-8 py-4 sm:py-6 px-2"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="btn ssj-btn-outline disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        aria-label="Previous page"
      >
        ← <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Mobile: Page Info Only */}
      <div className="flex sm:hidden items-center justify-center px-2 py-1 text-xs text-muted-foreground whitespace-nowrap">
        {currentPage} of {totalPages}
      </div>

      {/* Tablet & Desktop: Page Numbers */}
      <div className="hidden sm:flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (totalPages <= 10) return true;
            if (page === 1 || page === totalPages) return true;
            return Math.abs(page - currentPage) <= 1;
          })
          .reduce((acc: number[], page, idx, arr) => {
            if (idx > 0 && arr[idx - 1] && page - arr[idx - 1] > 1) {
              acc.push(-1); // Ellipsis placeholder
            }
            acc.push(page);
            return acc;
          }, [])
          .map((page, idx) =>
            page === -1 ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 py-1 text-muted-foreground"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg border transition-colors ${
                  currentPage === page ? "ssj-btn-outline" : "ssj-btn"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="btn ssj-btn-outline disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span> →
      </button>
    </nav>
  );
}