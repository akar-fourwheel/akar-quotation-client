import { useState, useEffect } from 'react';
import axios from 'axios';
import { modelOptions } from '../Components/quotation/staticQuotOptions';

const EditIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3zM5 19h14"
        />
    </svg>
);

const SearchIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
);

const UserIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
    </svg>
);


export default function CustomerAssignEditPage() {
    const [searchPhone, setSearchPhone] = useState('');
    const [customer, setCustomer] = useState(null);
    const [caList, setCaList] = useState([]);
    const [formData, setFormData] = useState({ ca_name: '', model: '' });
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const showStatus = (message, type) => {
        setStatus({ message, type });
        setTimeout(() => {
            setStatus({ message: '', type: '' });
        }, 7000);
    };

    const fetchDropdowns = async () => {
        try {
            const caRes = await axios.get('/leads/ca-list?query=onlyCA');
            setCaList(caRes.data || []);
        } catch (err) {
            setStatus({ message: 'Failed to load dropdown data.', type: 'error' });
        }
    };

    const handleSearch = async () => {
        if (!searchPhone.trim()) {
            setStatus({ message: 'Please enter a phone number', type: 'error' });
            return;
        }
        if (searchPhone.length !== 10) {
            setStatus({ message: 'Please enter a valid phone', type: 'error' });
            return;
        }
        setLoading(true);
        setCustomer(null);
        setStatus({ message: '', type: '' });

        try {
            const res = await axios.get(`/check-customer?phone=${searchPhone}`);
            const jsonData = res.data.data;
            if (res.data.success) {
                setCustomer(jsonData[0]);
                setStatus({ message: 'Customer found successfully!', type: 'success' });
            } else {
                setStatus({ message: 'Customer not found', type: 'error' });
            }
        } catch (err) {
            setStatus({ message: 'Failed to fetch customer', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.ca_name || !formData.model || !customer?.id) {
            return setStatus({ message: 'Please fill all fields.', type: 'error' });
        }
        
        setLoading(true);
        try {
            const res = await axios.post('/create-allot', {
                cx_id: customer.id,
                lead_type: 'reception',
                exe_name: userId,
                ca_name: formData.ca_name,
                model: formData.model
            });
            
            if(res.data.success){
                showStatus('New allotment created successfully!', 'success' || res.data.message);
                setCustomer(null);
                setFormData({ ca_name: '', model: '' });
                setSearchPhone('');  
            }else{
                showStatus(res.data.message || ('Same allotment already exists.', 'error'));
                setCustomer(null);
                setFormData({ ca_name: '', model: '' });
                setSearchPhone(''); 
            }           
        } catch (err) {
            setStatus({ message: 'Failed to create allotment.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
            <div className="max-w-4xl mx-auto space-y-6 min-h-screen mt-6">
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 shadow-xl border border-white/20">
                    <h1 className="text-2xl sm:text-3xl text-center font-bold text-black mb-10">
                        Edit Allotment
                    </h1>

                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
                        <SearchIcon className="w-5 h-5" />
                        Search Customer
                    </h2>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchPhone}
                                onChange={(e) => setSearchPhone(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter customer phone number"
                                className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 placeholder-gray-500"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="w-full sm:w-auto sm:min-w-[120px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-xl backdrop-blur-sm"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <SearchIcon className="w-4 h-4" />
                                    Search
                                </>
                            )}
                        </button>
                    </div>

                {status.message && (
                    <div className={`backdrop-blur-md p-4 rounded-xl transition-all duration-300 ${status.type === 'success'
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                                } animate-pulse`}></div>
                            <span className="font-medium">{status.message}</span>
                        </div>
                    </div>
                )}

                {customer && (
                    <div className="backdrop-blur-md bg-white/40 rounded-2xl shadow-xl border border-white/30 overflow-hidden">
                        <div className="p-6 border-b border-white/30">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                <UserIcon className="w-5 h-5" />
                                Customer Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="backdrop-blur-sm bg-white/30 rounded-lg p-4 border border-white/20">
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Name</label>
                                        <p className="text-gray-800 font-semibold">{customer.name || '-'}</p>
                                    </div>
                                    <div className="backdrop-blur-sm bg-white/30 rounded-lg p-4 border border-white/20">
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                                        <p className="text-gray-800 font-semibold">{customer.phone || '-'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="backdrop-blur-sm bg-white/30 rounded-lg p-4 border border-white/20">
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Address</label>
                                        <p className="text-gray-800">{customer.address || '-'}</p>
                                    </div>
                                    <div className="backdrop-blur-sm bg-white/30 rounded-lg p-4 border border-white/20">
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Current CA</label>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-blue-800 border border-blue-200/50 backdrop-blur-sm">
                                            {customer.ca_username}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-r from-white/20 to-white/30">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Create New Assignment</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select CA <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.ca_name}
                                        onChange={(e) => setFormData({ ...formData, ca_name: e.target.value })}
                                        className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                        >
                                        <option value="">Choose a CA...</option>
                                        {caList.map(ca => (
                                            <option key={ca[0]} value={ca[0]}>{ca[1]}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Model <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                        >
                                        <option value="">Choose a model...</option>
                                        {modelOptions.map(model => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.ca_name || !formData.model}
                                    className="w-full sm:w-auto sm:min-w-[160px] bg-green-700 hover:bg-green-800 disabled:bg-gray-500 text-white px-8 py-3 rounded-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:shadow-xl backdrop-blur-sm"
                                    >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Assignment
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setCustomer(null);
                                        setFormData({ ca_name: '', model: '' });
                                        setSearchPhone('');
                                        setStatus({ message: '', type: '' });
                                    }}
                                    className="backdrop-blur-sm bg-white/40 hover:bg-white/60 active:bg-white/70 text-gray-700 px-8 py-3 rounded-xl transition-all duration-300 text-sm font-medium border border-white/40 hover:border-white/60 shadow-lg hover:shadow-xl"
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