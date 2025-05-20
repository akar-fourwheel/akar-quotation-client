import { useState } from "react";
import axios from "axios";

const InData = ({ model, index, avail, setShow, show, onStatusUpdate, getData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ inKM: "", model: model, photo: null });
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleClose = () => {
    setShow(false);
    setFormData({ inKM: "", model: "", photo: null });
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
      const response = await axios.put(`/test-drive/in/${index}`, { availability: "Available" });

      
        const pushData = await axios.put(`/test-drive/in`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      if (!response.status === 200 && !pushData.status === 200) {
        throw new Error("Failed to update vehicle status");
      }

      getData();
      onStatusUpdate(model, "Available", "");
      handleClose();
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setError("Something went wrong while updating the vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files[0]) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value, model }));
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">
            <i className="fas fa-car mr-2"></i>Test Drive Details - {model}
          </h2>
          <button onClick={handleClose} className="text-white text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md">
                <i className="fas fa-exclamation-circle mr-2"></i>{error}
              </div>
            )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="fas fa-gauge text-blue-500 mr-2"></i>Kilometers
                  </label>
                  <input
                    type="text"
                    name="inKM"
                    value={formData.inKM}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    placeholder="Enter the KM reading"
                  />
                </div>

                <div className="mt-4">
              <label className="block mb-1 font-medium text-gray-700">
                <i className="fas fa-camera text-blue-600 mr-2"></i>Photo Proof
              </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    required
                    className="block w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="Preview" className="rounded shadow max-h-48" />
                    </div>
                  )}
                </div>
          </div>

          <div className="flex justify-end gap-2 bg-gray-100 p-4 rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
            >
              <i className="fas fa-times mr-2"></i>Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
            >
              {loading ? (
                <>
                  <span className="loader border-t-2 border-white border-solid rounded-full w-4 h-4 mr-2 animate-spin"></span>
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

export default InData;
