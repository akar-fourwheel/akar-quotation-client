import { useState, useEffect } from 'react';
import axios from 'axios';
import { modelOptions } from '../Components/quotation/staticQuotOptions';

const genderOptions = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Others', value: 'O' },
];

function ReceptionPage() {
  const userRole = localStorage.getItem('role');
  
  const getLeadType = () => {
    if (userRole === 'cre') {
      return 'digital';
    }
    return 'reception'; 
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    email: '',
    address: '',
    ca: '',
    model: '',
    remark:'',
    leadType: getLeadType(), 
    exeName: localStorage.getItem('userId')
  });
  
  const [caList, setCaList] = useState([]);
  const [modelList, setModelList] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [fetchError, setFetchError] = useState(null); 
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const caResponse = await axios.get("/leads/ca-list?query=onlyCA");
        
        setCaList(caResponse.data || []);
        setModelList(modelOptions);

      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
        setFetchError("Could not load required data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Customer name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.gender) newErrors.gender = 'Please select a gender.';
    if (!formData.ca) newErrors.ca = 'Please select a CA.'; // Validation for CA
    if (!formData.model) newErrors.model = 'Please select a model.'; // Validation for Model

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits and start with 9, 8, 7, or 6.';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus({ message: '', type: '' });

    if (validateForm()) {
      setIsSubmitting(true);
      axios.post('/leads/reception-new-customer', formData)
        .then(response => {
          setSubmitStatus({ message: 'Customer added successfully!', type: 'success' });
          setFormData({
            name: '', 
            phone: '', 
            gender: '', 
            email: '', 
            address: '', 
            ca: '', 
            model: '',
            remark:'',
            leadType: getLeadType(), // Reset leadType based on user role
            exeName: localStorage.getItem('userId')
          });
          setErrors({});
        })
        .catch(error => {
          const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
          setSubmitStatus({ message: errorMessage, type: 'error' });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const getPageTitle = () => {
    if (userRole === 'cre') {
      return 'Digital Lead Entry';
    }
    return 'New Customer Entry';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg px-6 py-4">
            <h2 className="text-center text-2xl font-bold flex items-center justify-center gap-3">
              <i className="fas fa-user-plus"></i>
              {getPageTitle()}
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">Loading data...</p>
              </div>
            ) : fetchError ? (
              <div className="p-4 rounded-md text-center font-medium bg-red-100 text-red-800" role="alert">
                <i className="fas fa-exclamation-triangle mr-2"></i> {fetchError}
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {submitStatus.message && (
                  <div className={`p-4 mb-6 rounded-md text-center font-medium ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {submitStatus.message}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Customer Name <span className="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter full name" required />
                    {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} maxLength="10" className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="10-digit mobile number" required />
                    {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Gender <span className="text-red-500">*</span></label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`} required>
                      <option value="" disabled>Select gender</option>
                      {genderOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs italic mt-1">{errors.gender}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="ca" className="block text-gray-700 text-sm font-bold mb-2">CA <span className="text-red-500">*</span></label>
                    <select id="ca" name="ca" value={formData.ca} onChange={handleChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ca ? 'border-red-500' : 'border-gray-300'}`} required>
                      <option value="" disabled>Select a CA</option>
                      {caList.map(ca => <option key={ca[0]} value={ca[0]}>{ca[1]}</option>)}
                    </select>
                    {errors.ca && <p className="text-red-500 text-xs italic mt-1">{errors.ca}</p>}
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-gray-700 text-sm font-bold mb-2">Model <span className="text-red-500">*</span></label>
                    <select id="model" name="model" value={formData.model} onChange={handleChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.model ? 'border-red-500' : 'border-gray-300'}`} required>
                      <option value="" disabled>Select a model</option>
                      {modelList.map(model => <option key={model} value={model}>{model}</option>)}
                    </select>
                    {errors.model && <p className="text-red-500 text-xs italic mt-1">{errors.model}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address <span className="text-gray-500 text-xs">(Optional)</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="example@email.com" />
                    {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold">Address <span className="text-red-500">*</span></label>
                    <textarea id="address" name="address" rows="3" value={formData.address} onChange={handleChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter customer's full address" required></textarea>
                    {errors.address && <p className="text-red-500 text-xs italic mt-1">{errors.address}</p>}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center">
                    {isSubmitting ? (
                      <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Submitting...</span></>
                    ) : userRole === 'cre' ? 'Add Digital Lead' : 'Add Customer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionPage;