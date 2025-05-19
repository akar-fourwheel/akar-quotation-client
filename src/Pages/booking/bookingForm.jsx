import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

const BookingForm = () => {
  const quoteID = useParams().id;

  const navigate = useNavigate();

  const [bookingAmount, setBookingAmount] = useState(0);
  const [optiId,setOptiId] = useState('');
  const [resData, setResData] = useState({});
  const [color, setColor] = useState("");
  const [colorList,setColorList] = useState([]);
  const [orderCat,setOrderCat] = useState(["individual","corporate"]);
  const [orderC, setOrderC] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [errorColor,setErrorColor] = useState('')
  const [remark,setRemark] = useState(' ')

  const finalAmt = parseFloat(resData[6]) || 0;
  const RemainingAmt = finalAmt - parseFloat(bookingAmount || 0);

  const handleBooking = () => {
    try {      
      axios.post(`/booking-process`, {
        quoteID,
        customer:resData[0],
        contact:resData[1],
        sales_adv:resData[7],
        optiId,
        year: resData[2],
        bookingAmount: bookingAmount,
        RemainingAmount: RemainingAmt,
        color,
        variant: resData[3],
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
              sales_adv:resData[7],
              customer:resData[0],
              contact:resData[1],
              optiId,
              year:resData[2],
              variant:resData[3],
              fuel:resData[8],
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
  };

  useEffect(() => {
    if (!quoteID) return;
  
    axios.get(`/booking-form`, {
      params: { quoteID },
    }).then((res) => {      
      setResData(res.data);
      setColor(res.data[4]);
  
      if (!res.data[4] || res.data[4] === "N/A") {
        axios.get(`/booking-color`, {
          params: {
            year: res.data[2],
            variant: res.data[3],
          },
        }).then((res) => {
          setColorList(res.data);
        });
      }
    });
  }, [quoteID]);

  useEffect(() => {
    const maxAmount = resData[6];
    if (bookingAmount > maxAmount) {
      setBookingAmount(maxAmount);
    }
  }, [bookingAmount]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
  <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">Booking Details</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
      <Field label="Customer Name" value={resData[0]} />
      <Field label="Contat Number" value={resData[1]} />
      <Field label="Sales Executive" value={resData[7]} />
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Opti ID</label>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={optiId} 
          onChange={(e) => setOptiId(e.target.value)}
        />
      </div>
      <Field label="Model Year" value={resData[2]} />
      <Field label="Variant" value={resData[3]} />

      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Color</label>
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
            className="p-2 border border-gray-300 rounded-lg"
            value={color}
            onChange={(e) => setColor(e.target.value)}
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
            >
              <option value="">Order Category</option>
              {orderCat.map((clr, index) => (
                <option key={index} value={clr}>
                  {clr}
                </option>
              ))}
            </select>
       </div>

      <Field label="Total Discount" value={resData[5]} />
      <Field label="Final Amount" value={resData[6]} />

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
