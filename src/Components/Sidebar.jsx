import { useContext, useState } from 'react';
import { AuthContext } from '../context/auth/AuthProvider';
import { Link, useNavigate, useLocation } from 'react-router';
import { roles } from '../Routes/roles';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = useContext(AuthContext);
  const { logout, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState('testDrive');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: HomeIcon },
    { to: '/price-list', label: 'Price List', icon: PriceIcon },
    { to: '/scheme-sheet', label: 'Scheme Sheet', icon: schemeIcon },
    { to: '/quotation', label: 'Quotation', icon: QuotationIcon },
    { to: '/stock-sheet', label: 'Stock Search', icon: StockIcon },
    { to: '/all-quotations', label: 'All Quotations', icon: ListIcon },
    { to: '/booking-list', label: 'Bookings', icon: BookingIcon },
  ];

  const testDriveItems = [
    { to: '/test-drive-history', label: 'History' },
  ];
  if (role === roles.GUARD || role === roles.ADMIN) {
    testDriveItems.unshift({ to: '/test-drive', label: 'Dashboard' });
  }
  if(role === roles.SALES) {
    testDriveItems.push({ to: '/book-test-drive', label: 'Book Drive' });
  }

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        flex flex-col shadow-xl
      `}>

        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                <span className="text-sm font-semibold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: {user?.userId}
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {role === roles.RECEPTION && (
            <>
              <Link
                to="/reception"
                onClick={toggleSidebar}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${isActivePath('/reception')
                              ? 'bg-gray-700 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }
                `}
                        >
                          <HomeIcon className={`
                  h-5 w-5 mr-3 transition-colors
                  ${isActivePath('/reception')
                              ? 'bg-gray-700 text-gray-900 dark:text-white'
                              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                            }
                `} />
                New Customer
              </Link>
              <Link
                to="/reception/edit"
                onClick={toggleSidebar}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${isActivePath('/reception/edit')
                    ? 'bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <EditIcon className={`
                  h-5 w-5 mr-3 transition-colors
                  ${isActivePath('/reception/edit')
                    ? 'bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }
                `} />
                
                Update CA/Model
              </Link>
            </>
            )}

          {!(role === roles.GUARD || role === roles.RECEPTION) && (
            <>
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  onClick={toggleSidebar}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
                    transition-all duration-200 group
                    ${isActivePath(item.to)
                      ? 'bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`
                    h-5 w-5 mr-3 transition-colors
                    ${isActivePath(item.to)
                    ? 'bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }
                  `} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
          {(role === roles.ADMIN || role === roles.MD || role === roles.SALES || role === roles.RECEPTION) &&  <Link
              to="/customer-list"
              onClick={toggleSidebar}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${isActivePath('/customer-list')
                    ? 'bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
              `}
              >
              <ListIcon className={`
                  h-5 w-5 mr-3 transition-colors
                  ${isActivePath('/customer-list')
                              ? 'bg-gray-700 text-gray-900 dark:text-white'
                              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                            }
                `} />
            Customer List
          </Link>}
          {role !== roles.RECEPTION && <div className="space-y-1">
            <button
              onClick={() => toggleMenu('testDrive')}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
                transition-all duration-200 group
                ${expandedMenu === 'testDrive'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <div className="flex items-center">
                <CarIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                Test Drive
              </div>
              <ChevronDownIcon className={`
                h-4 w-4 transition-transform duration-200
                ${expandedMenu === 'testDrive' ? 'rotate-180' : ''}
              `} />
            </button>

            <div className={`
              overflow-hidden transition-all duration-200 ease-in-out
              ${expandedMenu === 'testDrive' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="ml-8 space-y-1 py-1">
                {testDriveItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={toggleSidebar}
                    className={`
                      block px-3 py-2 text-sm rounded-lg transition-colors
                      ${isActivePath(item.to)
                      ? 'bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {(user.role === roles.ADMIN || user.role === roles.MD) && (
            <button
              onClick={() => navigate("/signup")}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Add User
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all duration-200"
          >
            <LogoutIcon className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

const HomeIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PriceIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-3 size-6">
    <path d="M4.5 0h11c.828 0 1.5.677 1.5 1.512v18.21a.2.2 0 01-.334.149l-1.664-1.515a.497.497 0 00-.67 0l-1.664 1.514a.497.497 0 01-.67 0l-1.663-1.514a.497.497 0 00-.67 0L8.002 19.87a.497.497 0 01-.67 0l-1.664-1.514a.497.497 0 00-.67 0l-1.664 1.515a.2.2 0 01-.334-.15V1.512C3 .677 3.672 0 4.5 0zm6.808 13.4l-1.96-2.63c1.342-.21 2.254-1.288 2.552-2.694h.85a.75.75 0 100-1.499h-.763a4.427 4.427 0 00-.432-1.579h.945A1 1 0 1012.5 3h-5a1 1 0 100 1.998h2.135c.449.297.754.86.844 1.58H7.25a.75.75 0 100 1.498h3.1c-.252.756-.791 1.234-1.493 1.234-.285 0-.543-.02-.777-.056a1 1 0 00-1.258 1.489l2.89 3.86a1 1 0 001.596-1.204z" fill="#d1d5dc" />
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

const StockIcon = (props) => (
  <svg className="h-5 w-5 mr-3 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
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

const CarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 mr-3 size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 18a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" /><path d="M28.5 12.667 27.4 11.2A5.525 5.525 0 0 0 23 9h-3.6a8.517 8.517 0 0 0-5.441 1.97L10.319 14H9.083a5.728 5.728 0 0 0-5.558 4.34l-.51 2.039A.5.5 0 0 0 3.5 21h4a.5.5 0 0 0 0-1H4.141l.359-1.417A4.729 4.729 0 0 1 9.083 15h14.76a4.47 4.47 0 0 0 3.182-1.318l.564-.564.111.149a1.5 1.5 0 0 1 .3.9V19.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 0 0 1h1a1.5 1.5 0 0 0 1.5-1.5v-5.333a2.515 2.515 0 0 0-.5-1.5zM19 14h-7.119l2.719-2.262a7.511 7.511 0 0 1 4.4-1.721zm7.318-1.025A3.477 3.477 0 0 1 23.843 14H20v-4h3a4.521 4.521 0 0 1 3.6 1.8l.383.51z" /><path d="M22.5 18a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zM18.5 20h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM17.5 17a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1z" />
  </svg>
);

const UserPlusIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const XIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const EditIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3zM5 19h14"
    />
  </svg>
);



export default Sidebar;