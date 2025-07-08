import { useEffect, useState } from "react";
import axios from "axios";
import { showSuccess } from "../../utils/toast";

const AddDetails = ({ model, setShow, show, onStatusUpdate, initialData, id, getdata, pendingRequests = [] }) => {
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    salesPerson: "",
    outKM: "",
    model: model,
    photo: null,
    status: 1,
    reqId:"",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Master useEffect for form data based on selection
  useEffect(() => {
    const baseState = {
      customerName: "", phoneNumber: "", salesPerson: "", outKM: "",
      model: model, photo: null, status: 1,
      id: id, cxID: null, alotID: null
    };

    if (selectedRequestId === "workshop") {
      setFormData({
        ...baseState,
        customerName: "Workshop",
        salesPerson: "Workshop",
        phoneNumber: "9999999999",
      });
      setSelectedRequest(null);
    } else if (selectedRequestId) {
      const req = pendingRequests.find(r => String(r.id) === String(selectedRequestId));
      if (req) {
        setFormData({
          ...baseState,
          reqId:req.id,
          cxID: req.cx_id || req.cx_id,
          alotID: req.ALOT_ID || req.alot_id,
          customerName: req.CX_NAME || req.customerName,
          phoneNumber: req.CX_PHONE || req.phoneNumber,
          salesPerson: req.sales_person || req.salesPerson,
          outKM: "",
          model: req.model || model,
        });
        setSelectedRequest(req);
      }
    } else if (initialData) { // For updates
      setFormData({ ...baseState, ...initialData });
      setSelectedRequest(null);
    } else { // No selection, reset to blank
      setFormData(baseState);
      setSelectedRequest(null);
    }
  }, [selectedRequestId, initialData, model, pendingRequests, id]);


  const handleClose = () => {
    setShow(false);
    setFormData({
      customerName: "",
      phoneNumber: "",
      salesPerson: "",
      outKM: "",
      model: "",
      photo: null,
      status: 1
    });
    setPreviewUrl(null);
    setError(null);
    setSelectedRequestId("");
    setSelectedRequest(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isUpdateRequest = selectedRequestId && selectedRequestId !== "workshop";

      if (isUpdateRequest) {
        const updatePayload = new FormData();
        updatePayload.append('id', id); // demo_vehicle_id from props
        updatePayload.append('requestId', formData.reqId);
        updatePayload.append('photo', formData.photo);
        updatePayload.append('alot_id', formData.alotID);
        updatePayload.append('outKM', formData.outKM);

        const outResult = await axios.put(`/test-drive/out/update`, updatePayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if(outResult?.status == 200){
          showSuccess("Test Drive Booked!")
          getdata();
          onStatusUpdate && onStatusUpdate(model, selectedRequestId === "workshop" ? "Workshop" : "Unavailable", formData.salesPerson);
        }
      } else {
        const createPayload = new FormData();
        for (const key in formData) {
          createPayload.append(key, formData[key]);
        }
        await axios.post(`/test-drive/out`, createPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      getdata();
      onStatusUpdate && onStatusUpdate(model, selectedRequestId === "workshop" ? "Workshop" : "Unavailable", formData.salesPerson);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

        <div className="px-6 pt-4">
            <label className="block mb-1 font-medium text-gray-700">
              <i className="fas fa-list text-blue-600 mr-2"></i>Select an option
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={selectedRequestId}
              onChange={e => setSelectedRequestId(e.target.value)}
            >
              <option value="">-- Select an option --</option>
              <option value="workshop">Workshop</option>
              {pendingRequests
                 .filter(req => {
                   if (!req.model) return false;
                   const pattern = new RegExp(`\\b${model}\\b`, 'i');
                   return pattern.test(req.model);
                 })
                 .map(req => (
                  <option key={req.id} value={req.id}>
                    #{req.id} - {req.sales_person} ({req.model})
                  </option>
              ))}
            </select>
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
                value={formData.customerName}
                disabled={!!selectedRequestId || !!initialData}
                onChange={handleChange}
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
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!!selectedRequestId || !!initialData}
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
                value={formData.salesPerson}
                onChange={handleChange}
                disabled={!!selectedRequestId || !!initialData}
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
