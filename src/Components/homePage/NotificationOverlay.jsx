import { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const NotificationOverlay = ({ onClose }) => {

    const [bookingData, setBookingData] = useState([]);
    const [filter, setFilter] = useState("arrived");
    const modalRef = useRef();

    const filteredData = 
        bookingData.filter((entry) => entry[8] === filter && (entry[1]!=null && entry[2]!=null && entry[4]!=null))
        .sort((a, b) => new Date(b[7].slice(5,14)) - new Date(a[7].slice(5,14)));

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        axios.get('/booking-notification')
            .then((response) => {
                setBookingData(response.data);

            })
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col relative p-6"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4">
                    <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                </button>

                {/* Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex rounded-xl overflow-hidden border border-gray-300">
                        <button
                            onClick={() => setFilter("arrived")}
                            className={`px-6 py-3 font-medium border-l border-gray-300 ${filter === "arrived"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            Arrived
                        </button>
                        <button
                            onClick={() => setFilter("requested")}
                            className={`px-6 py-3 font-medium ${filter === "requested"
                                    ? "bg-amber-400 text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            Requested
                        </button>
                    </div>
                </div>


                {/* List of Entries */}
                <div className="overflow-y-auto space-y-4">
                    {filteredData.length === 0 && (
                        <div className="text-center text-gray-400">No entries found.</div>
                    )}
                    {filteredData.map((entry, idx) => (
                        <div
                            key={idx}
                            className={`${entry[8] == "requested" ? "bg-yellow-100 border border-yellow-300" : "bg-green-100 border border-green-300 "}  rounded-xl p-4 shadow-sm`}
                        >
                            <div className="text-lg font-semibold text-gray-800">
                                {entry[2]}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Sales Advisor:</span>{" "}
                                {entry[1]}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Car:</span> {entry[4]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationOverlay;
