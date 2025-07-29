import React from "react";
import Select from 'react-select';

const CustomerDetailsForm = ({
  newCx,
  setNewCx,
  setNewAllot,
  selectedCustomer,
  setSelectedCustomer,
  name,
  setName,
  address,
  setAddress,
  phoneNo,
  setPhoneNo,
  email,
  setEmail,
  gender,
  setGender,
  errors,
  customerSearchQuery,
  setCustomerSearchQuery,
  filteredCustomers,
  handleCustomerSelect,
  setFinalData,
  setModel,
  setYear,
  setFuel,
  setVariant
}) => (
  <>
    {/* Toggle for New/Listed Customer */}
    <div className="mb-6 flex items-center space-x-3">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={newCx}
            onChange={(e) => {
              setNewCx(e.target.checked);
              // Always clear vehicle selection fields
              setFinalData && setFinalData({});
              setModel && setModel('');
              setYear && setYear('');
              setFuel && setFuel('');
              setVariant && setVariant('');
              if (e.target.checked) {
                setNewAllot && setNewAllot(true);
                setSelectedCustomer && setSelectedCustomer(null);
                setName && setName('');
                setPhoneNo && setPhoneNo('');
                setEmail && setEmail('');
                setAddress && setAddress('');
                setGender && setGender('');
                setCustomerSearchQuery && setCustomerSearchQuery(''); // Clear search query
              }
            }}
            className="sr-only"
          />
          <div className={`block w-14 h-8 rounded-full ${newCx ? 'bg-blue-500' : 'bg-gray-300'} transition-colors duration-200`}></div>
          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${newCx ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <span className="ml-3 text-lg font-medium text-gray-700">
          {newCx ? 'New Customer' : 'Listed Customer'}
        </span>
      </label>
    </div>
    {/* Listed Customer Section */}
    {!newCx && (
      <div className="mb-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Select Existing Customer</h3>
        {/* Search/Filter Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Search customers by name or phone:
          </label>
          <input
            type="text"
            placeholder="Search by name, phone, or car model..."
            value={customerSearchQuery}
            onChange={(e) => setCustomerSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Customer List */}
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md bg-white text-sm">
          {filteredCustomers && filteredCustomers.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredCustomers.map((customer, index) => (
                <div
                  key={`${customer.id}-${customer.model}-${index}`}
                  onClick={() => handleCustomerSelect(customer)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 truncate transition-colors ${
                    selectedCustomer &&
                    selectedCustomer.id === customer.id &&
                    selectedCustomer.allotment_id === customer.allotment_id
                      ? 'bg-gray-100 border-l-2 border-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex-1 min-w-0 flex items-center gap-3 overflow-hidden">
                    <span className="font-medium text-gray-800 truncate">{customer.name}</span>
                    <span className="text-gray-500 text-xs shrink-0">ID: {customer.id}</span>
                    {customer.phone && <span className="text-gray-500 truncate hidden md:inline">{customer.phone}</span>}
                    {customer.gender && (
                      <span className="text-gray-500 text-xs hidden md:inline">
                        {customer.gender === 'M'
                          ? 'M'
                          : customer.gender === 'F'
                          ? 'F'
                          : 'O'}
                      </span>
                    )}
                    {customer.email && <span className="text-gray-500 truncate hidden lg:inline">{customer.email}</span>}
                    {customer.address && <span className="text-gray-400 truncate hidden lg:inline">{customer.address}</span>}
                  </div>
                  <div className="ml-2 text-gray-600 text-xs shrink-0">
                    {customer.model} {/* Car model */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-400 text-sm">
              {customerSearchQuery
                ? 'No customers found matching your search.'
                : 'No customers available.'}
            </div>
          )}
        </div>
        {/* Selected Customer Display */}
        {selectedCustomer && (
          <div className="bg-green-50 border border-green-200 rounded-lg text-sm p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">
                <span className="font-medium text-green-700">Selected Customer : {selectedCustomer.name}</span> — {selectedCustomer.model}
                {selectedCustomer.phone && ` | ${selectedCustomer.phone}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  setName('');
                  setPhoneNo('');
                  setEmail('');
                  setAddress('');
                  setGender('');
                }}
                className="text-xs text-red-500 hover:underline ml-4"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    )}
    {/* Customer Details Form Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="col-span-2 sm:col-span-2 lg:col-span-2 space-y-2">
      <label className={`block text-lg ${!newCx ? 'text-gray-400' : ''}`}>Customer Name:</label>
      <input
        type="text"
        disabled={!newCx}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg ${!newCx ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
      />
    </div>
    <div className="col-span-2 sm:col-span-2 lg:col-span-2 space-y-2">
      <label className={`block text-lg ${!newCx ? 'text-gray-400' : ''}`}>Address:</label>
      <input
        type="text"
        disabled={!newCx}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg ${!newCx ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
      />
    </div>
    <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-2">
      <label className={`block text-lg ${!newCx ? 'text-gray-400' : ''}`}>Phone Number:</label>
      <input
        type="text"
        disabled={!newCx}
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
        className={`w-full p-2 border ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'} rounded-lg ${!newCx ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
      />
    </div>
    <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-2">
      <label className={`block text-lg ${!newCx ? 'text-gray-400' : ''}`}>Gender:</label>
      <Select
        options={[{ value: 'M', label: 'MALE' }, { value: 'F', label: 'FEMALE' }, { value: 'O', label: 'OTHERS' }]}
        value={gender ? { value: gender, label: gender === 'M' ? 'MALE' : gender === 'F' ? 'FEMALE' : 'OTHERS' } : null}
        onChange={(selected) => {
          setGender(selected?.value || '')
        }}
        isDisabled={!newCx}
        className="w-full p-1 rounded-lg"
        required={true}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: !newCx ? '#f3f4f6' : 'white',
            color: !newCx ? '#9ca3af' : 'black',
            cursor: !newCx ? 'not-allowed' : 'default'
          })
        }}
      />
    </div>
    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
      <label className={`block text-lg ${!newCx ? 'text-gray-400' : ''}`}>Email:</label>
      <input
        type="text"
        disabled={!newCx}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={newCx ? 'Optional' : ''}
        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg ${!newCx ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
      />
    </div>
    </div>
  </>
);

export default CustomerDetailsForm;
