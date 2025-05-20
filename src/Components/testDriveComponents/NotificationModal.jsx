// NotificationModal.jsx
import React from "react";

const NotificationModal = ({
  show,
  onClose,
  pendingRequests = [],
  onBookTestDrive,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-bell text-blue-600"></i>
            Pending Test Drive Requests
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {pendingRequests && pendingRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingRequests.map((request, index) => (
              <div
                key={index}
                className="py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {request.model}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">
                      {request.sales_person}
                    </span>
                  </div>
                  <button
                    onClick={() => onBookTestDrive(request)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Test Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
            <p>No pending requests at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;