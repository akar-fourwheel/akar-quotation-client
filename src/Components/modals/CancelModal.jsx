// components/CancelModal.jsx
import React from 'react';

const CancelModal = ({ onClose, onConfirm, selectedRow }) => {
  console.log(selectedRow)
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cancel Booking</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to cancel the booking for <strong>{selectedRow?.customer_name}</strong>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={() => onConfirm(selectedRow.Quotation_ID)}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
