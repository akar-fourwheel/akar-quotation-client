import React, { useState } from 'react';
import axios from 'axios';

const QuotationUpdateDashboard = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const [results, setResults] = useState({});

  const updateEndpoints = [
    { key: 'teams', label: 'Sales Teams', endpoint: 'update/update-teams' },
    { key: 'vehicles', label: 'Vehicle Data', endpoint: 'update/update-vehiches' },
    { key: 'accessories', label: 'Accessories', endpoint: 'update/update-accessories' },
    { key: 'hpn', label: 'HPN Data', endpoint: 'update/update-hpn' },
    { key: 'color', label: 'Color Data', endpoint: 'update/update-color' },
    { key: 'vas', label: 'VAS Data', endpoint: 'update/update-vas' },
    // { key: 'scheme', label: 'Scheme Data', endpoint: 'update/update-scheme' },
  ];

const handleApiCall = async (endpoint, key) => {
  setLoadingStates(prev => ({ ...prev, [key]: true }));
  setResults(prev => ({ ...prev, [key]: null }));

  try {
    const response = await axios.get(endpoint);
    const data = response.data;

    setResults(prev => ({
      ...prev,
      [key]: { success: true, message: data || 'Updated successfully' },
    }));
  } catch (error) {
    setResults(prev => ({
      ...prev,
      [key]: {
        success: false,
        message: error.response?.data || error.message || 'Something went wrong',
      },
    }));
  } finally {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }
};

const handleUpdateAll = async () => {
  setLoadingStates(prev => ({ ...prev, all: true }));
  setResults(prev => ({ ...prev, all: null }));

  try {
    const response = await axios.get('update/update-all-quot-data');
    const data = response.data;

    setResults(prev => ({
      ...prev,
      all: { success: true, message: data || 'All data updated successfully' },
    }));
  } catch (error) {
    setResults(prev => ({
      ...prev,
      all: {
        success: false,
        message: error.response?.data || error.message || 'Something went wrong',
      },
    }));
  } finally {
    setLoadingStates(prev => ({ ...prev, all: false }));
  }
};


  return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quotation Data Updates
          </h2>
          <p className="text-gray-600 mb-6">
            Update various components of quotation data
          </p>

          {/* Individual Update Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {updateEndpoints.map(({ key, label, endpoint }) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-800 mb-3 text-sm">{label}</h3>
                <button
                  onClick={() => handleApiCall(endpoint, key)}
                  disabled={loadingStates[key]}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded text-sm transition-colors duration-200 flex items-center justify-center"
                >
                  {loadingStates[key] && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
                  {loadingStates[key] ? 'Updating...' : 'Update'}
                </button>
                
                {results[key] && (
                  <div className={`mt-3 p-2 rounded text-xs flex items-start ${
                    results [key].success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <span className={`mr-2 font-bold ${results[key].success ? 'text-green-500' : 'text-red-500'}`}>
                      {results[key].success ? '✓' : '✗'}
                    </span>
                    <span className="leading-tight">
                      {typeof results[key].message === 'string'
                        ? results[key].message
                        : JSON.stringify(results[key].message)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Update All Button */}
          <div className="border-t pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bulk Update
              </h3>
              <button
                onClick={handleUpdateAll}
                disabled={loadingStates.all}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                {loadingStates.all && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                )}
                {loadingStates.all ? 'Updating All...' : 'Update All Data'}
              </button>
              
              {results.all && (
                <div className={`mt-4 p-3 rounded-lg inline-flex items-start max-w-md ${
                  results.all.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`mr-2 font-bold text-lg ${results.all.success ? 'text-green-500' : 'text-red-500'}`}>
                    {results.all.success ? '✓' : '✗'}
                  </span>
                  <span className="font-medium">{results.all.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Summary */}
          {Object.keys(results).length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Successful Updates
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(results)
                      .filter(([key, result]) => result && result.success)
                      .map(([key, result]) => (
                        <div key={key} className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
                          <span className="text-green-500 font-bold mr-2">✓</span>
                          {key === 'all' ? 'All Data' : updateEndpoints.find(e => e.key === key)?.label || key}
                        </div>
                      ))}
                    {Object.entries(results).filter(([key, result]) => result && result.success).length === 0 && (
                      <p className="text-gray-400 text-sm italic">No successful updates yet</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Failed Updates
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(results)
                      .filter(([key, result]) => result && !result.success)
                      .map(([key, result]) => (
                        <div key={key} className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded">
                          <span className="text-red-500 font-bold mr-2">✗</span>
                          {key === 'all' ? 'All Data' : updateEndpoints.find(e => e.key === key)?.label || key}
                        </div>
                      ))}
                    {Object.entries(results).filter(([key, result]) => result && !result.success).length === 0 && (
                      <p className="text-gray-400 text-sm italic">No failed updates</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default QuotationUpdateDashboard;