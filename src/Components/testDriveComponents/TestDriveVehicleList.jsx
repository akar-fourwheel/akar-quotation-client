import { useState } from "react";
import AddDetails from "./AddDetails";
import InData from "./InData";

const TestDriveVehicleList = ({ data = [], getData, pendingRequests }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showOut, setShowOut] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const handleOutClick = (row) => {
    setSelectedVehicle(row);
    setUpdateData({
      model: row.model,
      id: row.id,
      // add other fields as needed
    });
    setShowOut(true);
  };

  const handleInClick = (row) => {
    setSelectedVehicle(row);
    setShowIn(true);
  };

  const handleStatusUpdate = (model, status, salesPerson) => {
    data.map((dt)=>{ if(dt.model == model){
      dt.status = status; dt.username = salesPerson
    } } )
  }

  const handleOutClose = () => {
    setShowOut(false);
    setSelectedVehicle(null);
    getData();
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-sm text-left bg-white border border-gray-200 shadow rounded">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 hidden lg:table-cell">ID</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3 text-left">Availability</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className="border-t border-gray-200 hover:bg-blue-50 transition"
            >
              <td className="px-4 py-2 font-semibold hidden lg:table-cell">#{row.id}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold md:font-normal">
                {row.model}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white text-center ${
                  row.status === "Available"
                    ? "bg-green-500"
                    : row.status === "Workshop"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}>
                  {row.status}
                </span>
                {row.username != null && <small className=" ml-4 bg-gray-200 rounded-full px-3 py-1">{`${row.username.charAt(0).toUpperCase() + row.username.slice(1)}`}</small>}
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOutClick(row)}
                    disabled={row.status !== "Available"}
                    className={`px-3 py-1 text-sm font-medium rounded-md items-center gap-1 cursor-pointer ${
                      row.status === "Available"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Out
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInClick(row)}
                    disabled={row.status === "Available"}
                    className={`px-3 py-1 text-sm font-medium rounded-md items-center gap-1 ${
                      row.status !== "Available"
                        ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    In
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
            setShow={handleOutClose}
            show={showOut}
            getdata={getData}
            id={selectedVehicle.id}
            initialData={updateData}
            pendingRequests={pendingRequests}
            onStatusUpdate={handleStatusUpdate}
          />
          <InData
            model={selectedVehicle.model}
            avail={selectedVehicle.status}
            setShow={setShowIn}
            show={showIn}
            getData={getData}
            id={selectedVehicle.id}
            alotId={selectedVehicle.alot_id}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
      )}
    </div>
  );
};

export default TestDriveVehicleList; 