import React, { useMemo } from "react";

const AllRecords = ({
  data,
  pagination,
  onPageChange,
  onRecordsPerPageChange,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
  searchBy,
  setSearchBy,
  showWorkshopRecords,
  setShowWorkshopRecords,
  showBreakdownRecords,
  setShowBreakdownRecords,
  onFilterChange
}) => {
  const getDate = (ts) => {
    if (!ts) return '-';
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

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="REQUESTED">Requested</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={showWorkshopRecords ? 'workshop' : showBreakdownRecords ? 'breakdown' : 'all'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'workshop') {
                  setShowWorkshopRecords(true);
                  setShowBreakdownRecords(false);
                } else if (value === 'breakdown') {
                  setShowBreakdownRecords(true);
                  setShowWorkshopRecords(false);
                } else {
                  setShowWorkshopRecords(false);
                  setShowBreakdownRecords(false);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="workshop">Workshop</option>
              <option value="breakdown">Breakdown</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Search by:</label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="model">Model</option>
              <option value="sales_person">Sales Person</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder={`Enter ${searchBy === 'model' ? 'model name' : 'sales person name'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onFilterChange();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => onFilterChange()}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-md transition-all text-sm font-medium min-w-[80px]"
            >
              Search
            </button>
            {(searchTerm || selectedStatus !== 'ALL' || showWorkshopRecords || showBreakdownRecords) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('ALL');
                  setShowWorkshopRecords(false);
                  setShowBreakdownRecords(false);
                  onFilterChange();
                }}
                className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4 py-2 rounded-md transition-all text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center pt-2 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {data.length} of {pagination.totalRecords} records
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Show:</label>
            <select
              value={pagination.recordsPerPage}
              onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[5, 10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
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
          <tbody>
            {data.length > 0 ? data.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50">
                <td className="px-4 py-2">{getDate(record.out_time)}</td>
                <td className="px-4 py-2">{record.model || '-'}</td>
                <td className="px-4 py-2">{record.cx_name || '-'}</td>
                <td className="px-4 py-2">{record.cx_phone || '-'}</td>
                <td className="px-4 py-2">{record.sales_person || '-'}</td>
                <td className="px-4 py-2">{getStatusBadge(record.status)}</td>
                <td className="px-4 py-2">{record.in_time ? `${Math.abs(getDuration(record.in_time, record.out_time)).toFixed(1)} Hr` : '-'}</td>
                <td className="px-4 py-2">{record.out_km ?? '-'}</td>
                <td className="px-4 py-2">{record.in_km ?? '-'}</td>
                <td className="px-4 py-2">{(record.in_km != null && record.out_km != null) ? record.in_km - record.out_km : '-'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  <i className="fas fa-info-circle mr-2 text-blue-500"></i>No records found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
          <span className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${pagination.currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }`}
            >
              First
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${pagination.currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }`}
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${pagination.currentPage === pagination.totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }`}
            >
              Next
            </button>
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${pagination.currentPage === pagination.totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }`}
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
