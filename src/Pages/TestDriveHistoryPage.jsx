import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AllRecords from "../Components/testDriveComponents/AllRecords";

const TestDriveHistoryPage = () => {
  const [records, setRecords] = useState(null);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllRecords = useCallback(() => {
    setRecordsLoading(true);
    axios.get("/test-drive/records")
      .then((response) => {
        setRecords(response.data || []);
        setRecordsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching records:', error);
        setError(error.message);
        setRecordsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAllRecords();
  }, [fetchAllRecords]);

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
              onClick={fetchAllRecords}
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
              <AllRecords data={records?.data?.filter(record => record.in_km !== 0) || []} />
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