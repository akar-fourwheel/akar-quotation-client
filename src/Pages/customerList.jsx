import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import axios from 'axios';
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';
import { showSuccess } from '../utils/toast';
import useDebounce from '../hooks/useDebounce';
import Pagination from '../Components/common/Pagination';

const CustomerList = () => {
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
    const [id, setId] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('customer'); // 'customer' or 'ca'
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const didMountRef = useRef(false);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            fetchCustomers(1);
        } else if (debouncedSearchTerm.trim() !== '') {
            fetchCustomers(1, debouncedSearchTerm, searchType);
        } else if (searchType !== 'customer' && searchTerm.trim() === '') {
            // handles if changing searchType with empty term
            fetchCustomers(1, '', searchType);
        }
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
                fetchCustomers(pagination.currentPage, debouncedSearchTerm, searchType);
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

    const getSerialNumber = (index) => {
        return (pagination.currentPage - 1) * pagination.limit + index + 1;
    };

    // Mobile card component for better mobile experience
    const MobileCustomerCard = ({ customer, index }) => (
        <div className="lg:hidden bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        #{getSerialNumber(index)}
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        customer.gender === 'F' ? 'text-pink-800 bg-pink-100' : 'text-blue-800 bg-blue-100'
                    }`}>
                        {customer.gender === 'F' ? 'Female' : 'Male'}
                    </span>
                </div>
                <span className="text-xs text-gray-500">ID: {customer.id}</span>
            </div>
            
            <div className="space-y-2">
                <div>
                    <span className="text-sm font-medium text-gray-900">{customer.name} <span className="pl-2 text-xs text-gray-500">Phone: {customer.phone}</span></span>
                </div>
                <div className="text-sm text-gray-600">
                   
                </div>
                {customer.email && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {customer.email}
                    </div>
                )}
                <div className="text-sm text-gray-600">
                    <span className="font-medium">CA:</span> {customer.username}
                </div>
                {customer.address && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Address:</span> {customer.address == "" ? <span className="italic text-gray-400">N/A</span> : customer.address}
                    </div>
                )}
                <div className="text-sm text-gray-600 flex items-center justify-end gap-2">
                    {customer.remark ? (
                        <button
                            onClick={() => openRemarkModal(customer.remark, customer.id)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            {role === roles.SALES ? 'Edit' : 'View'}
                        </button>
                    ) : (
                        role === roles.SALES ? 
                        <button 
                            onClick={() => openRemarkModal('', customer.id)} 
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Add Remark
                        </button> : 
                        <span className="italic text-gray-400 text-sm">No Remark</span>
                    )}
                </div>
                
                
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl sm:text-2xl lg:text-3xl text-center font-bold mb-4 sm:mb-6 lg:mb-10 text-gray-800">
                    Customer List
                </h1>

                {/* Search Section */}
                <div className="w-full mb-4 sm:mb-6 bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-3 sm:gap-4">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                        </div>
                        <div className="w-full sm:w-auto sm:min-w-[180px]">
                            <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-2">
                                Search Type
                            </label>
                            <select
                                id="searchType"
                                value={searchType}
                                onChange={handleSearchTypeChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            >
                                <option value="customer">Customer Name/Phone</option>
                                <option value="ca">CA Name</option>
                            </select>
                        </div>
                        {(searchTerm || debouncedSearchTerm) && (
                            <button
                                onClick={clearSearch}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm sm:text-base w-full sm:w-auto"
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
                    <div className="text-center text-gray-600 py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="mt-2">Loading...</div>
                    </div>
                ) : (
                    <div className="overflow-hidden shadow rounded-lg bg-white">
                        {customers.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <div className="text-4xl sm:text-6xl mb-4">📋</div>
                                <div className="text-lg sm:text-xl font-medium mb-2">
                                    {debouncedSearchTerm ? 'No customers found' : 'No customers available'}
                                </div>
                                <div className="text-sm sm:text-base text-gray-400">
                                    {debouncedSearchTerm ? 'Try adjusting your search criteria.' : 'Customer data will appear here when available.'}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Mobile view - Cards */}
                                <div className="block lg:hidden">
                                    <div className="p-4">
                                        <div className="text-sm text-gray-600 mb-4">
                                            Showing {customers.length} of {pagination.totalCount} customers
                                        </div>
                                        {customers.map((customer, index) => (
                                            <MobileCustomerCard 
                                                key={customer.id || index} 
                                                customer={customer} 
                                                index={index} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop view - Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                {["S.No", "CX ID", "Name", "Phone", "Gender", "Email", "CA Name", "Address", "Remark"].map((heading) => (
                                                    <th key={heading} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {heading}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {customers.map((cust, index) => (
                                                <tr key={cust.id || index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {getSerialNumber(index)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cust.id}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{cust.name}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cust.phone}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                            cust.gender === 'F' ? 'text-pink-800 bg-pink-100' : 'text-blue-800 bg-blue-100'
                                                        }`}>
                                                            {cust.gender === 'F' ? 'Female' : 'Male'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {cust.email || <span className="italic text-gray-400">N/A</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{cust.username}</td>
                                                    <td className="px-4 py-3 max-w-[12rem] text-sm text-gray-900">
                                                        <div className="truncate" title={cust.address}>{cust.address}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {cust.remark ? (
                                                            <button
                                                                onClick={() => openRemarkModal(cust.remark, cust.id)}
                                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                            >
                                                                {role === roles.SALES ? 'Edit' : 'View'}
                                                            </button>
                                                        ) : (
                                                            role === roles.SALES ? 
                                                            <button 
                                                                onClick={() => openRemarkModal('', cust.id)} 
                                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                            >
                                                                Add Remark
                                                            </button> : 
                                                            <span className="italic text-gray-400">No Remark</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                    itemsPerPage={pagination.limit}
                                    totalItems={pagination.totalCount}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Enhanced Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Customer Remark</h3>
                            <button 
                                onClick={closeModal} 
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4 sm:p-6">
                            {role === roles.SALES ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remark
                                    </label>
                                    <textarea 
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[120px]" 
                                        value={selectedRemark} 
                                        onChange={(e) => setSelectedRemark(e.target.value)}
                                        placeholder="Enter your remark here..."
                                        rows={4}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remark
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-md border">
                                        <p className="text-gray-800">{selectedRemark || "No remark available."}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                            {role === roles.SALES && (
                                <button 
                                    onClick={handleSaveRemark} 
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            )}
                            <button 
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                {role === roles.SALES ? 'Cancel' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;