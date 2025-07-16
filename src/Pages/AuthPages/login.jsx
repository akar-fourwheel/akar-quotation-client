import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AuthContext } from '../../context/auth/AuthProvider';
import { login as authLogin } from '../../context/auth/authService';
import { roles } from '../../Routes/roles';

const Login = () => {
  const [credentials, setCredentials] = useState({
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
      // Redirect to role-specific page
      let from = location.state?.from?.pathname || '/';

      if (localStorage.role === roles.GUARD) {
        from = '/guard/test-drive';
      } else if (localStorage.role === roles.RECEPTION || localStorage.role === roles.CRE) {
        from = '/reception';
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-400/20 to-slate-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 hover:shadow-3xl">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-[6rem] h-[6rem] flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-105">
                <img src="/logoLogin.png" alt="akarLogo" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600 text-sm">Sign in to access your dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                User ID
              </label>
              <div className="relative">
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  autoComplete="userId"
                  required
                  className={`w-full px-4 py-3 bg-slate-50/50 border-2 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:bg-white ${focusedField === 'userId' || credentials.userId
                      ? 'border-blue-500'
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                  placeholder="Enter your user ID"
                  value={credentials.userId}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('userId')}
                  onBlur={() => setFocusedField('')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`w-full px-4 py-3 bg-slate-50/50 border-2 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:bg-white ${focusedField === 'password' || credentials.password
                      ? 'border-blue-500'
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 animate-in slide-in-from-top-5 duration-300">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${isLoading
                  ? 'bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed scale-95'
                  : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black hover:scale-105 hover:shadow-xl active:scale-95'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Secure dealership management system
            </p>
          </div>
        </div>

        <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-br from-slate-400 to-purple-600 rounded-full opacity-30 animate-bounce"></div>
      </div>
    </div>
  );
};

export default Login; 