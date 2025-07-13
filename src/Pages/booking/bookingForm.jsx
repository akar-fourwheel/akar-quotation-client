import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

const BookingForm = () => {
  const quoteID = useParams().id;
  const navigate = useNavigate();

  const [bookingAmount, setBookingAmount] = useState(0);
  const [optiId, setOptiId] = useState('');
  const [resData, setResData] = useState(null);
  const [color, setColor] = useState("");
  const [colorList, setColorList] = useState([]);
  const [orderCat, setOrderCat] = useState(["individual", "corporate"]);
  const [orderC, setOrderC] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [errorColor, setErrorColor] = useState('');
  const [remark, setRemark] = useState(' ');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalAmt = parseFloat(resData?.GRAND_TOTAL ?? 0);
  const RemainingAmt = finalAmt - parseFloat(bookingAmount || 0);

  const handleBooking = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setBookingError("");
    
    try {
      await bookingCar();
    } catch (error) {
      console.error("Booking error:", error);
      setErrorColor("red");
      setBookingError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookingCar = async () => {
    try {
      const bookingData = {
        quoteID,
        customer: resData.CUSTOMER_NAME,
        contact: resData.CUSTOMER_PHONE,
        ALOT_ID: resData.ALOT_ID,
        cx_id: resData.customer_id,
        sales_adv: resData.CA_NAME,
        optiId,
        year: resData.year,
        bookingAmount: bookingAmount,
        RemainingAmount: RemainingAmt,
        color,
        variant: resData.variant,
        orderC,
        remark
      };

      const response = await axios.post('/booking-process', bookingData);
      
      if (response.data.success) {
        handleBookingSuccess(response.data);
      } else {
        handleBookingError(response.data);
      }
    } catch (error) {
      console.error("Booking request failed:", error);
      
      if (error.response?.data) {
        handleBookingError(error.response.data);
      } else {
        setErrorColor("red");
        setBookingError("Network error. Please check your connection and try again.");
      }
    }
  };

  const handleBookingSuccess = (responseData) => {
    const { type, data, message } = responseData;

    switch (type) {
      case 'booking':
        // New booking created successfully - vehicle was available
        navigate(`/booking-success/${data.id}`);
        break;
        
      case 'existing_confirmed':
        // Booking already exists and is confirmed
        setErrorColor("blue");
        setBookingError(`Booking already exists and is confirmed. Chassis No: ${data.chassisNo || 'N/A'}`);
        break;
        
      case 'updated_to_confirmed':
        // INPROGRESS booking updated to CONFIRMED - vehicle became available
        setErrorColor("green");
        setBookingError(`Great! Your booking has been confirmed. Vehicle is now available. Chassis No: ${data.chassisNo}`);
        // Optionally navigate to success page after a delay
        setTimeout(() => {
          navigate(`/booking-success/${data.id}`);
        }, 3000);
        break;
        
      case 'vna':
        // VNA request created or booking still in progress
        setErrorColor("green");
        setBookingError(message || "Booking request has been raised. Currently vehicle is not available in dealer stock. Please wait for the vehicle to be available in dealer stock.");
        break;
        
      default:
        setErrorColor("amber");
        setBookingError(message || "Booking request processed.");
    }
  };

  const handleBookingError = (errorData) => {
    if (errorData.error?.code === 'DUPLICATE_BOOKING') {
      setErrorColor("red");
      setBookingError("A confirmed booking with this quotation ID already exists.");
    } else if (errorData.error?.code === 'VALIDATION_ERROR') {
      setErrorColor("red");
      const details = errorData.error.details ? ` Details: ${errorData.error.details.join(', ')}` : '';
      setBookingError(`Please fill in all required fields correctly.${details}`);
    } else if (errorData.error?.code === 'STOCK_NOT_AVAILABLE') {
      setErrorColor("amber");
      setBookingError("Vehicle not available in dealer stock. Request has been raised.");
    } else if (errorData.error?.code === 'DATABASE_ERROR') {
      setErrorColor("red");
      setBookingError("Database error occurred. Please try again later.");
    } else {
      setErrorColor("red");
      setBookingError(errorData.error?.message || "Booking failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!quoteID) return;
    
    const fetchBookingData = async () => {
      try {
        const response = await axios.get('/booking-form', {
          params: { quoteID },
        });
        
        setResData(response.data[0]);
        setColor(response.data[0].color);
        
        // Fetch color options if no color is set
        if (!response.data[0].color || response.data[0].color === "N/A") {
          try {
            const colorResponse = await axios.get('/booking-color', {
              params: {
                year: response.data[0].year,
                variant: response.data[0].variant,
              },
            });
            setColorList(colorResponse.data);
          } catch (colorError) {
            console.error("Failed to fetch colors:", colorError);
          }
        }
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
        setErrorColor("red");
        setBookingError("Failed to load booking data. Please refresh the page.");
      }
    };

    fetchBookingData();
  }, [quoteID]);

  useEffect(() => {
    if (resData && bookingAmount > parseFloat(resData.GRAND_TOTAL)) {
      setBookingAmount(resData.GRAND_TOTAL);
    }
  }, [bookingAmount, resData]);

  // Validation
  const isFormValid = () => {
    return (
      bookingAmount > 0 &&
      color &&
      orderC &&
      !isSubmitting
    );
  };

  if (!resData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Booking Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
          <Field label="Customer Name" value={resData.CUSTOMER_NAME} />
          <Field label="Contact Number" value={resData.CUSTOMER_PHONE} />
          <Field label="Sales Executive" value={resData.CA_NAME} />
          
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Opti ID</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={optiId}
              onChange={(e) => setOptiId(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <Field label="Model Year" value={resData.year} />
          <Field label="Variant" value={resData.variant} />

          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Color *</label>
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
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isSubmitting}
                required
              >
                <option value="">Select a color</option>
                {colorList.map((clr, index) => (
                  <option key={index} value={clr}>
                    {clr}
                  </option>
                ))}
              </select>
            )}
          </div>

      <div className="flex flex-col">
      <label className="text-gray-600 mb-1 font-medium">Select Order Category</label>
        <select
              className="p-2 border border-gray-300 rounded-lg"
              value={orderC}
              onChange={(e) => setOrderC(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              {orderCat.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <Field label="Total Discount" value={resData.TOTAL_DISCOUNT} />
          <Field label="Final Amount" value={resData.GRAND_TOTAL} />

          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Booking Amount *</label>
            <input
              type="number"
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={bookingAmount}
              onChange={(e) => setBookingAmount(e.target.value)}
              min="0"
              max={resData.GRAND_TOTAL}
              disabled={isSubmitting}
              required
            />
          </div>

          <Field label="Remaining Amount" value={RemainingAmt.toFixed(2)} />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 mb-1 font-medium">Remark</label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {bookingError && (
          <div className={`p-3 rounded-lg border text-sm ${getAlertStyle(errorColor)}`}>
            {bookingError}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 font-semibold rounded-lg transition duration-200 ${
            isFormValid()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleBooking}
          disabled={!isFormValid()}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Book Car"
          )}
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 mb-1 font-medium">{label}</label>
    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50">{value}</div>
  </div>
);

const getAlertStyle = (color) => {
  switch (color) {
    case "amber":
      return "bg-amber-100 text-amber-700 border-amber-300";
    case "green":
      return "bg-green-100 text-green-700 border-green-300";
    case "blue":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "red":
    default:
      return "bg-red-100 text-red-700 border-red-300";
  }
};

export default BookingForm;
