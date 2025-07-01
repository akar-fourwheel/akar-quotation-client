import React, { useState, useEffect } from 'react';

function DealerContent({ responseData }) {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [filteredData, setFilteredData] = useState(responseData);

  const variants = Array.from(new Set(responseData.map(row => row[0])));

  useEffect(() => {
    if (selectedVariant === '') {
      setFilteredData(responseData);
    } else {
      setFilteredData(responseData.filter(row => row[0] === selectedVariant));
    }
  }, [selectedVariant, responseData]);

  return (
    <>
      {/* Search Bar / Dropdown */}
      <div className="mt-4 px-4 flex flex-col md:flex-row items-start md:items-center gap-2">
        <label htmlFor="variant-select" className="font-semibold text-sm text-gray-700">
          Filter by Variant:
        </label>
        <select
          id="variant-select"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          value={selectedVariant}
          onChange={(e) => setSelectedVariant(e.target.value)}
        >
          <option value="">All Variants</option>
          {variants.map((variant, index) => (
            <option key={index} value={variant}>
              {variant}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6 px-4">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-500">
              <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">VARIANT</th>
              <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">COLOR</th>
              <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">AGE</th>
              <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">QUANT.</th>
              {/* <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">BOOKING</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100 text-[14px] md:text-lg">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-solid p-2">
                    {cell}
                  </td>
                ))}
                {/* <td className="border border-solid p-2">
                  <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                    Book
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DealerContent;
