import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router';


const BookingSuccess = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [bookingData, setBookingData] = useState([]);
    const totalAmount = Number(bookingData['remaining_amount']) + Number(bookingData['booking_amount']);

    useEffect(() => {
        try{
            axios.get(`/booking-details`,{
              params: { id }
            })
            .then((res) =>{
                setBookingData(res.data[0]);
            }
        )}
        catch(e){
            console.log(e);

        }
    },[])

    return (
<div className="border-red h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 px-4">
<div
  className={`bg-white rounded-3xl w-full max-w-2xl animate-fade-in p-6 ${bookingData['stat'] === "cancelled" ? "border-1 border-red-500 shadow-red-500/40 shadow-lg" : "shadow-2xl"
    }`}
>
    <div
      className={`bg-gradient-to-r ${
        bookingData['stat'] === "cancelled"
          ? "from-red-600 to-rose-600"
          : "from-blue-600 to-indigo-600"
      } text-white rounded-2xl px-6 py-4 flex items-center justify-between`}
    >
      <div>
        <h2 className="text-2xl font-semibold">
          {bookingData['stat'] === "cancelled"
            ? "Booking Cancelled"
            : "Booking Confirmed"}
        </h2>
        <p className="text-sm opacity-80">
          {bookingData['stat'] === "cancelled"
            ? "This booking has been cancelled."
            : "Here's your vehicle booking details"}
        </p>
      </div>
      {bookingData['stat'] === "cancelled" ? (
    <XCircleIcon className="h-10 w-10 text-white/90" />
  ) : (
    <CheckCircleIcon className="h-15 w-15 text-white" />
  )}
    </div>

    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700 text-sm">
      <Info label="Customer Name" value={bookingData['customer_name']} />
      <Info label="Booking ID" value={bookingData['quotation_id']} />
      <Info label="Year" value={bookingData['manufacturing_yr']} />
      <Info label="Chassis Number" value={bookingData['chasis_no']} />
      <Info label="Engine Number" value={bookingData['Engine_no']} />
      <Info label="Model" value={bookingData['model']} />
      <Info label="Fuel Type" value={bookingData['fuel']} />
      <Info label="Variant" value={bookingData['product_line']} />
      <Info label="Color" value={bookingData['vc_color']} />
      <Info
        label="Booking Amount"
        value={bookingData['booking_amount'] === 0 ? "None" : "₹" + bookingData['booking_amount']}
        highlight
      />
      <Info
        label="Remaining Amount"
        value={bookingData['remaining_amount'] === 0 ? "None" : "₹" + bookingData['remaining_amount']}
        highlight
      />
      <Info label="Final Amount" value={"₹" + totalAmount.toFixed(2)} highlight />
    </div>

    <div className="text-center mt-8 text-gray-500 text-xs">
      {bookingData['stat'] === "cancelled"
        ? "Please contact support for more details."
        : "Thank you for booking. We'll be in touch soon!"}
    </div>
    {/* <div className="mt-8">
      <button
        onClick={() => navigate('/')}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Home
      </button>
    </div> */}



          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 group relative py-2 px-4 rounded-md text-sm font-medium
               text-white bg-gradient-to-r from-blue-500 to-indigo-500
               hover:from-blue-600 hover:to-indigo-600">
              Home
            </button>

            <button
              onClick={() => navigate('/booking-list')}
              className="flex-1 group relative py-2 px-4 rounded-md text-sm font-medium
               text-indigo-600 bg-white border border-indigo-500
               hover:bg-indigo-50">
              Booking List
            </button>
          </div>
  </div>
</div>

      );
    };
    
    const Info = ({ label, value, highlight = false }) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">{label}</span>
          <span className={highlight ? "text-md font-bold text-black-700" : "font-semibold"}>
            {value}
          </span>
        </div>
      );

export default BookingSuccess;