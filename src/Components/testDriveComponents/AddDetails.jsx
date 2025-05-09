import { useState } from "react";
import axios from "axios";

const AddDetails = ({ model, index, setShow, show, onStatusUpdate }) => {
  const [isOn, setIsOn] = useState(false);
  const toggle = () => {
    setIsOn(prev => !prev);
    setFormData({
      customerName: "",
      phoneNumber: "",
      salesPerson: "",
      outKM: "",
      model: model,
      photo: null,
    });
  }

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    salesPerson: "",
    outKM: "",
    model: model,
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleClose = () => {
    setShow(false);
    setIsOn(false);
    setFormData({
      customerName: "",
      phoneNumber: "",
      salesPerson: "",
      outKM: "",
      model: "",
      photo: null,
    });
    setPreviewUrl(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    try {
      const statusResponse = await axios.put(`/test-drive/out/${index}`, {
        status: isOn ? "Workshop" : "Unavailable",
      });

        const detailsResponse = await axios.post(`/test-drive/out`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      if (!statusResponse.status === 200 && !detailsResponse.status === 200) {
        throw new Error("Failed to update vehicle status");
      }

      onStatusUpdate(index, isOn ? "Workshop" : "Unavailable", formData.salesPerson);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsOn(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files[0]) {
      setFormData(prev => ({ ...prev, photo: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value, model }));
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-700 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fas fa-car"></i>
            Test Drive Details - {model}
          </h2>
          <button onClick={handleClose} className="text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={toggle}
            className={`px-4 py-2 font-semibold rounded-full transition ${
              isOn ? "bg-green-600 text-white" : "bg-gray-500 text-white"
            }`}
          >
            Workshop
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                <i className="fas fa-user text-blue-600 mr-2"></i>Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={isOn ? formData.customerName = "Workshop" : formData.customerName}
                onChange={handleChange}
                disabled={isOn}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter customer name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                <i className="fas fa-phone text-blue-600 mr-2"></i>Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={isOn ? formData.phoneNumber = 9999999999 : formData.phoneNumber}
                onChange={handleChange}
                disabled={isOn}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter phone number"
              />
            </div>

            {/* Sales Person */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                <i className="fas fa-user text-blue-600 mr-2"></i>Sales Person
              </label>
              <input
                type="text"
                name="salesPerson"
                value={isOn ? formData.salesPerson = "Workshop" : formData.salesPerson}
                onChange={handleChange}
                disabled={isOn}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter salesperson name"
              />
            </div>

            {/* Out KM */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                <i className="fas fa-gauge text-blue-600 mr-2"></i>Kilometers
              </label>
              <input
                type="text"
                name="outKM"
                value={formData.outKM}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter the KM reading"
              />
            </div>
          </div>

          {/* File Upload */}
            <div className="mt-4">
              <label className="block mb-1 font-medium text-gray-700">
                <i className="fas fa-camera text-blue-600 mr-2"></i>Photo Proof
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="mt-2 rounded border max-h-48" />
              )}
            </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center mt-6 space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              <i className="fas fa-times mr-2"></i>Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>Save Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDetails;
