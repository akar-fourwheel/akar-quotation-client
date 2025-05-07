import { useState } from "react";
import AddDetails from "./AddDetails";
import InData from "./InData";

const ListGroup = ({ data, getData }) => {
  const [rows, setRows] = useState(data);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showOut, setShowOut] = useState(false);
  const [showIn, setShowIn] = useState(false);

  const handleOutClick = (row) => {
    setSelectedVehicle(row);
    setShowOut(true);
  };

  const handleInClick = (row) => {
    setSelectedVehicle(row);
    setShowIn(true);
  };

  const handleStatusUpdate = (id, newStatus, salesAgent) => {
    setRows(rows.map(r =>
      r.id === id ? { ...r, status: newStatus, sales_agent: salesAgent } : r
    ));
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-sm text-left bg-white border border-gray-200 shadow rounded">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 hidden lg:table-cell">ID</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Availability</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className={`border-t border-gray-200 hover:bg-blue-50 transition ${
                selectedIndex === index ? 'bg-blue-100' : ''
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <td className="px-4 py-2 font-semibold hidden lg:table-cell">#{row.id}</td>
              <td className="px-4 py-2 flex items-center gap-2">
                <i className="fas fa-car text-blue-500"></i>
                {row.model}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                  row.status === "Available"
                    ? "bg-green-500"
                    : row.status === "Workshop"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}>
                  <i className={`fas fa-${row.status === "Available" ? 'check' : 'times'}-circle mr-1`}></i>
                  {row.status}
                </span>
                {row.sales_agent && <span className="ml-2 text-sm text-gray-600">{row.sales_agent}</span>}
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOutClick(row)}
                    disabled={row.status !== "Available"}
                    className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-1 cursor-pointer ${
                      row.status === "Available"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <i className="fas fa-sign-out-alt"></i>Out
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInClick(row)}
                    disabled={row.status === "Available"}
                    className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-1 ${
                      row.status !== "Available"
                        ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <i className="fas fa-sign-in-alt"></i>In
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVehicle && (
        <>
          <AddDetails
            model={selectedVehicle.model}
            index={selectedVehicle.id}
            setShow={setShowOut}
            show={showOut}
            data={rows}
            setRow={setRows}
            onStatusUpdate={handleStatusUpdate}
          />
          <InData
            model={selectedVehicle.model}
            index={selectedVehicle.id}
            avail={selectedVehicle.status}
            setShow={setShowIn}
            show={showIn}
            data={rows}
            setRow={setRows}
            onStatusUpdate={handleStatusUpdate}
            getData={getData}
          />
        </>
      )}
    </div>
  );
};

export default ListGroup;
