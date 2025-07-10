import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceptionDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRemark, setSelectedRemark] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get("/reception/customer-list")
            .then(res => {
                setCustomers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch customers:", err);
                setLoading(false);
            });
    }, []);

    const openRemarkModal = (remark) => {
        setSelectedRemark(remark);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRemark('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <h1 className="text-2xl text-center font-bold mb-6 md:mb-10 text-gray-800">
                Customer List
            </h1>

            {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg bg-white">
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
                                                onClick={() => openRemarkModal(cust.remark)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </button>
                                        ) : (
                                            <span className="italic text-gray-400">No Remark</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                            <p>{selectedRemark}</p>
                        </div>
                        <div className="p-4 border-t border-gray-200 text-right">
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