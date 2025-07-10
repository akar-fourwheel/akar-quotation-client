import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceptionDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/reception/customer-list")
            .then(res => {
                setCustomers(res.data);
                console.log(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch customers:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl text-center font-bold mb-10 text-gray-800">
                Customer List
            </h1>

            {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    CX ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Address
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((cust, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cust.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cust.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cust.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex bg-gray-100 px-2 py-1 rounded-full text-xs font-medium ${cust.gender === 'F' ? 'text-pink-800' : 'text-blue-800'}`}>
                                            {cust.gender==='F'? 'Female' : 'Male'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cust.email || <span className="italic text-gray-400">N/A</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                                        <span title={cust.address}>{cust.address}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReceptionDashboard;