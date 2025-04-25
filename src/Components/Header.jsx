import { useContext } from 'react';
import { AuthContext } from '../context/auth/AuthProvider';

const Header = ({ toggleSidebar }) => {
  const user = useContext(AuthContext);

  return (
    <header className="bg-white shadow">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="pr-3 border-r border-white text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="sm:text-xl sm:font-bold text-lg font-light text-gray-900">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="sm:text-xl sm:font-medium text-lg font-lighter text-gray-700">Welcome,  {user?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 