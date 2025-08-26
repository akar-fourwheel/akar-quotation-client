import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { roles } from "../../Routes/roles";
import { AuthContext } from '../../context/auth/AuthProvider';
import { handleGeneratePDF, retryBooking } from "../../services/bookingService";
import ShareIcon from '@mui/icons-material/Share';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const Info = ({ label, value, highlight = false }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className={highlight ? "text-md font-bold text-black-700" : "font-semibold"}>
      {value}
    </span>
  </div>
);

const BookingInfoModal = ({ bookingId, onClose, onBookingStatusUpdate }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const { role } = useContext(AuthContext);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  const showStatus = (message, type) => {
    setStatus({ message, type });
    setTimeout(() => {
      setStatus({ message: '', type: '' });
    }, 7000);
  };

  const onRetryBooking = async (bookingData) => {
    try {
      const response = await retryBooking(bookingData);
      if(response){
        showStatus(response.message, 'success');
      }
      else{
        showStatus(response.message, 'error');
      }
      
      if (onBookingStatusUpdate) {
        onBookingStatusUpdate(bookingData.id, 'CONFIRMED');
      }

    } catch (error) {
      console.error('Retry booking failed:', error);

      const apiError = error?.response?.data;
      const message = apiError?.message || "Retry Booking Failed";
      const details = apiError?.details;

      const fullMessage = details
        ? `${message}: ${details.join(', ')}`
        : message;

      showStatus(fullMessage, 'error');
    }
  };

  const handleOpenPDF = (fileUrl) => {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank');
  };

  const onGeneratePDF = async (id) => {
    if (!id) return;
    setPdfLoading(true);
    try {
      const response = await handleGeneratePDF(id);
      showStatus(response.message, 'success');
      setPdfUrl(response.publicUrl);
      setWhatsappUrl(response.whatsappUrl);
    } catch (error) {
      console.error('Generate PDF failed:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    axios.get(`/booking-details`, { params: { id: bookingId } })
      .then(res => {
        setBookingData(res.data[0]);
        setPdfUrl(res.data[0].pdf_url);
        setWhatsappUrl(res.data[0].whatsapp_link);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  if (!bookingId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-40">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx- p-4 relative shadow-lg animate-fade-in">
        {status.message && (
          <div className={`backdrop-blur-md p-4 rounded-xl transition-all duration-300 ${status.type === 'success'
            ? 'text-green-800'
            : 'text-red-800'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}></div>
              <span className="font-medium">{status.message}</span>
            </div>
          </div>
        )}
        {loading ? (
          <Loader />
        ) : bookingData ? (
          <>
            <div className={`bg-gradient-to-r ${bookingData.stat === "CANCELLED" || bookingData.stat === "REJECTED" ? "from-red-600 to-rose-600" : "from-blue-600 to-indigo-600"} text-white rounded-xl px-5 py-6 flex items-center justify-between`}>
              <div>
                <h2 className="text-3xl font-semibold">
                {(() => {
                  if (bookingData.stat === "CANCELLED") {
                    return "Booking Cancelled";
                  } else if (bookingData.stat === "REJECTED") {
                    return "Booking Rejected";
                  } else if (bookingData.stat === "CONFIRMED") {
                    return "Booking Confirmed";
                  }else if (bookingData.stat === "INPROGRESS") {
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
              <Info label="Booking Amount" value={bookingData.booking_amount === 0 ? "None" : "₹" + bookingData.booking_amount + " [" + bookingData.payment_mode + "]"} highlight/>
              <Info label="Remaining Amount" value={bookingData.remaining_amount === 0 ? "None" : "₹" + bookingData.remaining_amount} highlight />
              <Info label="Final Amount" value={"₹" + (Number(bookingData.booking_amount) + Number(bookingData.remaining_amount)).toFixed(2)} highlight />
            </div>
            <div className="text-center mt-4 text-gray-600 text-xs">
              {bookingData.stat === "cancelled"
                ? "Please contact support for more details."
                : "Thank you for booking. We'll be in touch soon!"}
            </div>
            <div className="flex justify-end mt-4">
              {(bookingData.stat === "INPROGRESS" && role !== roles.SALES) && ( 
                < button
                  onClick={() => onRetryBooking(bookingData)}
                  className="cursor-pointer hover:bg-blue-400 bg-blue-600 py-2 px-4 mx-2 rounded text-white text-md"
                >
                  Retry Booking
                </button>)}
              {bookingData.stat !== "REJECTED" && (!pdfUrl ? (pdfLoading ? 
              <button disabled type="button" class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 inline-flex items-center">
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                </svg>
                Loading...
              </button> : <button
                className="cursor-pointer hover:bg-gray-400 bg-gray-200 py-2 px-4 mx-2 rounded text-gray-600 hover:text-gray-900 text-md"
                onClick={()=>onGeneratePDF(bookingData.id)}
                >
                Generate PDF
              </button>) : ( 
               <div className="relative inline-block" ref={dropdownRef}>
               <button
                 className="cursor-pointer hover:bg-gray-400 bg-gray-200 py-2 px-4 mx-2 rounded text-gray-600 hover:text-gray-900 text-md flex items-center"
                 onClick={() => setOpen((o) => !o)}
                 type="button"
               >
                 PDF Actions <ArrowDropDownIcon className="ml-2 w-4 h-4" aria-hidden="true"/>
               </button>
               {open && (
                 <div className="absolute z-10 ml-2 mt-1 w-35 bg-white border border-gray-300 rounded shadow-lg">
                   <button
                     className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-600 justify-between"
                     onClick={() => { handleOpenPDF(pdfUrl); setOpen(false); }}
                   >
                    <span className="mr-2">
                     View PDF 
                     </span>
                     <RemoveRedEyeIcon fontSize="small" color="gray" />
                   </button>
                   <button
                     className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-600 justify-between"
                     onClick={() => { handleOpenPDF(whatsappUrl); setOpen(false); }}
                   >
                    <span className="mr-2">
                     Share PDF 
                     </span>
                     <ShareIcon fontSize="small" color="gray" />
                   </button>
                 </div>
               )}
             </div>))}
             
              <button
                className="cursor-pointer hover:bg-gray-400 bg-gray-200 py-2 px-4 mx-2 rounded text-gray-600 hover:text-gray-900 text-md"
                onClick={onClose}
                >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-red-500">Failed to load booking details.</div>
        )}
      </div>
    </div>
  );
};

export default BookingInfoModal;