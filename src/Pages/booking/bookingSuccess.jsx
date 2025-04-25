import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const BookingSuccess = () => {
  const { chassis } = useParams();
  const [bookingData, setBookingData] = useState([]);
  const totalAmount = Number(bookingData[10]) + Number(bookingData[9]);

  useEffect(() => {
    try {
      axios
        .get(`/booking-details`, {
          params: { chassis },
        })
        .then((res) => {
          setBookingData(res.data);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 px-3 sm:px-4">
      <div
        className={`bg-white w-full max-w-5xl rounded-3xl animate-fade-in p-5 sm:p-6 md:p-8 ${
          bookingData[11] === "cancelled"
            ? "border border-red-500 shadow-red-500/40 shadow-lg"
            : "shadow-2xl"
        }`}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${
            bookingData[11] === "cancelled"
              ? "from-red-600 to-rose-600"
              : "from-blue-600 to-indigo-600"
          } text-white rounded-2xl px-4 py-3 sm:py-4 flex items-center justify-between flex-wrap gap-3`}
        >
          <div>
            <h2 className="text-base sm:text-lg font-semibold">
              {bookingData[11] === "cancelled"
                ? "Booking Cancelled"
                : "Booking Confirmed"}
            </h2>
            <p className="text-xs sm:text-sm opacity-80">
              {bookingData[11] === "cancelled"
                ? "This booking has been cancelled."
                : "Here's your vehicle booking details"}
            </p>
          </div>
          {bookingData[11] === "cancelled" ? (
            <XCircleIcon className="h-8 w-8 text-white/90" />
          ) : (
            <CheckCircleIcon className="h-8 w-8 text-white" />
          )}
        </div>

        {/* Content layout */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-gray-700 text-xs sm:text-sm">
            <Info label="Customer Name" value={bookingData[0]} />
            <Info label="Booking ID" value={bookingData[1]} />
            <Info label="Year" value={bookingData[2]} />
            <Info label="Chassis Number" value={bookingData[3]} />
            <Info label="Engine Number" value={bookingData[4]} />
            <Info label="Model" value={bookingData[5]} />
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-gray-700 text-xs sm:text-sm">
            <Info label="Fuel Type" value={bookingData[6]} />
            <Info label="Variant" value={bookingData[7]} />
            <Info label="Color" value={bookingData[8]} />
            <Info
              label="Booking Amount"
              value={bookingData[9] === 0 ? "None" : "₹" + bookingData[9]}
              highlight
            />
            <Info
              label="Remaining Amount"
              value={bookingData[10] === 0 ? "None" : "₹" + bookingData[10]}
              highlight
            />
            <Info label="Final Amount" value={"₹" + totalAmount} highlight />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-[10px] sm:text-xs">
          {bookingData[11] === "cancelled"
            ? "Please contact support for more details."
            : "Thank you for booking. We'll be in touch soon!"}
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, highlight = false }) => (
  <div className="flex flex-col">
    <span className="text-[10px] sm:text-xs font-medium text-gray-500">
      {label}
    </span>
    <span
      className={
        highlight
          ? "text-xs sm:text-sm font-bold text-gray-800"
          : "font-semibold text-xs sm:text-sm"
      }
    >
      {value}
    </span>
  </div>
);

export default BookingSuccess;
