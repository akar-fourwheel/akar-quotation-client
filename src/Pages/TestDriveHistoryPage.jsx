import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AllRecords from "../Components/testDriveComponents/AllRecords";

const TestDriveHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
});

  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('model');
  const [showWorkshopRecords, setShowWorkshopRecords] = useState(false);
  const [showBreakdownRecords, setShowBreakdownRecords] = useState(false);

  const fetchAllRecords = useCallback((
    page = pagination.currentPage,
    limit = pagination.itemsPerPage
  ) => {
    setRecordsLoading(true);
    const queryParams = new URLSearchParams({
      page,
      limit,
      status: selectedStatus,
      searchBy,
      searchTerm,
      workshop: showWorkshopRecords ? 'true' : 'false',
      breakdown: showBreakdownRecords ? 'true' : 'false'
    }).toString();

    axios.get(`/test-drive/records?${queryParams}`)
      .then(response => {
        setRecords(response.data.data || []);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          itemsPerPage: response.data.pagination.itemsPerPage,
          totalItems: response.data.pagination.totalItems,
          totalPages: response.data.pagination.totalPages,
          hasNextPage: response.data.pagination.hasNextPage,
          hasPreviousPage: response.data.pagination.hasPreviousPage
        });
        setRecordsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching records:', error);
        setError(error.message);
        setRecordsLoading(false);
      });
  }, [pagination.currentPage, pagination.recordsPerPage, selectedStatus, searchBy, searchTerm, showWorkshopRecords, showBreakdownRecords]);

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAllRecords(newPage, pagination.recordsPerPage);
  };

  const handleRecordsPerPageChange = (newPerPage) => {
    fetchAllRecords(1, newPerPage);
  };

  const handleFilterChange = () => {
    fetchAllRecords(1, pagination.recordsPerPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="bg-gray-200 text-gray-800 rounded-t-lg px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <i className="fas fa-history"></i>
              All Test Drive Histories
            </h3>
            <button
              onClick={() => fetchAllRecords()}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all"
              title="Refresh all records"
            >
              <i className="fas fa-sync-alt mr-1"></i> Refresh
            </button>
          </div>
          <div className="p-6">
            {recordsLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <AllRecords
                data={records}
                pagination={pagination}
                onPageChange={handlePageChange}
                onRecordsPerPageChange={handleRecordsPerPageChange}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                showWorkshopRecords={showWorkshopRecords}
                setShowWorkshopRecords={setShowWorkshopRecords}
                showBreakdownRecords={showBreakdownRecords}
                setShowBreakdownRecords={setShowBreakdownRecords}
                onFilterChange={handleFilterChange}
              />
            )}
            {error && (
              <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded shadow">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDriveHistoryPage;
