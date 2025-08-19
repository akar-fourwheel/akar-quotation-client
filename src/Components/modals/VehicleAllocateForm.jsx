import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import axios from 'axios'; 


const AllocateVehicleModal = ({
    open,
    handleClose,
    booking,
    availablePlantStock,
    onConfirmAllocation,
    loading,
}) => {
    const [form, setForm] = useState({
        chassisNumber: '',
        color: booking?.color || '',
        remark:''
    });

    const [color, setColor] = useState("");
    const [colorList, setColorList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAvailableColors = async () => {
        if (!booking) return;
        if (booking.color && booking.color !== "N/A") {
            setColor(booking.color);
            return;
        }

        try {
            const response = await axios.get('/booking-color', {
                params: {
                    year: booking.manufacturing_yr,
                    variant: booking.product_line, 
                },
            });
            setColorList(response.data || []);
        } catch (error) {
            console.error("Failed to fetch colors:", error);
        }
    };

    useEffect(() => {
        if (open && booking) {
            setColor(booking.color || "");
            fetchAvailableColors();
        }
    }, [open, booking]);
    if (!open || !booking) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const retryBooking = async () => {
        try {
            const response = await axios.post('/booking-process', {
                quotation_id: booking.quotation_id,
                id: booking.booking_id
            });

            showStatus(response.data.message, 'success');

            if (onBookingStatusUpdate) {
                onBookingStatusUpdate(bookingData.booking_id, 'CONFIRMED');
            }
            handleClose();

        } catch (error) {
            console.error('Retry booking failed:', error);

            const apiError = error?.response?.data?.error;
            const message = apiError?.message || "Retry Booking Failed";
            const details = apiError?.details;

            const fullMessage = details
                ? `${message}: ${details.join(', ')}`
                : message;

            showStatus(fullMessage, 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        onConfirmAllocation(form.chassisNumber, form.color, form.remark, booking.booking_id);

        setForm({
            chassisNumber: '',
            color: '',
            remark:''
        });
        setIsSubmitting(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center px-2"
        >
            <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Allocate Vehicle</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                            <p>
                                <span className="text-gray-600">Quotation ID:</span> {booking.quotation_id}
                            </p>
                            <p>
                                <span className="text-gray-600">Customer:</span> {booking.customer_name}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="text-gray-600">Product:</span> {booking.product_line}
                            </p>
                            <p>
                                <span className="text-gray-600">Year:</span> {booking.manufacturing_yr}
                            </p>
                        </div>
                    </div>
                </div>

                {booking?.stockAvailability?.dealer_stock?.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-100 border border-yellow-200 rounded">
                        <p className="text-yellow-800 font-medium mb-2">
                            Vehicle is now available in the Dealer Stock for booking.
                        </p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {retryBooking()}}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                Retry Booking
                            </button>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number *</label>
                        <input
                            type="text"
                            name="chassisNumber"
                            value={form.chassisNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 mb-1 font-medium">Color </label>
                        {color && color !== "N/A" ? (
                            <select
                                className="p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                value={color}
                                disabled
                            >
                                <option value={color}>{color}</option>
                            </select>
                        ) : (
                            <select
                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                name="color"
                                value={form.color}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                            >
                                <option value="">Select a color</option>
                                {colorList.map((clr, index) => (
                                    <option key={index} value={clr}>{clr}</option>
                                ))}
                            </select>

                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Remarks
                        </label>
                        <input
                            type="text"
                            name="remark"
                            value={form.remark}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            Confirm Allocation
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AllocateVehicleModal;