import React from "react";

const CustomerDetailsForm = ({ name, setName, address, setAddress, phoneNo, setPhoneNo, email, setEmail, errors }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
      <label className="block text-lg">Customer Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
      />
    </div>
    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
      <label className="block text-lg">Address:</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
      />
    </div>
    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
      <label className="block text-lg">Phone Number:</label>
      <input
        type="text"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
        className={`w-full p-2 border ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
      />
    </div>
    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
      <label className="block text-lg">Email:</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Optional'
        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
      />
    </div>
  </div>
);

export default CustomerDetailsForm;