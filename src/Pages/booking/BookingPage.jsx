import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { roles } from '../../Routes/roles';
import { AuthContext } from '../../context/auth/AuthProvider';

function BookingPage() {

    const navigate = useNavigate();
    const {role,username} = useContext(AuthContext);

    const [quotaData,setQuotaData] = useState([]);
    const [filterOption, setFilterOption] = useState("all");

    function handleNavi(ChassisNo){
      navigate(`/booking-success/${ChassisNo}`);
    }

    function handleCancel(bookingId){
      try{

        axios.get('/booking-cancel',{
          params:{
            bookingId
          }
        }).then(res => {
          console.log(res.data);
          
        })
        
        window.location.reload(false);
      }
      catch(e){
        console.log(e);
      }
    }

  useEffect(() => {
    if(role==roles.ADMIN || role===roles.MD)
    axios.get(`/admin/all-bookings`)
    .then((response)=> {
        try{
            setQuotaData(response.data);
        }
        catch(e){
            console.log("booking data could not be set");
            
        }
    })
    if(role==roles.SALES)
      axios.get(`/my-bookings`,{params:{name:username}})
      .then((response)=> {
          try{
              setQuotaData(response.data);
              console.log(quotaData);
              
          }
          catch(e){
              console.log("booking data could not be set");
              
          }
      })
  },[])

  return (
    <div className="container mx-auto w-half p-6">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 uppercase">Booking Data</h2>
      <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end">
      <div className="mb-4 flex justify-end">
  <select
    value={filterOption}
    onChange={(e) => setFilterOption(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
  >
    <option value="all">Show All</option>
    <option value="cancelled">Cancelled</option>
    <option value="bookings">bookings</option>
  </select>
</div>
</div>

<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gray-100">
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Booking_ID</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Sales Advicer</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Customer Name</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Year</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Varient</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Color</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Chassis_No</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Get_info</th>
      <th className="sm:px-2 sm:py-3 px-1 py-2 text-left text-sm sm:text-sm font-medium text-gray-700">Cancel</th>
    </tr>
  </thead>
  <tbody>
  {quotaData.length!=0 ? (quotaData
  .filter((row) => {
    if (filterOption === "cancelled") return row[7] === "cancelled";
    if (filterOption === "bookings") return row[7] === null;
    return true; // 'all'
  })
  .map((row) => (
      <tr key={row} className={`border-b  ${ row[7] === "cancelled" ? "bg-red-400 hover:bg-red-200" : "hover:bg-gray-50"}`}>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs w-50 sm:text-sm text-gray-900">{row[0]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs w-50 sm:text-sm font-medium text-gray-700">{row[1]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs w-50 sm:text-sm text-gray-900">{row[2]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs w-50 sm:text-sm text-gray-700">{row[3]}</td>
        
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs w-50 sm:text-sm text-gray-700">{row[4]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs w-50 sm:text-sm text-gray-700">{row[5]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs w-50 sm:text-sm text-gray-700">{row[6]}</td>
        <td>
        <button
            onClick={()=> handleNavi(row[6])}
            className="px-4 py-2 bg-blue-500 mx-4 sm:w-30 text-white rounded-lg hover:bg-blue-600"
            aria-label="information"
          >
            Information
          </button>
          </td>
          <td>
        {!row[7] && <button
            onClick={()=> handleCancel(row[0])}
            className="px-4 py-2 px-1 mx-4 bg-rose-600 sm:w-30 text-white rounded-lg hover:bg-rose-400"
            aria-label="Book"
          >
            Cancel
          </button>
          }
          </td>
      </tr>
    ))):(
      <tr>
        <td colSpan="9" className="text-center py-4 text-gray-500">
          No bookings found.
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
    </div>
  );
}

export default BookingPage;
