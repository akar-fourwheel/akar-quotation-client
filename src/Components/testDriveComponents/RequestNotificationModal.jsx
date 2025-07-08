import React from "react";

const RequestNotificationModal = ({
  show,
  onClose,
  pendingRequests = [],
  onAccept,
  onReject,
  actionStates = {},
  setActionStates,
  activeTab,
  setActiveTab
}) => {
  if (!show) return null;

  const filteredRequests = pendingRequests.filter(req => {
    if (activeTab === 'pending') {
      return req.status == "REQUESTED" || !req.status;
    } else {
      return req.status == "PENDING";
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold mb-2">Test Drive Requests</h3>
          <p className="text-blue-100">Manage test drive applications</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending ({pendingRequests.filter(req => req.status == "REQUESTED" || !req.status).length})
              </span>
            </button>
            <button
              className={`flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'accepted'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('accepted')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accepted ({pendingRequests.filter(req => req.status == "PENDING").length})
                <small className="text-gray-600 text-xs">Vehicle Not Allocated</small>
              </span>
            </button>
          </div>
        </div>  

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {activeTab === 'pending' ? (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === 'pending' ? 'No Pending Requests' : 'No Accepted Requests'}
              </h4>
              <p className="text-gray-500">
                {activeTab === 'pending' 
                  ? 'All test drive requests have been processed.' 
                  : 'No requests have been accepted yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req, index) => (
                <div 
                  key={req.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Request Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          #{req.id}
                        </span>
                        <span className="font-semibold text-gray-900">{req.model}</span>
                        {req.status === 'accepted' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ Accepted
                          </span>
                        )}
                      </div>
                      {req.sales_person && (
                        <p className="text-sm text-gray-600 mt-1">Sales Executive: {req.sales_person}</p>
                      )}
                      {req.CX_NAME && (
                        <p className="text-sm text-gray-600 mt-1">Customer: {req.CX_NAME}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {req.date && new Date(req.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Controls - Only show for pending requests */}
                  {activeTab === 'pending' && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Action
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={actionStates[req.id]?.action || ''}
                            onChange={e => {
                              setActionStates(prev => ({
                                ...prev,
                                [req.id]: { ...prev[req.id], action: e.target.value }
                              }));
                            }}
                          >
                            <option value="">Select Action</option>
                            <option value="accept">✅ Accept Request</option>
                            <option value="reject">❌ Reject Request</option>
                          </select>
                        </div>
                      </div>

                      {/* Rejection Remark */}
                      {actionStates[req.id]?.action === 'reject' && (
                        <div className="animate-in slide-in-from-top duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rejection Reason
                          </label>
                          <textarea
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Please provide a reason for rejection..."
                            rows="3"
                            value={actionStates[req.id]?.remark || ''}
                            onChange={e => {
                              setActionStates(prev => ({
                                ...prev,
                                [req.id]: { ...prev[req.id], remark: e.target.value }
                              }));
                            }}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button
                          className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                            actionStates[req.id]?.action === 'accept'
                              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={actionStates[req.id]?.action !== 'accept'}
                          onClick={() => onAccept(req.id)}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept
                          </span>
                        </button>
                        <button
                          className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                            actionStates[req.id]?.action === 'reject' && actionStates[req.id]?.remark
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={actionStates[req.id]?.action !== 'reject' || !actionStates[req.id]?.remark}
                          onClick={() => onReject(req.id, actionStates[req.id]?.remark)}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Accepted Request Info */}
                  {activeTab === 'accepted' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Request Accepted</span>
                      </div>
                      {req.acceptedDate && (
                        <p className="text-sm text-green-700 mt-1">
                          Accepted on: {new Date(req.acceptedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredRequests.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-gray-600">
                {filteredRequests.length} {activeTab} request{filteredRequests.length !== 1 ? 's' : ''}
              </p>
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium text-sm transition-all duration-200 transform hover:-translate-y-0.5"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestNotificationModal; 