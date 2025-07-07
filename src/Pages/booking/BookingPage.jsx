import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { roles } from '../../Routes/roles';
import { AuthContext } from '../../context/auth/AuthProvider';
import { showSuccess, showError } from "../../utils/toast.js";
import CancelModal from "../../Components/modals/CancelModal.jsx";
import BookingInfoModal from "../../Components/modals/BookingInfoModal";

function BookingPage() {

  const navigate = useNavigate();
  const {role,username} = useContext(AuthContext);

  const [quotaData,setQuotaData] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
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
            ? { ...booking, STAT: "cancelled" }
            : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showError('Failed to cancel booking');
    }
  };

  useEffect(() => {
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

    fetchBookings();
  }, [role, username]);

  const filteredData = quotaData.filter((row) => {
    if (filterOption === "cancelled") return row.STAT === "cancelled";
    if (filterOption === "active") return !row.STAT || row.STAT === "";
    return true;
  });

  const getStatusBadge = (status) => {
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-gray-900">Booking Management</h1>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All Bookings" },
              { value: "active", label: "Active" },
              { value: "cancelled", label: "Cancelled" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterOption(option.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${filterOption === option.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-10">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No bookings found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Sales Advisor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Vehicle Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {row.Quotation_ID}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{row.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{row.CX_NAME}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{row.Product_Line}</div>
                          <div className="text-gray-500 text-xs">
                            {row.Manufacturing_YR} • {row.VC_Color}
                          </div>
                          {row.Chasis_No && (
                            <div className="text-gray-500 text-xs">
                              Chassis: {row.Chasis_No}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(row.STAT)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewInfo(row.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                          {!row.STAT && (
                            <button
                              onClick={() => {
                                setSelectedRow(row);
                                setShowCancelModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
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
          />
        )}
      </div>
    </div>
  );
}

export default BookingPage;