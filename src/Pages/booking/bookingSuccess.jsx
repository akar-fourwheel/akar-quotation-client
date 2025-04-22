import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const bookingSuccess = (req,res) => {
    const {chassis} = useParams();
    
    const [bookingData,setBookingData] = useState([]);
    const totalAmount = Number(bookingData[10])+Number(bookingData[9]);

    useEffect(()=> {
        try{
            axios.get(`/booking-details`,{
                params:{
                    chassis:chassis
                }
            })
            .then((res) =>{
                console.log(res.data);  
                setBookingData(res.data);
            }
        )}
        catch(e){
            console.log(e);

        }
    },[])

    return (
<div className="border-red min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 px-4">
<div
  className={`bg-white rounded-3xl w-full max-w-2xl animate-fade-in p-6 ${bookingData[11] === "cancelled" ? "border-1 border-red-500 shadow-red-500/40 shadow-lg" : "shadow-2xl"
    }`}
>
    <div
      className={`bg-gradient-to-r ${
        bookingData[11] === "cancelled"
          ? "from-red-600 to-rose-600"
          : "from-blue-600 to-indigo-600"
      } text-white rounded-2xl px-6 py-4 flex items-center justify-between`}
    >
      <div>
        <h2 className="text-2xl font-semibold">
          {bookingData[11] === "cancelled"
            ? "Booking Cancelled"
            : "Booking Confirmed"}
        </h2>
        <p className="text-sm opacity-80">
          {bookingData[11] === "cancelled"
            ? "This booking has been cancelled."
            : "Here's your vehicle booking details"}
        </p>
      </div>
      {bookingData[11] === "cancelled" ? (
    <XCircleIcon className="h-10 w-10 text-white/90" />
  ) : (
    <CheckCircleIcon className="h-15 w-15 text-white" />
  )}
    </div>

    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700 text-sm">
      <Info label="Customer Name" value={bookingData[0]} />
      <Info label="Booking ID" value={bookingData[1]} />
      <Info label="Year" value={bookingData[2]} />
      <Info label="Chassis Number" value={bookingData[3]} />
      <Info label="Engine Number" value={bookingData[4]} />
      <Info label="Model" value={bookingData[5]} />
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

    <div className="text-center mt-8 text-gray-500 text-xs">
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
          <span className="text-xs font-medium text-gray-500">{label}</span>
          <span className={highlight ? "text-md font-bold text-black-700" : "font-semibold"}>
            {value}
          </span>
        </div>
      );

export default bookingSuccess;