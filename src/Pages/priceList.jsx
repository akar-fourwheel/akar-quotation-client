import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PriceList = () => {
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');
    const [fuel, setFuel] = useState('');

    const [getYear, setGetYear] = useState([]);
    const [getModel, setGetModel] = useState([]);
    const [getFuel, setGetFuel] = useState([]);
    const [variantFilter, setVariantFilter] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    const [matchedVehicles, setMatchedVehicles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.get(`/get-orp`, {
            params: {
                year,
                model,
                fuel
            },
        })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setMatchedVehicles(response.data);
                } else {
                    setMatchedVehicles([]);
                }
            });
    };

    useEffect(() => {
        axios
            .get(`/quotation`)
            .then((response) => {
                if (response.data.success) {
                    setGetYear(response.data.data);
                  } else {
                    setGetYear([]);
                  }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const dataBasedOnYear = (e) => {
        const selectedYear = e.target.value;
        setYear(selectedYear);
        setModel('');
        setFuel('');
        setGetModel([]);
        setGetFuel([]);

        axios.get(`/quotation-data`, {
            params: { year: selectedYear },
        }).then((response) => {
            if (response.data.success) {
                setGetModel(response.data.data);
              } else {
                setGetModel([]);
              }
        });
    };

    const dataBasedOnYearAndModel = (e) => {
        const selectedModel = e.target.value;
        setModel(selectedModel);
        setFuel('');
        setGetFuel([]);

        axios.get(`/quotation-data`, {
            params: { year, model: selectedModel },
        }).then((response) => {
            if (response.data !== "data not found") {
                if (response.data.success) {
                    setGetFuel(response.data.data);
                  } else {
                    setGetFuel([]);
                  }
            }
        });
    };

    const filteredVehicles = matchedVehicles.filter(vehicle =>
        vehicle.Variant.toLowerCase().includes(variantFilter.toLowerCase())
    ).sort((a, b) => {
        const getTotalPrice = (vehicle) => {
            const esp = Number(vehicle.ESP) || 0;
            const rto = Number(vehicle.RTO) || 0;
            const insurance = Number(vehicle.Insurance) || 0;
            const fastTag = Number(vehicle.FastTag) || 0;
            const extraTax = esp > 1000000 ? esp * 0.01 : 0;
            return esp + rto + insurance + fastTag + extraTax;
        };
        return getTotalPrice(a) - getTotalPrice(b);
    });

    const uniqueVariants = [...new Set(matchedVehicles.map(v => v.Variant))];

    return (
        <div className="container mx-auto w-half p-2 md:p-6">
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 uppercase">Vehicle Price List</h2>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                            <select
                                onChange={dataBasedOnYear}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Choose year</option>
                                {getYear.map((yr) => (
                                    <option key={yr} value={yr}>{yr}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model:</label>
                            <select
                                onChange={dataBasedOnYearAndModel}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Choose model</option>
                                {getModel.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel:</label>
                            <select
                                onChange={(e) => setFuel(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Choose fuel type</option>
                                {getFuel.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Show Prices
                    </button>
                </form>
            </div>

            {matchedVehicles.length > 0 && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Variant:</label>
                    <select
                        value={variantFilter}
                        onChange={(e) => setVariantFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Variants</option>
                        {uniqueVariants.map((variant, index) => (
                            <option key={index} value={variant}>
                                {variant}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {filteredVehicles.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Variant</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">On-Road Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.map((vehicle, index) => {
                                const esp = Number(vehicle.ESP) || 0;
                                const rto = Number(vehicle.RTO) || 0;
                                const insurance = Number(vehicle.Insurance) || 0;
                                const fastTag = Number(vehicle.FastTag) || 0;
                                const extraTax = esp > 1000000 ? esp * 0.01 : 0;
                                const total = esp + rto + insurance + fastTag + extraTax;
                                console.log(extraTax);


                                const isExpanded = expandedRow === index;

                                return (
                                    <React.Fragment key={index}>
                                        <tr
                                            className="border-b hover:bg-gray-50 cursor-pointer"
                                            onClick={() => setExpandedRow(isExpanded ? null : index)}
                                        >
                                            <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{vehicle.Variant}</td>
                                            <td className="px-4 py-2 text-sm font-semibold text-green-700">
                                                ₹ {total.toLocaleString()}
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={3} className="px-4 py-0 text-sm text-gray-700">
                                                    <div
                                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] py-4' : 'max-h-0 py-0'
                                                            }`}
                                                    >
                                                        <div className="grid grid-cols-1 gap-x-4">
                                                            <div className="col-span-1 space-y-1 justify-center">
                                                                <div className="flex justify-between">
                                                                    <span>Ex-Showroom Price:</span>
                                                                    <span>₹ {esp.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>RTO:</span>
                                                                    <span>₹ {rto.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Insurance:</span>
                                                                    <span>₹ {insurance.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Fast Tag:</span>
                                                                    <span>₹ {fastTag.toLocaleString()}</span>
                                                                </div>
                                                                {extraTax > 0 && (
                                                                    <div className="flex justify-between">
                                                                        <span>Additional Tax (1%):</span>
                                                                        <span>₹ {extraTax.toLocaleString()}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PriceList;