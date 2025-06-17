import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

const BookingForm = () => {
  const quoteID = useParams().id;
  const navigate = useNavigate();

  const [bookingAmount, setBookingAmount] = useState(0);
  const [optiId,setOptiId] = useState('');
  const [resData, setResData] = useState(null);
  const [color, setColor] = useState("");
  const [colorList,setColorList] = useState([]);
  const [orderCat,setOrderCat] = useState(["individual","corporate"]);
  const [orderC, setOrderC] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [errorColor,setErrorColor] = useState('')
  const [remark,setRemark] = useState(' ')

  const finalAmt = parseFloat(resData?.GRAND_TOTAL??0);
  const RemainingAmt = finalAmt - parseFloat(bookingAmount || 0);

  const handleBooking = async () => {
    try {
      await bookingCar();
      await axios.patch('/teamLead/inc-target', {
        id: localStorage.userId,
      });
    } catch (e) {
      console.error(e);
      console.log("Booking registration failed to update target.");
    }
  };
  

  const bookingCar = async() => {
    try {      
      axios.post(`/booking-process`, {
        quoteID,
        customer:resData.CUSTOMER_NAME,
        contact:resData.CUSTOMER_PHONE,
        sales_adv:resData.CA_NAME,
        optiId,
        year: resData.year,
        bookingAmount: bookingAmount,
        RemainingAmount: RemainingAmt,
        color,
        variant: resData.variant,
        orderC,
        remark
      })
      .then(response =>{  
        const chassisNo = response.data;
        console.log(chassisNo);
               
        if (!(chassisNo==="empty")) {
          navigate(`/booking-success/${chassisNo}`);
        } else {
          try{

            axios.post('/booking-request',{
              quoteID,
              sales_adv: resData.CA_NAME,
              customer:resData.CUSTOMER_NAME,
              contact:resData.CUSTOMER_PHONE,
              optiId,
              year:resData.year,
              variant:resData.variant,
              fuel:resData.fuel,
              color,
            })
            .then(res => {              
              if(res.data === "request raised!"){
                setErrorColor("amber");
                setBookingError("Sorry, the car is not available in Dealer Stock. Request raised for the desired car.");
              }
              else{
                setErrorColor("red")
                setBookingError("Sorry, could not request stock. There may already be a booking with the same id!");
              }
          })
        }
        catch(e){
          console.log(e);
          setErrorColor("red");
          setBookingError("Sorry, something went wrong Please try again after some time...");
        }
        }
          
      });
    } catch (e) {
      console.error("Booking error", e);
    }
  }

  useEffect(() => {
    if (!quoteID) return;
    
    axios.get(`/booking-form`, {
      params: { quoteID },
    }).then((res) => {
      setResData(res.data[0]);
      setColor(res.data[0].color);
      
      if (!res.data.color || res.data.color === "N/A") {
        axios.get(`/booking-color`, {
          params: {
            year: res.data[0].year,
            variant: res.data[0].variant,
          },
        }).then((colorRes) => {
          setColorList(colorRes.data);
        });
      }
    });
  }, [quoteID]);

  useEffect(() => {
    if (resData && bookingAmount > parseFloat(resData.GRAND_TOTAL)) {
      setBookingAmount(resData.GRAND_TOTAL);
    }
  }, [bookingAmount,resData]);

// replace with loader
  if(!resData) {
    return(
      <div className="text-center mt-10 text-gray-600">
        LOADING BOOKING DATA......
      </div>
    )};

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
  <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">Booking Details</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
      <Field label="Customer Name" value={resData.CUSTOMER_NAME} />
      <Field label="Contat Number" value={resData.CUSTOMER_PHONE} />
          <Field label="Sales Executive" value={resData.CA_NAME} />
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Opti ID</label>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={optiId} 
          onChange={(e) => setOptiId(e.target.value)}
        />
      </div>
      <Field label="Model Year" value={resData.year} />
      <Field label="Variant" value={resData.variant} />

      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Color</label>
          <select
           className="p-2 border border-gray-300 rounded-lg"
           value={color}
           onChange={(e) => setColor(e.target.value)}
         >
          <option value="" disabled>Select a color</option>
       
           {colorList.length > 0
             ? colorList.map((clr, index) => (
                 <option key={index} value={clr}>
                   {clr}
                 </option>
               ))
             : (
               <option value={color}>{color}</option>
             )}
         </select>
      </div>

      <div className="flex flex-col">
      <label className="text-gray-600 mb-1 font-medium">Select Order Category</label>
        <select
              className="p-2 border border-gray-300 rounded-lg"
              value={orderC}
              onChange={(e) => setOrderC(e.target.value)}
            >
              <option value="">Order Category</option>
              {orderCat.map((clr, index) => (
                <option key={index} value={clr}>
                  {clr}
                </option>
              ))}
            </select>
       </div>

      <Field label="Total Discount" value={resData.TOTAL_DISCOUNT} />
      <Field label="Final Amount" value={resData.GRAND_TOTAL} />

      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Booking Amount</label>
        <input
          type="number"
          className="p-2 border border-gray-300 rounded-lg"
          value={bookingAmount} 
          onChange={(e) => setBookingAmount(e.target.value)}
        />
      </div>

      <Field label="Remaining Amount" value={RemainingAmt} />
    </div>

    {bookingError && (
      <div className={`p-3 rounded-lg ${errorColor=="amber" ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-red-100 text-red-700 border-red-300"} border text-sm`}>
        {bookingError}
      </div>
    )}
          <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Remark</label>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={remark} 
          onChange={(e) => setRemark(e.target.value)}
        />
      </div>

    <button
      type="submit"
      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
      onClick={handleBooking}
    >
      Book Car
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

export default BookingForm;
