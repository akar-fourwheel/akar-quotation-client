import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { roles } from '../../Routes/roles';
import { AuthContext } from '../../context/auth/AuthProvider';
import { showSuccess, showError } from "../../utils/toast.js";
import CancelModal from "../../Components/modals/CancelModal.jsx";
import BookingInfoModal from "../../Components/modals/BookingInfoModal";
import VnaListModal from "../../Components/modals/VnaListModal.jsx";
import BookingApprovalModal from "../../Components/modals/BookingApprovalModal.jsx";

function BookingPage() {

  const navigate = useNavigate();
  const {role,username} = useContext(AuthContext);

  const [quotaData,setQuotaData] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showVnaModal, setShowVnaModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleViewInfo = (id) => {
    setSelectedBookingId(id);
    setShowInfoModal(true);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.get('/booking-cancel', {
        params: { bookingId }
      });

      showSuccess(response.data.message);
      setShowCancelModal(false);
      setQuotaData((prev) =>
        prev.map((booking) =>
          booking.Quotation_ID === bookingId
            ? { ...booking, STAT: "CANCELLED" }
            : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showError('Failed to cancel booking');
    }
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setQuotaData((prevData) =>
      prevData.map((item) =>
        item.id === bookingId ? { ...item, STAT: newStatus } : item
      )
    );
  };

  const handleApprovalComplete = () => {
    fetchBookings();
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      let response;

      if (role === roles.ADMIN || role === roles.MD || role === roles.AUDITOR) {
        response = await axios.get('/admin/all-bookings');
      } else if (role === roles.SALES) {
        response = await axios.get('/my-bookings', {
          params: { name: username }
        });
      }

      if (response?.data) {
        setQuotaData(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [role, username]);

  const filteredData = quotaData.filter((row) => {
    if (filterOption === "cancelled") return row.STAT === "CANCELLED";
    if (filterOption === "active") return !row.STAT || row.STAT === "CONFIRMED";
    if (filterOption === "inprogress") return row.STAT === "INPROGRESS";
    if (filterOption === "requested") return row.STAT === "REQUESTED";
    if (filterOption === "rejected") return row.STAT === "REJECTED";
    return true;
  });

  const getStatusBadge = (status) => {
    if (status === "CANCELLED") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    }
    if (status === "INPROGRESS") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          In Progress
        </span>
      );
    }
    if (status === "REQUESTED") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Pending Approval
        </span>
      );
    }
    if (status === "REJECTED") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 sm:py-3">
      <div className="max-w-full xl:max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-3xl font-bold text-gray-900">Booking Management</h1>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All Bookings" },
              { value: "active", label: "Active" },
              { value: "requested", label: "Pending Approval" },
              { value: "inprogress", label: "In Progress" },
              { value: "rejected", label: "Rejected" },
              { value: "cancelled", label: "Cancelled" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterOption(option.value)}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filterOption === option.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {(role === roles.TEAML || role === roles.ADMIN || role === roles.MD) && (
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approve Requests
              </button>

              <button
                onClick={() => setShowVnaModal(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View VNA List
              </button>
            </div>
          )}
        </div>



        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No bookings found</div>
            </div>
          ) : (
            <>
              {/* Desktop table view - compact */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 lg:px-3 py-1.5 lg:py-2 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                      <th className="px-2 lg:px-3 py-1.5 lg:py-2 text-left text-xs font-medium text-gray-600 uppercase">Advisor</th>
                      <th className="px-2 lg:px-3 py-1.5 lg:py-2 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
                      <th className="px-2 lg:px-3 py-1.5 lg:py-2 text-left text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                      <th className="px-2 lg:px-3 py-1.5 lg:py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      <th className="px-2 lg:px-3 py-1.5 lg:py-2 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 lg:px-3 py-1.5 lg:py-2">
                          <div className="text-xs font-medium text-gray-900 truncate max-w-20 lg:max-w-none">{row.Quotation_ID}</div>
                        </td>
                        <td className="px-2 lg:px-3 py-1.5 lg:py-2">
                          <div className="text-xs text-gray-900 truncate max-w-20 lg:max-w-none">{row.sales_advisor}</div>
                        </td>
                        <td className="px-2 lg:px-3 py-1.5 lg:py-2">
                          <div className="text-xs text-gray-900 truncate max-w-24 lg:max-w-none">{row.CX_NAME}</div>
                        </td>
                        <td className="px-2 lg:px-3 py-1.5 lg:py-2">
                          <div className="text-xs">
                            <div className="font-medium text-gray-900 truncate max-w-28 lg:max-w-none">{row.Product_Line}</div>
                            <div className="text-gray-500 truncate">{row.Manufacturing_YR} • {row.VC_Color}</div>
                            {row.Chasis_No && (
                              <div className="text-gray-500 truncate">{row.Chasis_No}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 lg:px-3 py-1.5 lg:py-2">
                          {getStatusBadge(row.STAT)}
                        </td>
                        <td className="px-2 lg:px-3 py-1.5 lg:py-2 text-right">
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => handleViewInfo(row.id)}
                              className="px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                              View
                            </button>
                            {(row.STAT === "CONFIRMED" || row.STAT === "INPROGRESS") && (
                              <button
                                onClick={() => {
                                  setSelectedRow(row);
                                  setShowCancelModal(true);
                                }}
                                className="px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs border border-red-300 rounded text-red-700 bg-white hover:bg-red-50 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden">
                {filteredData.map((row) => (
                  <div key={row.id} className="border-b border-gray-200 last:border-b-0">
                    <div className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm font-semibold bg-blue-100 rounded-xl px-2 py-0.5 text-blue-700 whitespace-nowrap">
                          {row.Quotation_ID}
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <div className="text-xs sm:text-sm text-gray-500 truncate lg:pr-5 flex items-center justify-end gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-gray-400"
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
                            </svg>{row.sales_advisor}</div>
                          {getStatusBadge(row.STAT)}
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm font-medium text-gray-900 mt-2 truncate">{row.CX_NAME}</div>

                      <div className=" flex items-center justify-between">
                        <div className="text-xs text-gray-600 mt-1">
                          <span className="font-medium">{row.Product_Line}</span>
                          <span className="text-gray-500 ml-2">{row.Manufacturing_YR} • {row.VC_Color}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleViewInfo(row.id)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            View
                          </button>
                          {(row.STAT === "CONFIRMED" || row.STAT === "INPROGRESS") && (
                            <button
                              onClick={() => {
                                setSelectedRow(row);
                                setShowCancelModal(true);
                              }}
                              className="px-2 py-1 text-xs border border-red-300 rounded text-red-700 bg-white hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showCancelModal && selectedRow && (
          <CancelModal
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancelBooking}
            selectedRow={selectedRow}
          />
        )}

        {showInfoModal && (
          <BookingInfoModal
            bookingId={selectedBookingId}
            onClose={() => setShowInfoModal(false)}
            onBookingStatusUpdate={updateBookingStatus}
          />
        )}

        {showVnaModal && (
          <VnaListModal
            onClose={() => setShowVnaModal(false)}
          />
        )}

        {showApprovalModal && (
          <BookingApprovalModal
            onClose={() => setShowApprovalModal(false)}
            onApprovalComplete={handleApprovalComplete}
          />
        )}
      </div>
    </div>
  );
}

export default BookingPage;