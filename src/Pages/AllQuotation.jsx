import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from 'react-router'
import axios from 'axios';
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';

function AllQuotation() {
    const navigate = useNavigate();
    const [quotaData, setQuotaData] = useState([]);
    const { role, username } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookTestDrive, setBookTestDrive] = useState([]);
    const [salesFilter, setSalesFilter] = useState('');
    const [uniqueCas, setUniqueCas] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 25,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const handleBooking = (row) => {
      const quoteID = row[0];
      navigate(`/booking-form/${quoteID}`)    
    };

    const handleTestDrive = (row) => {
      setBookTestDrive(row);
      console.log(row);
      
    };
    
    const fetchQuotations = async (page) => {
        try {
            let response;
            if(role === roles.ADMIN) {
                if(salesFilter !== '') {
                    response = await axios.get(`/my-quotation`, {
                    params: {
                        name: salesFilter,
                        role,
                        page,
                        limit: 25
                    }
                });
                }
                else {
                response = await axios.get(`/admin/all-quotations`, {
                    params: { role,page, limit: 25 }
                });
                setUniqueCas([...new Set(response.data.data.map(ca => ca[2]))]);
            }
            } else if(role === roles.SALES) {
                response = await axios.get(`/my-quotation`, {
                    params: {
                        name: username,
                        role,
                        page,
                        limit: 25
                    }
                });
            } else if(role ==roles.TEAML){
                response = await axios.get("/teamLead/quotations",{
                    params:{
                        name:username,
                        role,
                        page,
                        limit:25,
                    }
                })
            }
            
            if(response?.data) {
                setQuotaData(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch(e) {
            console.log("Error fetching quotation data:", e);
        }
    };

    useEffect(() => {
        fetchQuotations(currentPage);
    }, [currentPage, role, quotaData]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    function setToIst(dateTime) {
        const dt = new Date(dateTime);
        const istOffset = 5.5 * 60; // IST is UTC+5:30
        const utc = dt.getTime() + (dt.getTimezoneOffset() * 60000);
        const istTime = new Date(utc + (istOffset * 60000));
    
        return istTime.toLocaleString('en-GB', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    return (
        <div className="container mx-auto w-half p-2 md:p-6">
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 uppercase">All Quotation Data</h2>
            <div className="overflow-x-auto">
                {(quotaData.length > 0 && localStorage.role === roles.ADMIN) && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by CA:</label>
                    <select
                        value={salesFilter}
                        onChange={(e) => setSalesFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All CAs</option>
                        {uniqueCas.map((ca, index) => (
                            <option key={index} value={ca}>
                                {ca}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {quotaData.length > 0 &&
                (<table className="w-auto bg-white shadow-md rounded-lg overflow-hidden table-fixed">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm md:text-md font-medium text-gray-700 w-[100px]">Created_on</th>
                            <th className="px-2 py-2 text-left text-sm md:text-md font-medium text-gray-700 w-[80px]">Unique_ID</th>
                            {role !== roles.SALES && (
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-[150px]">Sales_Person</th>
                            )}
                            <th className="px-4 py-2 text-left text-sm md:text-md font-medium text-gray-700 w-[250px]">Customer_Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-[200px]">Variant</th>
                            <th className="px-4 py-2 text-left text-md font-medium text-gray-700 w-[120px]">PDF</th>
                            <th className="px-4 py-2 text-left text-md font-medium text-gray-700 w-[150px]">WhatsApp</th>
                            <th className="px-4 py-2 text-left text-md font-medium text-gray-700 w-[120px]">Booking</th>
                            <th className="px-4 py-2 text-left text-md font-medium text-gray-700 w-[120px]">Test Drive</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotaData?.map((row, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 text-xs md:text-md text-gray-900 w-[100px]">{setToIst(row[1])}</td>
                                <td className="px-2 py-2 text-xs md:text-md text-gray-900 w-[80px]">{row[0]}</td>
                                {role !== roles.SALES && (
                                <td className="px-4 py-2 text-xs md:text-sm text-gray-900 w-[180px]">{row[2]}</td>
                                )}
                                <td className="px-4 py-2 text-sm text-gray-900 w-[150px]">{row[3]}</td>
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
                                <td className="px-1 sm:px-4 py-2 text-md text-gray-900 w-[120px]">
                                    <button
                                        onClick={() => handleTestDrive(row)}
                                        className="px-4 py-2 bg-yellow-500 sm:w-32 text-white rounded-lg hover:bg-yellow-600"
                                    >
                                        Test Drive
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)
                }
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap gap-3 justify-center mt-4 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination?.hasPreviousPage}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Previous
                </button>
                {[...Array(pagination?.totalPages || 1)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded-lg ${
                            currentPage === index + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination?.hasNextPage}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            {/* {selectedVehicle && (
          <AddDetails
            model={selectedVehicle.model}
            index={selectedVehicle.id}
            name={row.}
            setShow={setShowOut}
            show={showOut}
            data={rows}
            setRow={setRows}
            onStatusUpdate={handleStatusUpdate}
          />)} */}
        </div>
    );
}

export default AllQuotation;
