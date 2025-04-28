import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signup } from '../../context/auth/authService';
import { AuthContext } from '../../context/auth/AuthProvider';
import { roles } from '../../Routes/roles';
import axios from 'axios';

const Signup = () => {
  const { role } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userId:'jay100',
    username: 'jay',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      await signup(userData);
      navigate('/'); // Redirect to home after successful signup
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
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
        username: selected ? selected[1] : '',
        role:selected ? selected[2]:''
      }));
      setSelectedUser(selected || null);
    }
     else {
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
      .catch(e => console.log(e)
      )
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
        <img
        className="h-40 w-auto"
        src="/logo.jpg"
        alt="Logo"
      />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="userId" className="sr-only">
                Username
              </label>
              <select
                id="userId"
                name="userId"
                required
                value={formData.userId}
                onChange={handleUserChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select Username</option>
                {userInfo.map((user, idx) => (
                  <option key={idx} value={user[0]}>
                    {user[0]} - {user[1]}
                  </option>
                ))}
              </select>
            </div>
            {selectedUser && (
              <>
                <div>
                  <input
                    type="text"
                    readOnly
                    value={selectedUser[1]} // Full name
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    readOnly
                    value={selectedUser[2]} // Team lead
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Team Lead"
                  />
                </div>
              </>
            )}
<div>
  <label htmlFor="role" className="sr-only">
    role
  </label>
  <select
    id="role"
    name="role"
    required
    value={formData.role}
    onChange={handleUserChange}
    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
  >
    <option value="">Select role</option>
    {Object.entries(roles).map(([key, value], idx) => (
      <option key={idx} value={value}>
        {value}
      </option>
    ))}
  </select>
</div>


            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleUserChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleUserChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 