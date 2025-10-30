import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginatedTable = ({ currentPage, setCurrentPage, itemsPerPage, totalItems, children }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages === 0) {
    return (
      <div className="rounded-2xl overflow-visible shadow-sm relative border border-gray-100">
        {children}
        <div className="mt-4 text-gray-600 text-sm">No items</div>
      </div>
    );
  }

  // Generate an array for numbered buttons
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <>
      <div className="rounded-2xl overflow-visible shadow-sm relative border border-gray-100">
        {children}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-gray-600 text-sm gap-2 md:gap-0">
        {/* Showing range */}
        <span>
          Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong>-
          <strong>{Math.min(currentPage * itemsPerPage, totalItems)}</strong> of{" "}
          <strong>{totalItems}</strong> items
        </span>

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Numbered page buttons */}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded-md hover:bg-gray-100 ${
                currentPage === num ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PaginatedTable;
