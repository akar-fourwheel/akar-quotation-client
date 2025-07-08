// src/Pages/TestDrivePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { modelOptions } from "../Components/quotation/staticQuotOptions";
import { TruckIcon } from "@heroicons/react/24/outline";

const DEFAULT_CA_ID = localStorage.getItem("userId") || "0";
const DEFAULT_CA_NAME = localStorage.getItem("username") || "Unknown CA";
const DEFAULT_ROLE = localStorage.getItem("role") || "sales";

const variantOptions = {
    "Sedan": ["Base", "Mid", "Top", "Premium"],
    "SUV": ["Base", "Mid", "Top", "Premium", "Limited"],
    "Hatchback": ["Base", "Mid", "Top"],
    "Coupe": ["Base", "Sport", "Premium"],
    "Convertible": ["Base", "Sport", "Limited"],
    "Truck": ["Base", "Mid", "Top", "Heavy Duty"],
    "Van": ["Base", "Mid", "Top", "Commercial"],
    "Wagon": ["Base", "Mid", "Top"],
    "Hybrid": ["Base", "Mid", "Top", "Eco"],
    "Electric": ["Base", "Mid", "Top", "Long Range"]
};

export default function BookTestDrivePage() {
    const [form, setForm] = useState({
        customerId: "",
        ca: DEFAULT_CA_ID,
        caName: DEFAULT_CA_NAME,
        model: "",
        variant: "",
        scheduleTime: "",
    });

    const [customerList, setCustomerList] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ text: "", ok: true });

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/customer-info', {
                params: {
                    role: localStorage.getItem("role"),
                    name: localStorage.getItem("userId"),
                }
            });
            setCustomerList(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setMsg({ text: "Failed to fetch customers", ok: false });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleChange = ({ target }) => {
        const newForm = { ...form, [target.name]: target.value };

        if (target.name === "model") {
            newForm.variant = "";
        }

        setForm(newForm);
    };

    const validate = () => {
        const e = {};
        if (!form.customerId) e.customerId = "Please select a customer";
        if (!form.model) e.model = "Please select a model";
        if (!form.variant) e.variant = "Please select a variant";
        if (!form.scheduleTime) e.scheduleTime = "Please select date & time";
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ text: "", ok: true });
        if (!validate()) return;

        setSubmitting(true);
        try {
            await axios.post(
                `/book-test-drive/${encodeURIComponent(form.caName)}`,
                form
            );
            setMsg({ text: "Test-drive booked successfully!", ok: true });
            setForm({ ...form, customerId: "", model: "", variant: "", scheduleTime: "" });
        } catch (err) {
            setMsg({ text: err.response?.data?.message || "Server error", ok: false });
        } finally {
            setSubmitting(false);
        }
    };

    const getAvailableVariants = () => {
        return variantOptions[form.model] || [];
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
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={form.caName}
                                                readOnly
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Customer <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="customerId"
                                            value={form.customerId}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.customerId ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select a customer</option>
                                            {customerList.map((c) => (
                                                <option key={c[0]} value={c[0]}>
                                                    {c[1]}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.customerId && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.customerId}
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
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.model ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select a model</option>
                                            {modelOptions.map((m) => (
                                                <option key={m} value={m}>
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
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.variant ? "border-red-500" : "border-gray-300"
                                                } ${!form.model ? "bg-gray-50 cursor-not-allowed" : ""}`}
                                        >
                                            <option value="">
                                                {form.model ? "Select a variant" : "Select model first"}
                                            </option>
                                            {getAvailableVariants().map((v) => (
                                                <option key={v} value={v}>
                                                    {v}
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
                                        <input
                                            type="datetime-local"
                                            name="scheduleTime"
                                            value={form.scheduleTime}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.scheduleTime ? "border-red-500" : "border-gray-300"
                                                }`}
                                        />
                                        {errors.scheduleTime && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.scheduleTime}
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
                                                <TruckIcon className="h-7 w-7 text-white mt-0.5"/>
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