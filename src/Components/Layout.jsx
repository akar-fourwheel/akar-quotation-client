import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if(isSidebarOpen===true) toggleSidebar(false);
  }

  return (
    <div className="flex h-[100vh] overflow-hidden bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden h-[calc(100vh-64px)] overflow-y-auto"
        onClick={closeSidebar}
        >
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout; 