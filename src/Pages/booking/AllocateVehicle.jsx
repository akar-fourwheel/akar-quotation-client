import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarIcon from '@mui/icons-material/DirectionsCar';
import UserIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckIcon from '@mui/icons-material/Check';
import XIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AllocateVehicleModal from '../../Components/modals/VehicleAllocateForm'; // <-- import the modal component
import CancelModal from "../../Components/modals/CancelModal.jsx";
import getDate from '../../utils/getDate.js';
import { showSuccess, showError } from "../../utils/toast.js";

const AllocateVehicle = () => {
    const [vnaData, setVnaData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllocateModal, setShowAllocateModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loadingAllocation, setLoadingAllocation] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const fetchVnaData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/vna-list');
                setVnaData(
                    (response.data || []).filter((booking) => booking.booking_status === 'INPROGRESS')
                );
            } catch (error) {
                console.error('Error fetching VNA data:', error);
                alert('Failed to load VNA list');
            } finally {
                setIsLoading(false);
            }
        };
        fetchVnaData();
    }, []);

    const handleAllocateVehicle = (booking) => {
        setSelectedBooking(booking);
        setShowAllocateModal(true);
    };

    const handleCancel = (booking) => {
        setShowCancelModal(true);
        setSelectedBooking(booking);
    }
    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await axios.get('/booking-cancel', {
                params: { bookingId }
            });

            showSuccess(response.data.message);
            setShowCancelModal(false);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            showError('Failed to cancel booking');
        }
    };

    const handleConfirmAllocation = async (chassisNumber, color, remark, bookingId) => {

        setLoadingAllocation(true);
        try {
            if (!chassisNumber) {
                alert('Please fill all required fields');
                setIsSubmitting(false);
                return;
            }

            const response = await axios.put("/allocate-vehicle", {
                bookingId,
                ChasisNo: chassisNumber,
                color: color,
                remark
            });
            setShowAllocateModal(false);
            setSelectedBooking(null);
            showSuccess(response.data.message);
            setVnaData((prev) => prev.filter((b) => b.quotation_id !== bookingId));
        } catch (error) {
            alert('Failed to allocate vehicle');
        }
        setLoadingAllocation(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">VNA Booking Management</h1>
                    <p className="text-gray-600">Manage in-progress vehicle bookings and allocations</p>
                </div>
                {isLoading ? (
                    <div className="min-h-[40vh] flex flex-col justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Loading VNA bookings...</p>
                    </div>
                ) : vnaData.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border p-8 text-center">
                        <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No In-Progress Bookings</h3>
                        <p className="text-gray-500">There are currently no bookings awaiting vehicle allocation.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {vnaData.map((booking) => (
                            <div
                                key={booking.quotation_id}
                                className="bg-white rounded-lg shadow border transition-shadow hover:shadow-lg"
                            >
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">Quotation ID: {booking.quotation_id}</h3>
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                                                    In Progress
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right mt-4 sm:mt-0">
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                                                <CalendarMonthIcon className="w-4 h-4" />
                                                <span>Requested on: </span>
                                                <div className="font-medium text-gray-800">{getDate(booking.created_on, 'dd-MM-yyyy')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <UserIcon className="w-2 h-2 text-gray-400" />
                                                    <span>{booking.customer_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                    <span>{booking.customer_phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                                    <span>CA: {booking.sales_advisor}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Vehicle Details</h4>
                                            <div className="space-y-2">
                                                <p className="text-gray-600 mb-1">{booking.product_line}</p>
                                                {booking.vc_color !== 'N/A' && (
                                                    <p className="text-gray-700">Color: {booking.vc_color}</p>
                                                )}
                                                {booking.fuel && (
                                                    <p className="text-gray-700">Fuel: {booking.fuel}</p>
                                                )}
                                                <p className="text-gray-600">Year: {booking.manufacturing_yr}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row">
                                        <button
                                            onClick={() => handleAllocateVehicle(booking)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                            Allocate Vehicle
                                        </button>
                                        <button
                                            onClick={() => handleCancel(booking)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <XIcon className="w-4 h-4" />
                                            Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Allocation Modal */}
                <AllocateVehicleModal
                    open={showAllocateModal}
                    handleClose={() => {
                        setShowAllocateModal(false);
                        setSelectedBooking(null);
                    }}
                    booking={selectedBooking}
                    availablePlantStock={selectedBooking?.stockAvailability?.plant_stock || []}
                    onConfirmAllocation={handleConfirmAllocation}
                    loading={loadingAllocation}
                />
                {showCancelModal && (
                    <CancelModal
                        onClose={() => {setShowCancelModal(false)}}
                        onConfirm={ handleCancelBooking }
                        selectedRow={selectedBooking}
                    />
                )}
            </div>
        </div>
    );
};

export default AllocateVehicle;