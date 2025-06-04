import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import NotificationModal from './NotificationModal';
import AddDetails from "./AddDetails";
import InData from "./InData";
import { roles } from "../../Routes/roles";

const ListGroup = forwardRef(({ data, getData, pendingRecords, hasNewRecords }, ref) => {
  const [rows, setRows] = useState(data);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [showOut, setShowOut] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Update rows when data changes
  useEffect(() => {
    setRows(data);
  }, [data]);

  useImperativeHandle(ref, () => ({
    showNotificationModal: () => {
      setShowNotificationModal(true);
    }
  }));  

  const handleOutClick = (row) => {
    setSelectedVehicle(row);
    setShowOut(true);
  };

  const handleInClick = (row) => {
    setSelectedVehicle(row);
    setShowIn(true);
  };

  const handleStatusUpdate = (model, newStatus, salesAgent) => {
    setRows(rows.map(r =>
      r.model === model ? { ...r, status: newStatus, sales_agent: salesAgent } : r
    ));
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
  };

  const handleBookTestDrive = (request) => {
    setUpdateData({
      model: request.model,
      cx_name: request.cx_name,
      cx_phone: request.cx_phone,
      cx_email: request.cx_email,
      sales_person: request.sales_person,
      test_drive_date: request.test_drive_date,
      test_drive_time: request.test_drive_time,
      status: request.status
    });
    
    setSelectedVehicle({id: request.id, model: request.model, status: request.status, sales_agent: request.sales_person})
    setShowOut(true);
    setShowNotificationModal(false);
  };

  // Filter out pending requests from the main list
  const filteredRows = rows.filter(row => row.status !== 0);

  return (
    <div>
      {/* Notification Modal */}
      <NotificationModal
        show={showNotificationModal}
        onClose={closeNotificationModal}
        pendingRequests={pendingRecords || []}
        onBookTestDrive={handleBookTestDrive}
        allRecords={filteredRows}
      />

      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-sm text-left bg-white border border-gray-200 shadow rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 hidden lg:table-cell">ID</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3 text-left">Availability</th>
              {(localStorage.role === roles.GUARD || localStorage.role === roles.ADMIN || localStorage.role === roles.MD) && 
              <th className="px-4 py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr
                key={row.id}
                className={`border-t border-gray-200 hover:bg-blue-50 transition ${
                  selectedIndex === index ? 'bg-blue-100' : ''
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <td className="px-4 py-2 font-semibold hidden lg:table-cell">#{row.id}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold md:font-normal">
                  {row.model}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <div className="flex flex-col sm:flex-row gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white text-center ${
                    row.status === "Available"
                      ? "bg-green-500"
                      : row.status === "Workshop"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}>
                    {row.status}
                  </span>                
                  {row.status !== "Workshop" && <span className="sm:ml-2 m-0 text-sm text-gray-600 flex-column text-center sm:text-left">{row.sales_agent}</span>}
                  </div>
                </td>
                {(localStorage.role === roles.GUARD || localStorage.role === roles.ADMIN || localStorage.role === roles.MD) && 
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
                    >Out
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
                    >In
                    </button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedVehicle && (
        <>
          <AddDetails
            model={selectedVehicle.model}
            setShow={setShowOut}
            show={showOut}
            onStatusUpdate={handleStatusUpdate}
            initialData={updateData}
          />
          <InData
            model={selectedVehicle.model}
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
});

export default ListGroup;
