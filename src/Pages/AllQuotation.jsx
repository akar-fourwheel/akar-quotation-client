import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';

function AllQuotation() {
    const navigate = useNavigate();
    const [quotaData, setQuotaData] = useState([]);
    const { role, username } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [salesFilter, setSalesFilter] = useState('');
    const [uniqueCas, setUniqueCas] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalData, setModalData] = useState({ show: false, success: false, message: '', model: '' });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 25,
        hasNextPage: false,
        hasPreviousPage: false
    });

    // Ref for the operations panel
    const operationsPanelRef = useRef(null);

    const handleBooking = () => {
        if (!selectedRow) return;
        const quoteID = selectedRow[0];
        navigate(`/booking-form/${quoteID}`);
    };

    const handleTestDrive = async () => {
        if (!selectedRow) return;

        try {
            const variant = selectedRow[4].split(" ")[0];
            const model = await fetchDemoCar(variant);
            if (model) {
                const formData = {
                    customerName: selectedRow[3],
                    phoneNumber: selectedRow[7],
                    salesPerson: selectedRow[2],
                    model: model.model,
                    status: 0
                }

                const payload = new FormData();
                for (const key in formData) {
                    payload.append(key, formData[key]);
                }

                const detailsResponse = await axios.post(`/test-drive/out`, payload);

                if (detailsResponse.status === 200) {
                    setModalData({
                        show: true,
                        success: true,
                        message: 'Test drive request sent successfully!',
                        model: model.model
                    });
                } else {
                    setModalData({
                        show: true,
                        success: false,
                        message: 'Failed to send test drive request.',
                        model: variant
                    });
                }
            } else {
                setModalData({
                    show: true,
                    success: false,
                    message: 'No available demo car found for this variant.',
                    model: variant
                });
            }
        } catch (error) {
            console.error("Error in requesting test drive:", error);
            setModalData({
                show: true,
                success: false,
                message: 'An error occurred while processing your request.',
                model: selectedRow[4].split(" ")[0]
            });
        }
    }

    const handleOpenPDF = () => {
        if (!selectedRow) return;
        window.open(selectedRow[5], '_blank');
    };

    const handleSendWhatsApp = () => {
        if (!selectedRow) return;
        window.location.href = selectedRow[6];
    };

    const closeModal = () => {
        setModalData({ ...modalData, show: false });
    };

    // Function to close the operations panel
    const closeOperationsPanel = () => {
        setSelectedRow(null);
    };

    // Handle clicks outside the operations panel
    useEffect(() => {
        function handleClickOutside(event) {
            if (operationsPanelRef.current && !operationsPanelRef.current.contains(event.target)) {
                closeOperationsPanel();
            }
        }

        // Add event listener when the panel is open
        if (selectedRow) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedRow]);

    const fetchDemoCar = async (model) => {
        try {
            const response = await axios.get('/test-drive');
            const jsonData = response.data
            const matchedCar = jsonData.joined.data.find(
                car => car.status === 'Available' && car.model === model
            );

            if (matchedCar) {
                return ({ 'model': matchedCar.model, 'id': matchedCar.id });
            } else {
                return
            }
        }
        catch (e) {
            console.log("Error fetching Demo Vehicle data:", e);
        }
    }

    const fetchQuotations = async (page) => {
        try {
            let response;
            if (role === roles.ADMIN || role === roles.MD) {
                if (salesFilter !== '') {
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
                        params: { role, page, limit: 25 }
                    });
                    setUniqueCas([...new Set(response.data.data.map(ca => ca[2]))]);
                }
            } else if (role === roles.SALES) {
                response = await axios.get(`/my-quotation`, {
                    params: {
                        name: username,
                        role,
                        page,
                        limit: 25
                    }
                });
            } else if (role == roles.TEAML) {
                response = await axios.get("/teamLead/quotations", {
                    params: {
                        name: username,
                        role,
                        page,
                        limit: 25,
                    }
                })
            }

            if (response?.data) {
                setQuotaData(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (e) {
            console.log("Error fetching quotation data:", e);
        }
    };

    useEffect(() => {
        fetchQuotations(currentPage);
    }, [currentPage, role, quotaData]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSelectedRow(null); // Clear selection when changing page
        window.scrollTo(0, 0);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row === selectedRow ? null : row);
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
        <div className={`container mx-auto w-half p-2 md:p-6 ${selectedRow ? 'relative' : ''}`}>
            {/* Backdrop with blur effect when operations panel is open */}
            {selectedRow && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10" onClick={closeOperationsPanel}></div>
            )}

            {/* Test Drive Status Modal */}
            {modalData.show && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className={`text-center ${modalData.success ? 'text-green-600' : 'text-red-600'}`}>
                            <svg
                                className={`mx-auto h-12 w-12 ${modalData.success ? 'text-green-500' : 'text-red-500'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {modalData.success ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                )}
                            </svg>
                            <h3 className="mt-4 text-lg font-medium">
                                {modalData.success ? 'Success!' : 'Request Failed'}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {modalData.message}
                            </p>
                            {modalData.model && (
                                <p className="mt-1 text-sm text-gray-500">
                                    Model: {modalData.model}
                                </p>
                            )}
                        </div>
                        {!modalData.success && (
                            <div className="mt-6">
                                <Link to='/test-drive'>
                                    <button
                                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                                    >
                                        Available Vehicles
                                    </button>
                                </Link>
                            </div>
                        )}
                        <div className={modalData.success ? "mt-6" : "mt-2"}>
                            <button
                                onClick={closeModal}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 uppercase">All Quotation Data</h2>

            {/* Operations Panel */}
            {selectedRow && (
                <div
                    ref={operationsPanelRef}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white py-4 px-4 rounded-lg shadow-md z-20 border border-gray-200 max-w-md w-full"
                >
                    {/* Close button */}
                    <button
                        onClick={closeOperationsPanel}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col items-center justify-between mb-4">
                        <div className="mb-4 text-sm text-center">
                            <span className="font-semibold">Selected:</span> {selectedRow[3]} - {selectedRow[4]}
                        </div>

                        {/* 2x2 Button Grid */}
                        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-64 h-26">
                            <button
                                onClick={handleOpenPDF}
                                className="bg-rose-400 text-white hover:bg-rose-500 text-sm rounded-lg flex items-center justify-center"
                            >
                                View PDF
                            </button>
                            <button
                                onClick={handleSendWhatsApp}
                                className="bg-green-500 text-white hover:bg-green-600 text-sm rounded-lg flex items-center justify-center"
                            >
                                WhatsApp
                            </button>
                            <button
                                onClick={handleBooking}
                                className="bg-blue-500 text-white hover:bg-blue-600 text-sm rounded-lg flex items-center justify-center"
                            >
                                Book
                            </button>
                            <button
                                onClick={handleTestDrive}
                                className="bg-yellow-500 text-white hover:bg-yellow-600 text-sm rounded-lg flex items-center justify-center"
                            >
                                Test Drive
                            </button>
                        </div>
                    </div>

                </div>
            )}

            <div className="overflow-x-auto">
                {(quotaData.length > 0 && localStorage.role === roles.ADMIN || localStorage.role === roles.MD) && (
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

                {quotaData.length > 0 && (
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-sm md:text-md font-medium text-gray-700">Created_on</th>
                                <th className="px-2 py-2 text-left text-sm md:text-md font-medium text-gray-700">Unique_ID</th>
                                {role !== roles.SALES && (
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sales_Person</th>
                                )}
                                <th className="px-4 py-2 text-left text-sm md:text-md font-medium text-gray-700">Customer_Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Variant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotaData?.map((row, index) => (
                                <tr
                                    key={index}
                                    className={`border-b hover:bg-gray-50 cursor-pointer ${selectedRow === row ? 'bg-blue-50' : ''}`}
                                    onClick={() => handleRowClick(row)}
                                >
                                    <td className="px-4 py-2 text-xs md:text-md text-gray-900">{setToIst(row[1])}</td>
                                    <td className="px-2 py-2 text-xs md:text-md text-gray-900">{row[0]}</td>
                                    {role !== roles.SALES && (
                                        <td className="px-4 py-2 text-xs md:text-sm text-gray-900">{row[2]}</td>
                                    )}
                                    <td className="px-4 py-2 text-sm text-gray-900">{row[3]}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{row[4]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="text-xs flex flex-wrap gap-2 justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination?.hasPreviousPage}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Previous
                </button>

                {/* First Page */}
                <button
                    onClick={() => handlePageChange(1)}
                    className={`px-3 py-1 rounded-lg ${currentPage === 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    1
                </button>

                {/* Leading Ellipsis */}
                {currentPage > 4 && <span className="px-2">...</span>}

                {/* Middle Pages */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) =>
                        page === currentPage ||
                        page === currentPage - 1 ||
                        page === currentPage + 1
                    )
                    .map((page) => (
                        page !== 1 && page !== pagination.totalPages && (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-lg ${currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                {/* Trailing Ellipsis */}
                {currentPage < pagination.totalPages - 3 && <span className="px-2">...</span>}

                {/* Last Page */}
                {pagination.totalPages > 1 && (
                    <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className={`px-3 py-1 rounded-lg ${currentPage === pagination.totalPages
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {pagination.totalPages}
                    </button>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination?.hasNextPage}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    );
}

export default AllQuotation;