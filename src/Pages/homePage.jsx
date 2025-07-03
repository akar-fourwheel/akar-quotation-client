import { Link, useNavigate } from "react-router";
import { BellIcon,CubeIcon,PercentBadgeIcon,PencilSquareIcon,DocumentTextIcon,CurrencyRupeeIcon,TruckIcon,DocumentCheckIcon,ArrowPathIcon,WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { roles } from "../Routes/roles";
import NotificationOverlay from "../Components/homePage/NotificationOverlay";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <div
        className="relative min-h-screen w-full bg-cover bg-center h-100"
        style={{
          backgroundImage: `url('https://www.tatamotors.com/wp-content/uploads/2023/11/press-11feb23-highres.jpg')` }}
      >
        <div className="absolute inset-0 backdrop-blur bg-white/30 dark:bg-black/30"></div>

        <div className="fixed top-30 right-20 z-50">
          <button
            onClick={() => setShowOverlay(true)}
            className="relative p-2 rounded-full bg-white hover:bg-gray-100 shadow transition"
          >
            <BellIcon className="h-8 w-8 text-gray-800" />
            {/* <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span> */}
          </button>
        </div>
        {showOverlay && <NotificationOverlay onClose={() => setShowOverlay(false)} />}

        <div className="relative z-10 flex items-center justify-center h-full px-4 pt-40 sm:pt-0 overflow-y-auto pt-16 pb-32">
          <div className="backdrop-blur-sm bg-white/10 w-full max-w-5xl rounded-2xl shadow-xl p-6 sm:p-10 text-white">
            <div className="text-center mb-8">
              <img src="./logo.jpg" alt="Logo" className="h-28 mx-auto rounded-md shadow" />
              <h1 className="text-4xl sm:text-5xl font-extrabold text-center drop-shadow mt-4 mb-15">Welcome to Akar Motors</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/stock-sheet">
                <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-slate-700 hover:bg-slate-800 shadow-lg transition">
                  <CubeIcon className="h-5 w-5" />
                  Stock Sheet
                </button>
              </Link>
              <Link to="/scheme-sheet">
                <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-indigo-700 hover:bg-indigo-800 shadow-lg transition">
                  <PercentBadgeIcon className="h-5 w-5"/>
                  Scheme Sheet
                </button>
              </Link>
              <Link to="/quotation">
                <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-blue-700 hover:bg-blue-800 shadow-lg transition">
                  <PencilSquareIcon className="h-5 w-5" />
                   Quotation
                </button>
              </Link>
              <Link to="/all-quotations">
                <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-sky-700 hover:bg-sky-800 shadow-lg transition">
                  <DocumentTextIcon className="h-5 w-5"/>
                   Quotation List
                </button>
              </Link>
              <Link to="/price-list">
                <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-gray-700 hover:bg-gray-800 shadow-lg transition">
                  <CurrencyRupeeIcon className="h-5 w-5" />
                   Price List
                </button>
              </Link>
              <Link to="/test-drive">
                <button 
                type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-violet-700 hover:bg-violet-800 shadow-lg transition">
                  <TruckIcon className="h-5 w-5" />
                   Test Drive
                </button>
              </Link>

              {localStorage.role === roles.AUDITOR && (
                <>
                  <div className="col-span-full mt-6">
                    <div className = "flex items-center justify-center gap-2 mb-5">
                      <WrenchScrewdriverIcon className="h-5 w-5" />
                      <h2 className="text-xl text-center font-bold text-white">Management Tools</h2> 
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link to="/update-quotation">
                        <button 
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg transition">
                          <DocumentCheckIcon className="h-5 w-5" />
                           Update Quotation
                        </button>
                      </Link>
                      <Link to="/update-stock">
                        <button 
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg transition">
                          <ArrowPathIcon className="h-5 w-5" />
                           Update Stock
                        </button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="relative z-10 text-center font-sans text-grey-800 text-md opacity-90 mt-6 py-2 rounded-b-xl">        
          Akar Autologix - Driven by Excellence
        </footer>
      </div>
    </>
  );
};

export default HomePage;
