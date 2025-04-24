import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';

function AllQuotation() {

    const [quotaData,setQuotaData] = useState([]);
    const { role,username } = useContext(AuthContext);
    
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

  const sortedQuotaData = quotaData.sort((a, b) => new Date(b[1].slice(5,14)) - new Date(a[1].slice(5,14)));
  

  return (
    <div className="container mx-auto w-half p-6">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">All Quotation Data</h2>
      <div className="overflow-x-auto">
<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gray-100">
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Created_on</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Unique_ID</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Customer_Name</th>
      {!role==roles.SALES && 
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Sales_Person</th>
      }
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Variant</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">PDF</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">WhatsApp</th>
    </tr>
  </thead>
  <tbody>
    {sortedQuotaData.map((row) => (
      <tr key={row} className="border-b hover:bg-gray-50">
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm w-50 sm:text-base text-gray-900">{row[1]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm w-50 sm:text-base text-gray-900">{row[0]}</td>
        {!role==roles.SALES &&
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm w-50 sm:text-base font-medium text-gray-700">{row[2]}</td>
        }
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm w-50 sm:text-base text-gray-900">{row[3]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm w-50 sm:text-base text-gray-700">{row[4]}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm w-50 sm:text-base text-gray-700">
          <button
            onClick={() => window.open(row[5], '_blank')}
            className="px-4 py-2 bg-blue-500 sm:w-50 text-white rounded-lg hover:bg-blue-600"
            aria-label="Open PDF"
          >
            Open
          </button>
        </td>
        <td className="sm:px-4 sm:py-3 px-3 w-50 py-2 text-sm text-gray-700">
          <button
            onClick={() => window.location.href = row[6]}
            className="px-4 py-2 bg-green-500 sm:w-50 text-white rounded-lg hover:bg-green-600"
            aria-label="Send WhatsApp message"
          >
            WhatsApp
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
