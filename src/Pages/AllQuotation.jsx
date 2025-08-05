import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';
import useDebounce from '../hooks/useDebounce'; 
import Pagination from '../Components/common/Pagination';
import Loader from '../Components/Loader/Loader'
import { DateTime } from "luxon";

function AllQuotation() {
    const navigate = useNavigate();
    const [quotaData, setQuotaData] = useState([]);
    const { role, username, userId } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [uniqueCas, setUniqueCas] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState({ show: false, success: false, message: '', model: '' });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 25,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const [statusModal, setStatusModal] = useState({
        show: false,
        status: null,
        remark: null,
        row: null,
    });

    //filter section
    const [searchTerm, setSearchTerm] = useState('');
    const [salesFilter, setSalesFilter] = useState(''); 
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [scheduledDateTime, setScheduledDateTime] = useState('');
    const [testDriveSelected, setTestDriveSelected] = useState(false);
    

    // Ref for the operations panel
    const operationsPanelRef = useRef(null);

    const handleTestDrive = async(selectedRow) => {
        // fetch status
        const response = await axios.get(`/test-drive/status/${selectedRow.ALOT_ID}`);
        const responseStatus = response.data;
        setTestDriveSelected(false);
        
        if (!responseStatus.status) { // if no record found
            requestTestDrive(selectedRow);
        } else {
            setStatusModal({
                show: true,
                status: responseStatus.status,
                remark: responseStatus.remark || 'No remarks.',
                row: selectedRow,
            });
        }
      };

    const handleBooking = () => {
        if (!selectedRow) return;
        const quoteID = selectedRow.quotation_id;
        navigate(`/booking-form/${quoteID}`);
    };

    const requestTestDrive = async (row) => {
        try {
          const detailsResponse = await axios.post(`/test-drive/request`, {
            cxID: row.CX_ID,
            alotID: row.ALOT_ID,
            variant: row.variant,
            requested_by: row.username,
            sales_person_id: row.user_id,
            cust_phone: row.CUSTOMER_PHONE,
            cust_name: row.CX_NAME,
            scheduledDateTime: scheduledDateTime
          });
          setTestDriveSelected(false);
          if (detailsResponse.status === 200) {
            setModalData({
              show: true,
              success: true,
              message: 'Test drive request sent successfully!',
              model: row?.variant || '',
            });
          } else {
            throw new Error('Failed to send test drive request');
          }
        } catch (error) {
            setTestDriveSelected(false);
            console.error("Error in requesting test drive:", error);
            setModalData({
              show: true,
              success: false,
              message: 'An error occurred while processing your request.',
              model: row?.variant || '',
            });
        }
    }

    const handleOpenPDF = () => {
        if (!selectedRow) return;
        window.open(selectedRow.file_url, '_blank');
    };

    const handleSendWhatsApp = () => {
        if (!selectedRow) return;
        window.location.href = selectedRow.whatsapp_link;
    };

    const closeModal = () => {
        setModalData({ ...modalData, show: false });
    };

    const closeOperationsPanel = () => {
        setSelectedRow(null);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (operationsPanelRef.current && !operationsPanelRef.current.contains(event.target)) {
                closeOperationsPanel();
            }
        }

        if (selectedRow) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedRow]);

    const fetchCas = async () => {
        try {
            let allCas = await axios.get('/sales/get-all-ca')
            setUniqueCas(allCas.data.data || []);
        } catch (e) {
            console.log("Error fetching CA data:", e);
        }
    }

    const fetchQuotations = async (page) => {        
        setLoading(true);
        try {
            const response = await axios.get(`/fetch-quotations`, {
                params: {
                    page,
                    limit: 25,
                    search: debouncedSearchTerm,
                    ca: salesFilter
                }
            });

            const jsonData = response.data;
            setQuotaData(jsonData.data || []);
            setPagination(jsonData.data.length > 0 ? jsonData.pagination : {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: 25,
                hasNextPage: false,
                hasPreviousPage: false
            });
        } catch (e) {
            console.log("Error fetching quotation data:", e);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === roles.ADMIN || role === roles.MD || role === roles.TEAML || role === roles.SM || role === roles.GM) {
            fetchCas();
        }
    }, [role, username]);

    useEffect(() => {
        fetchQuotations(currentPage);
    }, [currentPage, salesFilter, modalData, debouncedSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSelectedRow(null); // Clear selection when changing page
        window.scrollTo(0, 0);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row === selectedRow ? null : row);        
    };

    const getDate = (ts) => {
      if (!ts) return '-';
      return DateTime.fromISO(ts, { zone: 'utc' })
        .setZone('Asia/Kolkata')
        .toFormat('dd-MM-yyyy');
    };
    
    const getSerialNumber = (index) => {
        return (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1;
    };

    return (
        <div className={`min-h-screen bg-gray-100 ${selectedRow ? 'relative' : ''}`}>
            {/* Backdrop with blur effect when operations panel is open */}
            {selectedRow && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={closeOperationsPanel}></div>
            )}

            {/* Header */}
            <div className="max-w-7xl flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Quotations</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">

                        {/* Search */}
                        <div
                            className={`col-span-1 ${uniqueCas.length > 0 && (role === roles.ADMIN || role === roles.MD)
                                    ? 'sm:col-span-1 lg:col-span-2'
                                    : 'sm:col-span-2 lg:col-span-4'
                                }`}
                        >
                            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search by model or customer...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                                />
                                <svg
                                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Filter by CA */}
                        {(uniqueCas.length > 0 && (role !== roles.SALES)) && (
                            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Sales Advisor:</label>
                                <select
                                    value={salesFilter}
                                    onChange={(e) => setSalesFilter(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" className="">All CAs</option>
                                    {uniqueCas.map(({user_id, username}) => (
                                        <option key={user_id} value={user_id}>
                                            {username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSalesFilter('');
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>


                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-2 md:p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Total Quotations</p>
                                <p className="text-xl font-semibold text-gray-900">{pagination.totalItems}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-2 md:p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Current Page</p>
                                <p className="text-xl font-semibold text-gray-900">{pagination.currentPage} of {pagination.totalPages}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-2 md:p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Showing</p>
                                <p className="text-xl font-semibold text-gray-900">{quotaData.length} records</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    { loading ? (<Loader/>) :
                    quotaData.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation ID</th>
                                                {role !== roles.SALES && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Person</th>
                                                )}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Model</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {quotaData.map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className={`cursor-pointer transition-colors duration-150 ${selectedRow === row
                                                        ? 'bg-blue-50 border-l-4 border-blue-400'
                                                        : row.status === 0
                                                            ? 'hover:bg-yellow-50 bg-yellow-25'
                                                            : row.status === 1
                                                                ? 'hover:bg-green-50 bg-green-25'
                                                                : 'hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handleRowClick(row)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {getSerialNumber(index)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {getDate(row.date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {row.quotation_id}
                                                        </span>
                                                    </td>
                                                    {role !== roles.SALES && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {row.username}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {row.CX_NAME}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {row.variant}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer">
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden">
                                <div className="divide-y divide-gray-200">
                                    {quotaData.map((row, index) => (
                                        <div
                                            key={index}
                                            className={`px-4 py-4 cursor-pointer transition-colors duration-150 ${selectedRow === row
                                                ? 'bg-blue-50 border-l-4 border-blue-400'
                                                : row.status === 0
                                                    ? 'hover:bg-yellow-50 bg-yellow-25'
                                                    : row.status === 1
                                                        ? 'hover:bg-green-50 bg-green-25'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => handleRowClick(row)}
                                        >
                                            {/* Header Row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs font-medium text-gray-600">#{getSerialNumber(index)}</span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {row.quotation_id}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                    {role !== roles.SALES && (
                                                        <div className="text-xs font-semibold text-gray-900 lg:pr-5 flex items-center justify-end gap-1">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-4 h-4 text-gray-500"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                            </svg>
                                                            <span className="truncate max-w-[6rem] sm:max-w-[12rem] lg:max-w-none">{row.username}</span>
                                                      </div>
                                                    )}
                                                    <span>{getDate(row.date)}</span>
                                                </div>
                                            </div>

                                            {/* Main Content Grid */}
                                            <div className="flex flex-col space-y-0.5">
                                                <div className="flex justify-between items-start gap-6">
                                                    <p className="text-sm font-semibold text-gray-900 ">
                                                        {row.CX_NAME}
                                                    </p>
                                                    <p className="text-xs text-gray-900 leading-relaxed break-all whitespace-normal text-right">
                                                        {row.variant}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Pagination */}
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                                itemsPerPage={pagination.itemsPerPage}
                                totalItems={pagination.totalItems}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No quotations found</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Operations Panel */}
            {selectedRow && (
                <div
                    ref={operationsPanelRef}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 w-full max-w-md mx-4 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Quick Actions</h3>
                                <p className="text-blue-100 text-sm">
                                    {selectedRow.CX_ID} - {selectedRow.CX_NAME}
                                </p>
                            </div>
                            <button
                                onClick={closeOperationsPanel}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {!testDriveSelected ? (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleOpenPDF}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg transition-all duration-200 group"
                                >
                                    <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm font-medium">View PDF</span>
                                </button>

                                <button
                                    onClick={handleSendWhatsApp}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 rounded-lg transition-all duration-200 group"
                                >
                                    <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="text-sm font-medium">WhatsApp</span>
                                </button>

                                <button
                                    onClick={handleBooking}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-lg transition-all duration-200 group"
                                >
                                    <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <span className="text-sm font-medium">Book Now</span>
                                </button>

                                <button
                                    onClick={() => setTestDriveSelected(true)}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 rounded-lg transition-all duration-200 group"
                                >
                                    <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="text-sm font-medium">Test Drive</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900">Schedule Test Drive</h4>
                                    <p className="text-sm text-gray-500 mb-4">Select preferred date and time</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={scheduledDateTime}
                                        onChange={(e) => setScheduledDateTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-2">
                                    <button
                                        onClick={() => handleTestDrive(selectedRow)}
                                        className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-medium transition-colors"
                                    >
                                        Request Test Drive
                                    </button>
                                    <button
                                        onClick={() => setTestDriveSelected(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Success/Error Modal */}
            {modalData.show && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className={`p-6 text-center ${modalData.success ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${modalData.success ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                <svg
                                    className={`w-8 h-8 ${modalData.success ? 'text-green-600' : 'text-red-600'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {modalData.success ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    )}
                                </svg>
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 ${modalData.success ? 'text-green-900' : 'text-red-900'}`}>
                                {modalData.success ? 'Success!' : 'Request Failed'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {modalData.message}
                            </p>
                            {modalData.model && (
                                <div className="bg-white/50 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Model:</span> {modalData.model}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 pb-6">
                            {!modalData.success && (
                                <Link to='/test-drive' className="block mb-3">
                                    <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-medium transition-colors">
                                        View Available Vehicles
                                    </button>
                                </Link>
                            )}
                            <button
                                onClick={closeModal}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Modal */}
            {statusModal.show && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-blue-50 p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-center text-blue-900 mb-2">
                                Test Drive Status
                            </h3>
                            <p className="text-center text-blue-700">
                                A test drive request already exists for this quotation.
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">Current Status:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusModal.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' :
                                        statusModal.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                                            statusModal.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                statusModal.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    statusModal.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-800'
                                        }`}>
                                        {statusModal.status === 'REQUESTED' ? 'Requested' :
                                            statusModal.status === 'PENDING' ? 'Pending (Accepted)' :
                                                statusModal.status === 'APPROVED' ? 'Approved' :
                                                    statusModal.status === 'REJECTED' ? 'Rejected' :
                                                        statusModal.status === 'COMPLETED' ? 'Completed' : 'Unknown'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Remarks:</span>
                                    <p className="text-sm text-gray-700 mt-1">
                                        {statusModal.remark || 'No remarks available'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                                    onClick={() => {
                                        requestTestDrive(statusModal.row);
                                        setStatusModal({ show: false, status: null, remark: null, row: null });
                                    }}
                                >
                                    Request Again
                                </button>
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors"
                                    onClick={() => setStatusModal({ show: false, status: null, remark: null, row: null })}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default AllQuotation;