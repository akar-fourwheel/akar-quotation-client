import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const pages = [];

  for (let i = 1; i <= totalPages && i <= 5; i++) {
    pages.push(i);
  }

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between items-center">
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex space-x-1">
                    <button
                        onClick={() => {
                            if(totalPages === 1){
                                return;
                            } else if(currentPage === 1){
                                return;
                            } else {
                                onPageChange(currentPage - 1);
                            }
                        }}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === 1
                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        1
                    </button>

                    {currentPage > 4 && <span className="px-2 py-2 text-gray-500">...</span>}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) =>
                            page === currentPage ||
                            page === currentPage - 1 ||
                            page === currentPage + 1
                        )
                        .map((page) => (
                            page !== 1 && page !== totalPages && (
                                <button
                                    key={page}
                                    onClick={() => {
                                        if(currentPage === page){
                                            return;
                                        } else {
                                            onPageChange(page);
                                        }
                                    }}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === page
                                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}

                    {currentPage < totalPages - 3 && <span className="px-2 py-2 text-gray-500">...</span>}

                    {totalPages > 1 && (
                        <button
                            onClick={() => {
                                if(totalPages === 1){
                                    return;
                                } else {
                                    onPageChange(totalPages);
                                }
                            }}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === totalPages
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {totalPages}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
  );
};

export default Pagination;