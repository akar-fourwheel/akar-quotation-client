import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signup } from '../../context/auth/authService';
import { AuthContext } from '../../context/auth/AuthProvider';
import { roles } from '../../Routes/roles';
import axios from 'axios';
import CredentialModal from '../../Components/modals/GenerateCredentials';

const Signup = () => {
  const { role } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message : '', type : '' });

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setStatus({message : 'Passwords do not match', type : 'error'});
      return;
    }

    // Validate required fields
    if (!formData.userId || !formData.username || !formData.role || !formData.password) {
      setStatus({ message : 'Please fill in all required fields', type : 'error'});
      return;
    }
    
    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await signup(userData);

      const msg = response?.data?.message || 'User account created successfully';
      setStatus({ message : msg , type : 'success' });
    } catch (err) {
      setStatus({ message : err.response?.data?.message || 'Signup failed. Please try again.', type : 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    if (name === 'userId') {
      const selected = userInfo.find(user => user[0] === value);
      setFormData(prev => ({
        ...prev,
        userId: value,
        username: selected ? selected[1].trim() : '',
        role: selected ? selected[2].trim() : ''
      }));
      setSelectedUser(selected || null);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    axios.get('/admin/user-info')
      .then(res => {
        setUserInfo(res.data);
      })
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
      setStatus({ message: '', type: '' });
    }, 4000);

    if(status.type === 'success') {
      setFormData({
        userId: '',
        username: '',
        role: '',
        password: '',
        confirmPassword: '',
      });
      setSelectedUser(null);
    }
      
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="px-4 sm:px-6 pt-6 pb-4 text-center bg-blue-600 text-white">
            <div className="flex justify-start">
              <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:bg-white/10 rounded-xl pr-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 pt-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back</button>
            </div>
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <img
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                src="/logo.jpg"
                alt="Logo"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Create Account
            </h1>
          </div>

          {/*Message status*/}
          {status.message && (
            <div className={`border rounded-lg p-4 mb-2 transition-all duration-300 ${status.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
              }`}>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  {status.type === 'success' ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5l-3-3 1.414-1.414L9 10.172l4.586-4.586L15 7l-6 6z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0-8a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                  )}
                </svg>
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="px-4 sm:px-6 py-6">
            <form className="space-y-4" onSubmit = {handleSubmit}>
              {/* User Selection */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Select User <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="userId"
                      name="userId"
                      required
                      value={formData.userId}
                      onChange={handleUserChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 appearance-none"
                    >
                      <option value="">Select Username</option>
                      {userInfo?.map((user, idx) => (
                        <option key={idx} value={user[0]}>
                          {user[0]} - {user[1]}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Display selected user info */}
                {selectedUser && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-6 rounded-lg border border-gray-200 space-y-4 transform transition-all duration-300 ease-in-out">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      User Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={selectedUser[1]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/80 text-gray-800 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Team Lead
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={selectedUser[2]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/80 text-gray-800 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleUserChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 appearance-none"
                    >
                      <option value="">Select Role</option>
                      {Object.entries(roles).map(([key, value], idx) => (
                        <option key={idx} value={value}>
                          {key}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleUserChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l4.242 4.242M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleUserChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l4.242 4.242M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isLoading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Create Account
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedUser) {
                      setShowCredentialModal(true);
                    } else {
                      setStatus('Please select a user first');
                    }
                  }}
                  className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-blue-300 rounded-lg text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                  Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Credential Modal */}
      {showCredentialModal && (
        <CredentialModal
          isOpen={showCredentialModal}
          onClose={() => setShowCredentialModal(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default Signup;
