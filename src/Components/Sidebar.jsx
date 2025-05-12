import { useContext } from 'react';
import { AuthContext } from '../context/auth/AuthProvider';
import { Link, useNavigate } from 'react-router';
import { roles } from '../Routes/roles';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = useContext(AuthContext);
  const { logout, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out`}
    >
      {/* User Info */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-lg font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div >
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-gray-400">ID: {user?.userId}</p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
        >
          <span className="sr-only">Close sidebar</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      {role !== roles.GUARD && (
      <nav className="mt-4">
        {[
          { to: '/', label: 'Home', icon: HomeIcon },
          { to: '/price-list', label: 'Price List', icon: PriceIcon },
          { to: '/scheme-sheet', label: 'Scheme Sheet', icon: schemeIcon },
          { to: '/quotation', label: 'Make Quotation', icon: QuotationIcon },
          { to: '/stock-sheet', label: 'Search Stock', icon: StockIcon },
          { to: '/all-quotations', label: 'Quotation List', icon: ListIcon },
          { to: '/booking-list', label: 'Booking List', icon: BookingIcon },
          { to: '/test-drive', label: 'Test Drive', icon: CarIcon }
        ].map(({ to, label, icon: Icon }, i) => (
          <Link
            key={i}
            to={to}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Icon className="h-5 w-5 mr-3" />
            <span >{label}</span>
          </Link>
        ))}
      </nav>)}

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4">
        {user.role===roles.ADMIN &&
          <button
          onClick={() => navigate("/signup")}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-400 hover:bg-sky-400 my-3"
          >
             <SignupIcon className="h-5 w-5 mr-2" />
            <span >Add new user</span>
          </button>
      }
        <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <LogoutIcon className="h-5 w-5 mr-2" />
          <span >Logout</span>
        </button>
      </div>
    </div>
  );
};

// Icons defined as components for reuse
const HomeIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const StockIcon = (props) => (
  <svg className="h-5 w-5 mr-3 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const schemeIcon = (props) => (
  <svg className="h-5 w-5 mr-3 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const QuotationIcon = (props) => (
  <svg className="h-5 w-5 mr-3 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
  </svg>
);

const ListIcon = (props) => (
  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const BookingIcon = (props) => (
  <svg className="h-5 w-5 mr-3 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
</svg>
);

const SignupIcon = (props) => (
  <svg className="h-5 w-5 mr-2 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>
);

const CarIcon = (props) => (
  <svg
  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 mr-3 size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 18a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z"/><path d="M28.5 12.667 27.4 11.2A5.525 5.525 0 0 0 23 9h-3.6a8.517 8.517 0 0 0-5.441 1.97L10.319 14H9.083a5.728 5.728 0 0 0-5.558 4.34l-.51 2.039A.5.5 0 0 0 3.5 21h4a.5.5 0 0 0 0-1H4.141l.359-1.417A4.729 4.729 0 0 1 9.083 15h14.76a4.47 4.47 0 0 0 3.182-1.318l.564-.564.111.149a1.5 1.5 0 0 1 .3.9V19.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 0 0 1h1a1.5 1.5 0 0 0 1.5-1.5v-5.333a2.515 2.515 0 0 0-.5-1.5zM19 14h-7.119l2.719-2.262a7.511 7.511 0 0 1 4.4-1.721zm7.318-1.025A3.477 3.477 0 0 1 23.843 14H20v-4h3a4.521 4.521 0 0 1 3.6 1.8l.383.51z"/><path d="M22.5 18a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zM18.5 20h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM17.5 17a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1z"/>
</svg>
);

const PriceIcon = (props) => (
  <svg 
  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-3 size-6">
  <path d="M4.5 0h11c.828 0 1.5.677 1.5 1.512v18.21a.2.2 0 01-.334.149l-1.664-1.515a.497.497 0 00-.67 0l-1.664 1.514a.497.497 0 01-.67 0l-1.663-1.514a.497.497 0 00-.67 0L8.002 19.87a.497.497 0 01-.67 0l-1.664-1.514a.497.497 0 00-.67 0l-1.664 1.515a.2.2 0 01-.334-.15V1.512C3 .677 3.672 0 4.5 0zm6.808 13.4l-1.96-2.63c1.342-.21 2.254-1.288 2.552-2.694h.85a.75.75 0 100-1.499h-.763a4.427 4.427 0 00-.432-1.579h.945A1 1 0 1012.5 3h-5a1 1 0 100 1.998h2.135c.449.297.754.86.844 1.58H7.25a.75.75 0 100 1.498h3.1c-.252.756-.791 1.234-1.493 1.234-.285 0-.543-.02-.777-.056a1 1 0 00-1.258 1.489l2.89 3.86a1 1 0 001.596-1.204z" fill="#d1d5dc"/>
  </svg>
);

export default Sidebar;