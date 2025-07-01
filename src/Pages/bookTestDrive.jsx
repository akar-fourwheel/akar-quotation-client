// src/Pages/TestDrivePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { modelOptions } from "../Components/quotation/staticQuotOptions";

/* ------------------------------------------------------------------
   Get the logged-in CA’s details from localStorage (or anywhere you store
   session info).  Adjust the keys if yours differ.
   ------------------------------------------------------------------ */
const DEFAULT_CA_ID = localStorage.getItem("userId") || "0";
const DEFAULT_CA_NAME = localStorage.getItem("username") || "Unknown CA";
const DEFAULT_ROLE = localStorage.getItem("role") || "sales";

export default function BookTestDrivePage() {
    /* ------------- state ------------- */
    const [form, setForm] = useState({
        customerId: "",
        ca: DEFAULT_CA_ID,    // we still keep the id for backend use
        caName: DEFAULT_CA_NAME,  // used in POST URL
        model: "",
        scheduleTime: "",
    });

    const [customerList, setCustomerList] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ text: "", ok: true });

    /* ------------- helper: fetch customers for this CA ------------- */
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
            setLoading(false);  // 👈 IMPORTANT: this was missing
        }
    };
    

    useEffect(() => {
        fetchCustomers();
    }, []);

    /* ------------- generic change handler ------------- */
    const handleChange = ({ target }) =>
        setForm((p) => ({ ...p, [target.name]: target.value }));

    /* ------------- validation ------------- */
    const validate = () => {
        const e = {};
        if (!form.customerId) e.customerId = "Select customer";
        if (!form.model) e.model = "Select model";
        if (!form.scheduleTime) e.scheduleTime = "Pick date & time";
        setErrors(e);
        return !Object.keys(e).length;
    };

    /* ------------- submit ------------- */
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
            setMsg({ text: "Test-drive booked!", ok: true });
            // reset user-editable fields
            setForm({ ...form, customerId: "", model: "", scheduleTime: "" });
        } catch (err) {
            setMsg({ text: err.response?.data?.message || "Server error", ok: false });
        } finally {
            setSubmitting(false);
        }
    };

    /* ------------- UI ------------- */
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <div className="bg-white shadow-lg rounded-lg">
                    {/* header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg px-6 py-4">
                        <h2 className="text-center text-2xl font-bold flex items-center gap-2">
                            <i className="fas fa-car-side" /> Schedule Test-Drive
                        </h2>
                    </div>

                    {/* body */}
                    <div className="p-6 sm:p-8">
                        {loading ? (
                            <p className="text-center py-10">Loading customers…</p>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                {/* banner */}
                                {msg.text && (
                                    <div
                                        className={`p-4 mb-6 rounded text-center font-medium ${msg.ok
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* CA name (read-only) */}
                                    <div>
                                        <label className="block text-sm font-bold mb-1">CA</label>
                                        <input
                                            type="text"
                                            value={form.caName}
                                            readOnly
                                            className="border p-2 w-full bg-gray-100 text-gray-700 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Customer dropdown */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-1">Customer *</label>
                                        <select
                                            name="customerId"
                                            value={form.customerId}
                                            onChange={handleChange}
                                            className={`border p-2 w-full ${errors.customerId && "border-red-500"}`}
                                        >
                                            <option value="">Select customer</option>
                                            {customerList.map((c) => (
                                                <option key={c[0]} value={c[0]}>
                                                    {c[1]}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.customerId && (
                                            <p className="text-xs text-red-500">{errors.customerId}</p>
                                        )}
                                    </div>

                                    {/* Model dropdown */}
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Model *</label>
                                        <select
                                            name="model"
                                            value={form.model}
                                            onChange={handleChange}
                                            className={`border p-2 w-full ${errors.model && "border-red-500"}`}
                                        >
                                            <option value="">Select model</option>
                                            {modelOptions.map((m) => (
                                                <option key={m} value={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
                                    </div>

                                    {/* Schedule datetime */}
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Schedule Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="scheduleTime"
                                            value={form.scheduleTime}
                                            onChange={handleChange}
                                            className={`border p-2 w-full ${errors.scheduleTime && "border-red-500"}`}
                                        />
                                        {errors.scheduleTime && (
                                            <p className="text-xs text-red-500">{errors.scheduleTime}</p>
                                        )}
                                    </div>
                                </div>

                                {/* submit */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:bg-blue-300 flex items-center"
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full" />
                                                Saving…
                                            </>
                                        ) : (
                                            "Book Test-Drive"
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
