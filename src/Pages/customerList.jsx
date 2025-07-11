import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';
import { useContext } from 'react';
import { showSuccess } from '../utils/toast';
import useDebounce from '../hooks/useDebounce';

const ReceptionDashboard = () => {
    const { role } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRemark, setSelectedRemark] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('customer'); // 'customer' or 'ca'
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const didMountRef = useRef(false);

    useEffect(() => {
        if (!didMountRef.current) {
            if (!searchTerm) {
                fetchCustomers(1);
            }
            didMountRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (!didMountRef.current) return;
        // Only fetch if debounced term matches current term
        if (debouncedSearchTerm !== searchTerm) return;
        // If search term is empty, fetch all customers
        if (!debouncedSearchTerm) {
            fetchCustomers(1);
            setCurrentPage(1);
            return;
        }
        fetchCustomers(1, debouncedSearchTerm, searchType);
        setCurrentPage(1);
    }, [debouncedSearchTerm, searchType]);

    const fetchCustomers = async (page = 1, searchTerm = '', searchType = 'customer') => {
        setLoading(true);
        try {
            let url = `/customer-list?page=${page}&limit=10`;
            
            if (searchTerm.trim()) {
                url += `&search=${encodeURIComponent(searchTerm)}&searchType=${searchType}`;
            }
            
            const response = await axios.get(url);
            setCustomers(response.data.customers || []);
            setPagination(response.data.pagination || {});
            setCurrentPage(page);
        } catch (err) {
            console.error("Failed to fetch customers:", err);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchTerm(''); // Reset search term when changing type
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchType('customer');
        fetchCustomers(1);
    };

    const openRemarkModal = (remark, id) => {
        setSelectedRemark(remark);
        setId(id);
        setShowModal(true);
    };

    const handleSaveRemark = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/update-remark`, { id: id, remark: selectedRemark });
            if(response.status === 200){
                showSuccess("Remark updated successfully");
                closeModal();
                fetchCustomers(currentPage, debouncedSearchTerm, searchType);
            }
        } catch (err) {
            console.error("Failed to update remark:", err);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRemark('');
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchCustomers(newPage, debouncedSearchTerm, searchType);
        }
    };

    const renderPagination = () => {
        if (pagination.totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex justify-between flex-1 sm:hidden">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * pagination.limit, pagination.totalCount)}
                            </span>{' '}
                            of <span className="font-medium">{pagination.totalCount}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {pages.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        page === currentPage
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <h1 className="text-2xl text-center font-bold mb-6 md:mb-10 text-gray-800">
                Customer List
            </h1>

            {/* Search Section */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder={
                                searchType === 'customer' 
                                    ? "Search by customer name or phone..." 
                                    : "Search by CA name..."
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="min-w-[180px]">
                        <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-2">
                            Search Type
                        </label>
                        <select
                            id="searchType"
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="customer">Customer Name/Phone</option>
                            <option value="ca">CA Name</option>
                        </select>
                    </div>
                    {(searchTerm || debouncedSearchTerm) && (
                        <button
                            onClick={clearSearch}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
                {searchTerm && searchTerm !== debouncedSearchTerm && (
                    <div className="mt-2 text-sm text-gray-500">
                        Searching...
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
            ) : (
                <div className="overflow-hidden shadow rounded-lg bg-white">
                    {customers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {debouncedSearchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {["CX ID", "Name", "Phone", "Gender", "Email", "CA Name", "Address", "Remark"].map((heading) => (
                                                <th key={heading} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {customers.map((cust, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap">{cust.id}</td>
                                                <td className="px-4 py-3">{cust.name}</td>
                                                <td className="px-4 py-3">{cust.phone}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${cust.gender === 'F' ? 'text-pink-800 bg-pink-100' : 'text-blue-800 bg-blue-100'}`}>
                                                        {cust.gender === 'F' ? 'Female' : 'Male'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{cust.email || <span className="italic text-gray-400">N/A</span>}</td>
                                                <td className="px-4 py-3">{cust.username}</td>
                                                <td className="px-4 py-3 max-w-[10rem] truncate" title={cust.address}>{cust.address}</td>
                                                <td className="px-4 py-3">
                                                    {cust.remark ? (
                                                        <button
                                                            onClick={() => openRemarkModal(cust.remark, cust.id)}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {role === roles.SALES ? 'Edit' : 'View'}
                                                        </button>
                                                    ) : (
                                                        role === roles.SALES ? <button onClick={() => openRemarkModal('', cust.id)} className="text-blue-600 hover:underline">Add Remark</button> : <span className="italic text-gray-400">No Remark</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {renderPagination()}
                        </>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/20 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Customer Remark</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
                        </div>
                        <div className="p-4 text-gray-700">
                            {role === roles.SALES ? <textarea className="w-full p-2 border border-gray-300 rounded-md" value={selectedRemark} onChange={(e) => setSelectedRemark(e.target.value)} /> : <p>{selectedRemark}</p>}
                        </div>
                        <div className="p-4 border-t border-gray-200 text-right flex justify-end gap-2">
                            {role === roles.SALES ? <button onClick={handleSaveRemark} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                {loading ? 'Saving...' : 'Save'}
                            </button> : null}
                            <button onClick={closeModal} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionDashboard;