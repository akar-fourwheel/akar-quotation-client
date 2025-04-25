import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from 'react-router'
import axios from 'axios';
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';

function AllQuotation() {

    const navigate = useNavigate();
    const [quotaData,setQuotaData] = useState([]);
    const { role,username } = useContext(AuthContext);

    const handleBooking = (row) => {
      const quoteID = row[0];
      navigate(`/booking-form/${quoteID}`)    
    };
    
  useEffect(() => {
    if(role==roles.ADMIN){

      axios.get(`/admin/all-quotations`)
      .then((response)=> {
        try{          
          setQuotaData(response.data);
        }
        catch(e){
          console.log("quotation data could not be set");
          
        }
      })
    }
    if(role==roles.SALES){
      axios.get(`/my-quotation`,{
        params:{
          name:localStorage.getItem('username')
        }
      })
      .then((response)=> {
        try{
          setQuotaData(response.data);
        }
        catch(e){
          console.log("quotation data could not be set");
          
        }
      })
    }
  },[])

  const sortedQuotaData = quotaData?.sort((a, b) => new Date(b[1].slice(5,14)) - new Date(a[1].slice(5,14)));
  

  return (
    <div className="container mx-auto w-half p-2 md:p-6">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 uppercase">All Quotation Data</h2>
      <div className="overflow-x-auto">
      <table className="w-auto bg-white shadow-md rounded-lg overflow-hidden table-fixed">
  <thead>
    <tr className="bg-gray-100">
      <th className="px-4 py-2 text-left text-sm md:text-md font-medium text-gray-700 w-[100px]">Created_on</th>
      <th className="px-2 py-2 text-left text-sm md:text-md font-medium text-gray-700 w-[80px]">Unique_ID</th>
      <th className="px-4 py-2 text-left text-sm md:text-md font-medium text-gray-700 w-[250px]">Customer_Name</th>
      {role !== roles.SALES && (
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-[150px]">Sales_Person</th>
      )}
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-[200px]">Variant</th>
      <th className="px-4 py-2 text-left text-md font-medium text-gray-700 w-[120px]">PDF</th>
      <th className="px-4 py-2 text-left text-md font-medium text-gray-700 w-[150px]">WhatsApp</th>
      <th className="px-4 py-2 text-left text-md font-medium text-gray-700 w-[120px]">Booking</th>
    </tr>
  </thead>
  <tbody>
    {sortedQuotaData.map((row, index) => (
      <tr key={index} className="border-b hover:bg-gray-50">
        <td className="px-4 py-2 text-xs md:text-md text-gray-900 w-[100px]">{row[1]}</td>
        <td className="px-2 py-2 text-xs md:text-md text-gray-900 w-[80px]">{row[0]}</td>
        <td className="px-4 py-2 text-xs md:text-sm text-gray-900 w-[180px]">{row[2]}</td>
        {role !== roles.SALES && (
          <td className="px-4 py-2 text-sm text-gray-900 w-[150px]">{row[3]}</td>
        )}
        <td className="px-4 py-2 text-sm text-gray-900 w-[150px]">{row[4]}</td>
        <td className="px-1 sm:px-4 py-2 text-md text-gray-900 w-[120px]">
          <button
            onClick={() => window.open(row[5], '_blank')}
            className="px-4 py-2 bg-rose-400 sm:w-32 text-white rounded-lg hover:bg-rose-500"
          >
            Open
          </button>
        </td>
        <td className="px-1 sm:px-4 py-2 text-md text-gray-900 w-[150px]">
          <button
            onClick={() => window.location.href = row[6]}
            className="px-3 py-2 bg-green-500 sm:w-32 text-white rounded-lg hover:bg-green-600"
          >
            WhatsApp
          </button>
        </td>
        <td className="px-1 sm:px-4 py-2 text-md text-gray-900 w-[120px]">
          <button
            onClick={() => handleBooking(row)}
            className="px-4 py-2 bg-blue-500 sm:w-32 text-white rounded-lg hover:bg-blue-600"
          >
            Book
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      </div>
    </div>
  );
}

export default AllQuotation;
