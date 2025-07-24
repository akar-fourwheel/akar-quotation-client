// src/Pages/TestDrivePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { TruckIcon } from "@heroicons/react/24/outline";

const DEFAULT_CA_ID = localStorage.getItem("userId") || "0";
const DEFAULT_CA_NAME = localStorage.getItem("username") || "Unknown CA";
const DEFAULT_ROLE = localStorage.getItem("role") || "sales";

export default function BookTestDrivePage() {
    const [form, setForm] = useState({
        cxID: '',
        sales_person_id: DEFAULT_CA_ID,
        requested_by: DEFAULT_CA_NAME,
        model: "",
        variant: "",
        scheduledDateTime: "",
    });

    const [customerList, setCustomerList] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ text: "", ok: true });
    const [demoVehicles, setDemoVehicles] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('/customer-info', {
                    params: {
                        role: DEFAULT_ROLE,
                        name: DEFAULT_CA_ID,
                    }
                });
                setCustomerList(response.data.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setMsg({ text: "Failed to fetch customers", ok: false });
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await axios.get('/test-drive/get-demo-vehicles');
                setDemoVehicles(res.data.rows || []);
            } catch (err) {
                console.error('Failed to fetch demo vehicles', err);
            }
        };
        fetchModels();
    }, []);

    const parentProducts = Array.from(
        new Set(demoVehicles.map(v => v.parent_product))
    );

    const availableVariants = demoVehicles
        .filter(v => v.parent_product === form.model)
        .map(v => ({ id: v.id, model: v.model }));

    const handleChange = ({ target }) => {
        const newForm = { ...form, [target.name]: target.value };
        if (target.name === "model") {
            newForm.variant = "";
        }
        setForm(newForm);
    };
    const handleDateChange = (newDate) => {
        const timePart = form.scheduledDateTime?.split('T')[1] || '00:00';
        setForm({ ...form, scheduledDateTime: `${newDate}T${timePart}` });
    };

    const handleTimeChange = (newTime) => {
        const datePart = form.scheduledDateTime?.split('T')[0] || new Date().toISOString().split('T')[0];
        setForm({ ...form, scheduledDateTime: `${datePart}T${newTime}` });
    };
    const validate = () => {
        const e = {};
        if (!form.cxID) e.cxID = "Please select a customer";
        if (!form.model) e.model = "Please select a model";
        if (!form.variant) e.variant = "Please select a variant";
        if (!form.scheduledDateTime) e.scheduledDateTime = "Please select date & time";
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ text: "", ok: true });
        if (!validate()) return;

        setSubmitting(true);
        try {
            await axios.post('/test-drive/request', form);
            setMsg({ text: "Test-drive booked successfully!", ok: true });
            setForm({ ...form, cxID: "", model: "", variant: "", scheduledDateTime: "" });

            setTimeout(() => {
                setMsg({ text: "", ok: true });
            }, 3000);
        } catch (err) {
            setMsg({ text: err.response?.data?.message || "Server error", ok: false });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Schedule Test Drive
                    </h1>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Test Drive Booking</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Loading customers...</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                {msg.text && (
                                    <div
                                        className={`p-4 rounded-lg text-center font-medium transition-all duration-300 ${msg.ok
                                            ? "bg-green-50 text-green-800 border border-green-200"
                                            : "bg-red-50 text-red-800 border border-red-200"
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {msg.ok ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                            {msg.text}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Customer Advisor
                                        </label>
                                        <input
                                            type="text"
                                            value={form.requested_by}
                                            readOnly
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed focus:outline-none"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Customer <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="cxID"
                                            value={form.cxID}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg ${errors.cxID ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        >
                                            <option value="">Select a customer</option>
                                            {customerList.length > 0 && customerList.map((c, idx) => (
                                                <option key={`${c.id}-${idx}`} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.cxID && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.cxID}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Model <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="model"
                                            value={form.model}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg ${errors.model ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        >
                                            <option value="">Select a model</option>
                                            {parentProducts.map((m, idx) => (
                                                <option key={`${m}-${idx}`} value={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.model && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.model}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Variant <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="variant"
                                            value={form.variant}
                                            onChange={handleChange}
                                            disabled={!form.model}
                                            className={`w-full px-4 py-3 border rounded-lg ${errors.variant ? "border-red-500" : "border-gray-300"} ${!form.model ? "bg-gray-50 cursor-not-allowed" : ""} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        >
                                            <option value="">
                                                {form.model ? "Select a variant" : "Select model first"}
                                            </option>
                                            {availableVariants.map((v) => (
                                                <option key={v.id} value={v.model}>
                                                    {v.model}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.variant && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.variant}
                                            </p>
                                        )}
                                    </div>

                                        <div className="lg:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Schedule Date & Time <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <input
                                                    type="date"
                                                    value={form.scheduledDateTime?.split('T')[0] || ''}
                                                    onChange={(e) => handleDateChange(e.target.value)}
                                                    className={`w-full sm:w-1/2 px-4 py-3 border rounded-lg 
                                                    ${errors.scheduledDateTime ? "border-red-500" : "border-gray-300"} 
                                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                                                                        />
                                                <input
                                                    type="time"
                                                    value={form.scheduledDateTime?.split('T')[1] || ''}
                                                    onChange={(e) => handleTimeChange(e.target.value)}
                                                    className={`w-full sm:w-1/2 px-4 py-3 border rounded-lg 
                                                    ${errors.scheduledDateTime ? "border-red-500" : "border-gray-300"} 
                                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                                />
                                            </div>
                                            {errors.scheduledDateTime && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.scheduledDateTime}
                                                </p>
                                            )}
                                        </div>

                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg transform shadow-lg"
                                    >
                                        {submitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Booking Test Drive...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <TruckIcon className="h-7 w-7 text-white mt-0.5" />
                                                <span>Book Test Drive</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
