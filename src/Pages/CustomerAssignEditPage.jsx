import { useState, useEffect } from 'react';
import axios from 'axios';
import { modelOptions } from '../Components/quotation/staticQuotOptions';
import { useParams } from "react-router";
import getDate from "../utils/getDate"

const SearchIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const UserIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default function CustomerAssignEditPage() {
    const [searchPhone, setSearchPhone] = useState('');
    const [customer, setCustomer] = useState(null);
    const [caList, setCaList] = useState([]);
    const [formData, setFormData] = useState({ ca_name: '', model: '', exchange_id: '' , exchange_make: '',exchange_model: '', exchange_year: ''});
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [allotments, setAllotments] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [showExchange, setShowExchange] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        setSearchPhone(params.phone || '');
    }, []);

    const showStatus = (message, type) => {
        setStatus({ message, type });
        setTimeout(() => setStatus({ message: '', type: '' }), 5000);
    };

    const fetchDropdowns = async () => {
        try {
            const caRes = await axios.get('/sales/get-all-ca');
            setCaList(caRes.data.data || []);
        } catch {
            setStatus({ message: 'Failed to load dropdown data.', type: 'error' });
        }
    };

    const handleSearch = async () => {
        if (!searchPhone.trim() || searchPhone.length !== 10) {
            return setStatus({ message: 'Please enter a valid phone number', type: 'error' });
        }
        setLoading(true);
        setCustomer(null);
        try {
            const res = await axios.get(`/check-customer?phone=${searchPhone}`);
            if (res.data.success) {
                setCustomer(res.data.customer);
                setAllotments(res.data.allotments || []);
                const exData = (res.data.allotments || [])
                    .map(allot => allot.exchangeInfo)
                    .filter(ex => ex && ex.id != null);

                setExchanges(exData);
                console.log('fdsfg', exchanges)
                fetchDropdowns();
                showStatus('Customer found successfully!', 'success');
            } else {
                showStatus('Customer not found', 'error');
            }
        } catch {
            showStatus('Failed to fetch customer', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.ca_name || !formData.model || !customer?.id) {
            return setStatus({ message: 'Please fill all required fields.', type: 'error' });
        }
        if (showExchange) {
            if (!formData.exchange_make || !formData.exchange_model || !formData.exchange_year) {
                return setStatus({ message: 'Please fill all required fields.', type: 'error' });
            }
        }
        setLoading(true);
        try {
            const payload = {
                cxId: Number(customer.id),
                leadType: 'reception',
                exeName: userId,
                caName: formData.ca_name,
                model: formData.model,
                exchangeId: Number(formData.exchange_id) || null
            };

            // if adding a NEW exchange instead of selecting an existing one
            if (showExchange) {
                payload.new_exchange = {
                    vehicle_make: formData.exchange_make,
                    vehicle_model: formData.exchange_model,
                    year: Number(formData.exchange_year)
                };
            }

            const res = await axios.post('/create-allotment', payload);
            if (res.data.success) {
                showStatus('New allotment created successfully!', 'success');
                setFormData({
                    ca_name: '',
                    model: '',
                    exchange_id: '',
                    exchange_make: '',
                    exchange_model: '',
                    exchange_year: ''
                });
                setShowExchange(false);
                handleSearch();
                setSearchPhone('');
            } else {
                showStatus(res.data.message || 'Same allotment already exists.', 'error');
            }
        } catch {
            showStatus('Failed to create allotment.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'exchange_year' ? value.replace(/\D/g, '') : value // force numeric year
        }));
    };


    return (
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 min-h-screen mt-4 sm:mt-6 px-4 sm:px-6 lg:px-8">
            <div className="backdrop-blur-md bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">
                {/* Header */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl text-center font-bold text-black mb-6 sm:mb-8 lg:mb-10">
                    Edit Allotment
                </h1>

                {/* Search Section */}
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    Search Customer
                </h2>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter customer phone number"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full sm:w-auto sm:min-w-[120px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-xl backdrop-blur-sm"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span className="hidden sm:inline">Searching...</span>
                                <span className="sm:hidden">...</span>
                            </>
                        ) : (
                            <>
                                <SearchIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Search</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Status Message */}
                {status.message && (
                    <div className={`backdrop-blur-md p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 mt-4 ${status.type === 'success'
                        ? 'text-green-800'
                        : 'text-red-800'
                        }`}>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`w-3 h-3 rounded-full ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                                } animate-pulse`}></div>
                            <span className="font-medium text-sm sm:text-base">{status.message}</span>
                        </div>
                    </div>
                )}

                {/* Customer Details */}
                {customer && (
                    <div className="backdrop-blur-md bg-white/40 rounded-xl sm:rounded-2xl shadow-xl border border-white/30 overflow-hidden mt-6">
                        <div className="p-6 border-b border-white/30">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                <UserIcon className="w-5 h-5" />
                                Customer Details
                            </h2>

                            <div className="backdrop-blur-sm bg-white/30 rounded-lg p-4 border border-white/20">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Name</label>
                                        <p className="text-gray-800 font-semibold">{customer.name || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                                        <p className="text-gray-800 font-semibold">{customer.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Address</label>
                                        <p className="text-gray-800">{customer.address || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Allotments Table */}
                        {allotments.length > 0 && (
                            <div className="p-4 sm:p-6 border-b border-white/30">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-purple-600 font-bold text-xs sm:text-sm">A</span>
                                    </div>
                                    Allotments
                                </h3>

                                {/* Mobile Card View */}
                                <div className="block sm:hidden space-y-3">
                                    {allotments?.map(allot => (
                                        <div key={allot.ALOT_ID} className="backdrop-blur-sm bg-white/20 rounded-lg p-4 border border-white/20">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-600 text-sm">{allot.sales_advisor.username} ({allot.CA_NAME})</p>
                                                        <p className="text-gray-600 text-xs mt-1">{allot.MODEL}</p>
                                                        <p className="text-gray-400 text-xs mt-2">{getDate(allot.assignment_date)}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${allot.inactive
                                                        ? 'bg-red-100/60 text-red-800 border-red-200/50'
                                                        : 'bg-green-100/60 text-green-800 border-green-200/50'
                                                        }`}>
                                                        {allot.inactive ? 'Inactive' : 'Active'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Exchange: {allot.exchangeInfo !=null ? (
                                                        <span className="px-2 py-1 backdrop-blur-sm bg-blue-100/60 text-blue-800 rounded-full font-medium border border-blue-200/50">
                                                            {allot.exchangeInfo.vehicle_make} {allot.exchangeInfo.vehicle_model}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">No Exchange</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden sm:block overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead>
                                            <tr className="backdrop-blur-sm bg-white/20 border border-white/20">
                                                <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">CA Name</th>
                                                <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Model</th>
                                                <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Exchange Model</th>
                                                <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                                                <th className="text-left p-3 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Assignment Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allotments.map(allot => (
                                                <tr key={allot.ALOT_ID} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                                                    <td className="p-3 sm:p-4 font-medium text-gray-800 text-xs sm:text-sm">{allot.CA_NAME}</td>
                                                    <td className="p-3 sm:p-4 text-gray-700 text-xs sm:text-sm">{allot.MODEL}</td>
                                                    <td className="p-3 sm:p-4 text-gray-700 text-xs sm:text-sm">
                                                        {allot.exchangeInfo != null ? (
                                                            <span className="px-2 sm:px-3 py-1 backdrop-blur-sm bg-blue-100/60 text-blue-800 rounded-full text-xs font-medium border border-blue-200/50">
                                                                {allot.exchangeInfo.vehicle_make} {allot.exchangeInfo.vehicle_model}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 italic text-xs sm:text-sm">No Exchange</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 sm:p-4">
                                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${allot.inactive
                                                            ? 'bg-red-100/60 text-red-800 border-red-200/50'
                                                            : 'bg-green-100/60 text-green-800 border-green-200/50'
                                                            }`}>
                                                            {allot.inactive ? 'Inactive' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 sm:p-4 text-gray-700 text-xs sm:text-sm">{getDate(allot.assignment_date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Create New Assignment */}
                        <div className="p-4 sm:p-6 bg-gradient-to-r from-white/20 to-white/30">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Create New Assignment</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                        Select CA <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.ca_name}
                                        onChange={(e) => setFormData({ ...formData, ca_name: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                    >
                                        <option value="">Choose a CA...</option>
                                        {caList.map(ca => (
                                            <option key={ca.user_id} value={ca.user_id}>{ca.username}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                        Select Model <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                    >
                                        <option value="">Choose a model...</option>
                                        {modelOptions.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="lg:col-span-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                        Select Exchange (Optional)
                                    </label>
                                    <select
                                        value={formData.exchange_id}
                                        onChange={(e) => setFormData({ ...formData, exchange_id: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                    >
                                        <option value="">No Exchange</option>
                                        {exchanges.map(ex => (
                                            <option key={ex.id} value={ex.id}>
                                                {ex.vehicle_make} {ex.vehicle_model} ({ex.year})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2 mb-4">
                                    <div className="mb-2">
                                        <label className="inline-flex items-center cursor-default">
                                            <input
                                                type="checkbox"
                                                id="toggleExchange"
                                                checked={showExchange}
                                                onChange={() => {
                                                    setShowExchange((prev) => {
                                                        const newState = !prev;
                                                        if (!newState) {
                                                            // Clear exchange fields when hiding
                                                            setFormData((data) => ({
                                                                ...data,
                                                                exchange_make: '',
                                                                exchange_model: '',
                                                                exchange_year: '',
                                                            }));
                                                        }
                                                        return newState;
                                                    });
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-bold text-gray-700">Add new exchange</span>
                                        </label>
                                    </div>

                                    {showExchange && (
                                        <>
                                            <label className="block text-gray-700 text-sm font-bold mt-4">
                                                Vehicle Make <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="exchange_make"
                                                value={formData.exchange_make}
                                                onChange={handleChange}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter vehicle make"
                                                required
                                            />
                                            <label className="block text-gray-700 text-sm font-bold mt-4">
                                                Vehicle Model <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="exchange_model"
                                                value={formData.exchange_model}
                                                onChange={handleChange}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter vehicle model"
                                                required
                                            />
                                            <label className="block text-gray-700 text-sm font-bold mt-4">
                                                Vehicle Year <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="exchange_year"
                                                value={formData.exchange_year}
                                                onChange={handleChange}
                                                className={`shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter vehicle year"
                                                required
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.ca_name || !formData.model}
                                    className="w-full sm:w-auto sm:min-w-[160px] bg-green-700 hover:bg-green-800 disabled:bg-gray-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-xl backdrop-blur-sm"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span className="hidden sm:inline">Creating...</span>
                                            <span className="sm:hidden">...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">Create Assignment</span>
                                            <span className="sm:hidden">Create</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setCustomer(null);
                                        setFormData({ ca_name: '', model: '', exchange_id: '' });
                                        setSearchPhone('');
                                        setStatus({ message: '', type: '' });
                                        setAllotments([]);
                                        setExchanges([]);
                                    }}
                                    className="w-full sm:w-auto backdrop-blur-sm bg-white/40 hover:bg-white/60 active:bg-white/70 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm font-medium border border-white/40 hover:border-white/60 shadow-lg hover:shadow-xl"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}