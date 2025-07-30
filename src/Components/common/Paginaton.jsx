import React from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages && i <= 5; i++) {
    pages.push(i);
  }

  return (
    <>
        {/* desktop size */}
        <div className="hidden items-center justify-center space-x-3 mt-4 mb-4 text-sm sm:flex">
            <button
                onClick={() => {
                    if(currentPage === 1) return;
                    onPageChange(currentPage - 1);
                }}
                disabled={currentPage === 1}
                className={`flex items-center space-x-1 ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-black cursor-pointer"
                }`}
            >
                <span><ChevronLeft size={16} /></span>
                <span>Previous</span>
            </button>

            {pages.map((page) => (
                <button
                key={page}
                    onClick={() => {
                        if(currentPage === page) return;
                        onPageChange(page);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition cursor-pointer ${
                    currentPage === page
                    ? "border border-gray-700 text-black shadow"
                    : "text-black hover:bg-gray-100"
                }`}
                >
                {page}
                </button>
            ))}

            <button
                onClick={() => {
                    if(currentPage === totalPages) return;
                    onPageChange(currentPage + 1);
                }}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-1 ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-black cursor-pointer"
                }`}
            >
                <span>Next</span>
                <span><ChevronRight size={16} /></span>
            </button>
        </div>

        {/* mobile size */}
        <div className="flex items-center justify-center space-x-3 mt-4 mb-4 text-sm sm:hidden">
            <button
                onClick={() => {
                    if(currentPage === 1) return;
                    onPageChange(currentPage - 1);
                }}
                disabled={currentPage === 1}
                className={`border rounded-full p-1 w-8 h-8 flex items-center justify-center ${
                currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-black hover:bg-gray-100 cursor-pointer"
                }`}
            >
                <ChevronLeft size={12} />
            </button>

            <span className="text-gray-600">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-bold">{totalPages}</span>
            </span>

            <button
                onClick={() => {
                    if(currentPage === totalPages) return;
                    onPageChange(currentPage + 1);
                }}
                disabled={currentPage === totalPages}
                className={`border rounded-full p-1 w-8 h-8 flex items-center justify-center ${
                currentPage === totalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-black hover:bg-gray-100 cursor-pointer"
                }`}
            >
                <ChevronRight size={12} />
            </button>
        </div>
    </>
  );
};

export default Pagination;