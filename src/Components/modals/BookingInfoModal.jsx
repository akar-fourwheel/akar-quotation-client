import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Info = ({ label, value, highlight = false }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className={highlight ? "text-md font-bold text-black-700" : "font-semibold"}>
      {value}
    </span>
  </div>
);

const BookingInfoModal = ({ bookingId, onClose }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    axios.get(`/booking-details`, { params: { id: bookingId } })
      .then(res => {
        setBookingData(res.data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  if (!bookingId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-40">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx- p-4 relative shadow-lg animate-fade-in">
        
        {loading ? (
          <Loader />
        ) : bookingData ? (
          <>
            <div className={`bg-gradient-to-r ${bookingData.stat === "CANCELLED" ? "from-red-600 to-rose-600" : "from-blue-600 to-indigo-600"} text-white rounded-xl px-5 py-6 flex items-center justify-between`}>
              <div>
                <h2 className="text-3xl font-semibold">
                {(() => {
                  if (bookingData.stat === "CANCELLED") {
                    return "Booking Cancelled";
                  } else if (bookingData.stat === "CONFIRMED") {
                    return "Booking Confirmed";
                  } else if (bookingData.stat === "INPROGRESS") {
                    return "Booking In Progress";
                  }
                })()}
                </h2>
                <p className="text-md opacity-80">
                  {bookingData.stat === "cancelled"
                    ? "This booking has been cancelled."
                    : "Here's your vehicle booking details"}
                </p>
              </div>
              {bookingData.stat === "cancelled" ? (
                <XCircleIcon className="h-10 w-10 text-white/90" />
              ) : (
                <CheckCircleIcon className="h-10 w-10 text-white" />
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-xs sm:text-sm">
              <Info label="Customer Name" value={bookingData.customer_name} />
              <Info label="Booking ID" value={bookingData.quotation_id} />
              <Info label="Year" value={bookingData.manufacturing_yr} />
              <Info label="Chassis Number" value={bookingData.chasis_no} />
              <Info label="Engine Number" value={bookingData.Engine_no} />
              <Info label="Model" value={bookingData.model} />
              <Info label="Fuel Type" value={bookingData.fuel} />
              <Info label="Variant" value={bookingData.product_line} />
              <Info label="Color" value={bookingData.vc_color} />
              <Info label="Booking Amount" value={bookingData.booking_amount === 0 ? "None" : "₹" + bookingData.booking_amount} highlight />
              <Info label="Remaining Amount" value={bookingData.remaining_amount === 0 ? "None" : "₹" + bookingData.remaining_amount} highlight />
              <Info label="Final Amount" value={"₹" + (Number(bookingData.booking_amount) + Number(bookingData.remaining_amount)).toFixed(2)} highlight />
            </div>
            <div className="text-center mt-4 text-gray-600 text-xs">
              {bookingData.stat === "cancelled"
                ? "Please contact support for more details."
                : "Thank you for booking. We'll be in touch soon!"}
            </div>
            <div className="flex justify-end"><button
                className="cursor-pointer hover:bg-gray-400 bg-gray-200 py-2 px-4 mx-2 rounded text-gray-600 hover:text-gray-900 text-md"
                onClick={onClose}
                >
                Close
            </button></div>
          </>
        ) : (
          <div className="text-center text-red-500">Failed to load booking details.</div>
        )}
      </div>
    </div>
  );
};

export default BookingInfoModal;