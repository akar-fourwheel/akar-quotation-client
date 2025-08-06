import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { showSuccess, showError } from "../../utils/toast.js";
import { roles } from '../../Routes/roles.js';
import { AuthContext } from '../../context/auth/AuthProvider.jsx';
import getDate from '../../utils/getDate.js';

const BookingApprovalModal = ({ onClose, onApprovalComplete }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const { role } = useContext(AuthContext);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/pending-booking-requests');
      
      if (response.data.success) {
        setPendingRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      showError('Failed to fetch pending requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (requestId, action) => {
    try {
      setProcessingId(requestId);
      
      const requestData = {
        requestId,
        action,
        ...(action === 'reject' && { rejectionReason: rejectionReason || 'No reason provided' })
      };

      const response = await axios.post('/booking-approval', requestData);
      
      if (response.data.success) {
        showSuccess(
          action === 'approve' 
            ? 'Booking request approved successfully!' 
            : 'Booking request rejected'
        );
        
        // Remove the processed request from the list
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Reset rejection state
        if (action === 'reject') {
          setRejectingId(null);
          setRejectionReason('');
        }
        
        // Notify parent component
        if (onApprovalComplete) {
          onApprovalComplete();
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      showError(
        error.response?.data?.error?.message || 
        `Failed to ${action} booking request`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-[#00000061] backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Booking Requests
            {!isLoading && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({pendingRequests.length} pending)
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading pending requests...</span>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No pending requests</div>
              <p className="text-gray-500">All booking requests have been processed.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Quote ID: {request.quotationId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Requested on {getDate(request.requestedAt)} <br></br>
                        Requested by {request.requestedBy}
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="inline-block break-words w-fit text-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 leading-tight">
                        Pending Approval
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Customer Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Customer Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-500">Name:</span> {request.customer.name}</p>
                        <p><span className="text-gray-500">Contact:</span> {request.customer.contact}</p>
                        {request.customer.email && (
                          <p><span className="text-gray-500">Email:</span> {request.customer.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Vehicle Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-500">Model:</span> {request.vehicle.variant}</p>
                        <p><span className="text-gray-500">Year:</span> {request.vehicle.year}</p>
                        <p><span className="text-gray-500">Color:</span> {request.vehicle.color}</p>
                      </div>
                    </div>

                    {/* Booking Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Booking Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-500">Booking Amount:</span> {formatCurrency(request.booking.amount)} [{request.booking.paymentMode}]</p>
                        <p><span className="text-gray-500">Remaining:</span> {formatCurrency(request.booking.remainingAmount)}</p>
                        <p><span className="text-gray-500">Category:</span> {request.booking.orderCategory || 'N/A'}</p>
                        {request.booking.optiId && (
                          <p><span className="text-gray-500">Opti ID:</span> {request.booking.optiId}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sales Information */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sales Information</h4>
                    <p className="text-sm"><span className="text-gray-500">Sales Advisor:</span> {request.salesAdvisor}</p>
                  </div>

                  {/* Remark */}
                  {request.remark && request.remark.trim() && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Remark</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{request.remark}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {rejectingId === request.id ? (
                      <div className="flex items-center space-x-3 w-full">
                        <input
                          type="text"
                          placeholder="Reason for rejection (optional)"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        <button
                          onClick={() => handleApproval(request.id, 'reject')}
                          disabled={processingId === request.id}
                          className="cursor-pointer px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          {processingId === request.id ? 'Processing...' : 'Confirm Reject'}
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectionReason('');
                          }}
                          className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                      {(role === roles.TEAML || role === roles.SM || role === roles.ADMIN) && (
                        <div className='flex gap-2' >
                        <button
                          onClick={() => handleApproval(request.id, 'approve')}
                          disabled={processingId === request.id}
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {processingId === request.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setRejectingId(request.id)}
                          disabled={processingId === request.id}
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                        </div>
                      )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingApprovalModal; 