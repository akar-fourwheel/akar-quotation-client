import React, { useMemo,useState } from "react";

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
  {console.log(data)}
  const [selectedRecord, setSelectedRecord] = useState(null);

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
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => onFilterChange()}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-2.5 rounded-md transition-all text-sm font-medium w-auto"
            >
              <svg
                className="w-4 h-4 block"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
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

      <div className="hidden md:block overflow-x-auto">
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

      {/* Mobile View */}
      <div className="space-y-3 md:hidden">
        {data.length > 0 ? (
          data.map((record, index) => (
            <div
              key={record.id || index}
              className="bg-white rounded-lg shadow-sm p-3 space-y-1 text-sm"
            >
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-black text-base truncate">
                    {record.cx_name || '-'}</span>
                  <span className="text-xs">Phone: {record.cx_phone}</span>
                </div>
                <div className="flex flex-col items-end justify-between space-y-2">
                  <div>{getStatusBadge(record.status)}</div> 
                  <div className="flex items-center text-gray-600 text-xs gap-1">
                  <span className="text-gray-600 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-gray-500 inline mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                      <span className="font-medium"> {record.sales_person || '-'} </span>
                  </span>
                  </div>
                </div>
              </div>

              <div className="text-gray-600 text-xs">
                <span className="font-medium text-gray-800">{record.model || '-'}</span>{' '}
              </div>

              <div className="flex justify-end -mt-1">
                <button
                  onClick={() => setSelectedRecord(record)}
                  className="px-3 py-1 border border-gray-200 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            <i className="fas fa-info-circle mr-1 text-blue-500"></i>No records found matching your criteria
          </div>
        )}
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

      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/30 bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-5 space-y-3 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold">Details</h2>
            <div className="space-y-1 text-sm text-gray-700">
              <div><strong>Customer:</strong> {selectedRecord.cx_name || '-'}</div>
              <div><strong>Phone:</strong> {selectedRecord.cx_phone || '-'}</div>
              <div><strong>Model:</strong> {selectedRecord.model || '-'}</div>
              <div><strong>Sales Person:</strong> {selectedRecord.sales_person || '-'}</div>
              <div><strong>Status:</strong> {selectedRecord.status || '-'}</div>
              <div><strong>Duration:</strong> {selectedRecord.in_time ? `${Math.abs(getDuration(selectedRecord.in_time, selectedRecord.out_time)).toFixed(1)} Hr` : '-'}</div>
              <div><strong>Out KM:</strong> {selectedRecord.out_km ?? '-'}</div>
              <div><strong>In KM:</strong> {selectedRecord.in_km ?? '-'}</div>
              <div><strong>Total KM:</strong> {(selectedRecord.in_km != null && selectedRecord.out_km != null) ? selectedRecord.in_km - selectedRecord.out_km : '-'}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};



export default AllRecords;
