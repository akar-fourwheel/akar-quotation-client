import { useState, useMemo } from "react";

const AllRecords = ({ data }) => {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('model'); // 'model' or 'sales_person'
  const [showWorkshopRecords, setShowWorkshopRecords] = useState(false);
  const [showBreakdownRecords, setShowBreakdownRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const getDate = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  
  const getDuration = (inTs, outTs) => {
    const inDateTime = new Date(inTs);
    const outDateTime = new Date(outTs);
    return (inDateTime - outDateTime) / 3600000;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'REQUESTED': 'bg-blue-100 text-blue-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    let filtered = data;

    if (showWorkshopRecords) {
      filtered = filtered.filter(record => 
        record.sales_person && record.sales_person.toLowerCase() === 'workshop'
      );
    }

    if (showBreakdownRecords) {
      filtered = filtered.filter(record => 
        record.sales_person && record.sales_person.toLowerCase() === 'breakdown'
      );
    }

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(record => {
        const searchValue = searchBy === 'model' ? record.model : record.sales_person;
        return searchValue && searchValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  }, [data, selectedStatus, searchTerm, searchBy, showWorkshopRecords, showBreakdownRecords]);

  const availableStatuses = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    const statuses = [...new Set(data.map(record => record.status))];
    return statuses.filter(status => status);
  }, [data]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredData.slice(startIndex, endIndex);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    
    if (filterType === 'status') {
      setSelectedStatus(value);
    } else if (filterType === 'search') {
      setSearchTerm(value);
    } else if (filterType === 'searchBy') {
      setSearchBy(value);
    } else if (filterType === 'workshop') {
      setShowWorkshopRecords(value);
      if (value) setShowBreakdownRecords(false);
    } else if (filterType === 'breakdown') {
      setShowBreakdownRecords(value);
      if (value) setShowWorkshopRecords(false);
    }
  };

  const clearAllFilters = () => {
    setSelectedStatus('ALL');
    setSearchTerm('');
    setSearchBy('model');
    setShowWorkshopRecords(false);
    setShowBreakdownRecords(false);
    setCurrentPage(1);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              {availableStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showWorkshopRecords}
                onChange={(e) => handleFilterChange('workshop', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Workshop Records</span>
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showBreakdownRecords}
                onChange={(e) => handleFilterChange('breakdown', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Breakdown Records</span>
            </label>
          </div>
        </div>

        {/* Second Row - Search */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="search-by" className="text-sm font-medium text-gray-700">
              Search by:
            </label>
            <select
              id="search-by"
              value={searchBy}
              onChange={(e) => handleFilterChange('searchBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="model">Model</option>
              <option value="sales_person">Sales Person</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Search by ${searchBy === 'model' ? 'model' : 'sales person'}...`}
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} records
              {filteredData.length !== (Array.isArray(data) ? data.length : 0) && (
                <span className="text-gray-400"> (filtered from {Array.isArray(data) ? data.length : 0} total)</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="records-per-page" className="text-sm text-gray-700">
                Show:
              </label>
              <select
                id="records-per-page"
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {(selectedStatus !== 'ALL' || searchTerm || showWorkshopRecords || showBreakdownRecords) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">Out Date/Time</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Sales Person</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Out KM</th>
              <th className="px-4 py-2">In KM</th>
              <th className="px-4 py-2">Total KM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={record.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{getDate(record.out_time)}</td>
                  <td className="px-4 py-2">{record.model || '-'}</td>
                  <td className="px-4 py-2">{record.cx_name || '-'}</td>
                  <td className="px-4 py-2">{record.cx_phone || '-'}</td>
                  <td className="px-4 py-2">{record.sales_person || '-'}</td>
                  <td className="px-4 py-2">{getStatusBadge(record.status)}</td>
                  <td className="px-4 py-2">
                    {record.in_time ? 
                      `${getDuration(record.in_time, record.out_time).toFixed(1)} Hr` : 
                      '-'
                    }
                  </td>
                  <td className="px-4 py-2">{record.out_km || '-'}</td>
                  <td className="px-4 py-2">{record.in_km || '-'}</td>
                  <td className="px-4 py-2">
                    {record.in_km ? record.in_km - record.out_km : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                  No records found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {generatePageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 text-sm rounded border ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRecords;