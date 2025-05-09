const AllRecords = ({ data }) => {
  const getDate = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  
    const getDuration = (inTs, outTs) => {
      const inDateTime = new Date(inTs);
      const outDateTime = new Date(outTs);
      return (inDateTime - outDateTime) / 3600000;
    };
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">Out Date/Time</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Sales Person</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Out KM</th>
              <th className="px-4 py-2">In KM</th>
              <th className="px-4 py-2">Total KM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{getDate(record.out_time)}</td>
                  <td className="px-4 py-2">{record.model}</td>
                  <td className="px-4 py-2">{record.cx_name}</td>
                  <td className="px-4 py-2">{record.cx_phone}</td>
                  <td className="px-4 py-2">{record.sales_person}</td>
                  <td className="px-4 py-2">
                    {getDuration(record.in_time, record.out_time).toFixed(1)} Hr
                  </td>
                  <td className="px-4 py-2">{record.out_km}</td>
                  <td className="px-4 py-2">{record.in_km}</td>
                  <td className="px-4 py-2">
                    {record.in_km - record.out_km}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AllRecords;
  