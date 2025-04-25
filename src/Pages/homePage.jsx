import { Link } from "react-router";
import { BellIcon } from "@heroicons/react/24/outline";

import NotificationOverlay from "../Components/homePage/NotificationOverlay";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth/AuthProvider";
import { roles } from "../Routes/roles";


const HomePage = (req, res) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <div className="absolute top-28 right-12 z-10">
        <button
          onClick={() => setShowOverlay(true)}
          className="relative p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <BellIcon className="h-8 w-8 text-gray-800" />
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>
      </div>

      {showOverlay && <NotificationOverlay onClose={() => setShowOverlay(false)} />}

      <div className="h-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
          <div>
            <img src="./logo.jpg" alt="Logo" className="h-40 mx-auto" />
          </div>
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
            Akar Home Page
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/stock-sheet">
              <button
                type="button"
                className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 transition ease-in-out duration-300"
              >
                Stock Sheet
              </button>
            </Link>
            <Link to="/scheme-sheet">
              <button
                type="button"
                className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 transition ease-in-out duration-300"
              >
                Scheme Sheet
              </button>
            </Link>
            <Link to="/quotation">
              <button
                type="button"
                className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-purple-500 text-white hover:bg-purple-600 transition ease-in-out duration-300"
              >
                Quotation
              </button>
            </Link>
          </div>
            <div className="mt-6 lg:mt-8 hidden lg:flex justify-center gap-4">
              <Link to="/all-quotations">
                <button
                  type="button"
                  className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
                >
                  Quotations
                </button>
              </Link>
              <Link to="/booking-list">
                <button
                  type="button"
                  className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
                >
                  Booking List
                </button>
              </Link>
            </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
        <div className="flex justify-center gap-4">
          <Link to="/all-quotations">
            <button
              type="button"
              className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
            >
              Quotations
            </button>
          </Link>
          <Link to="/booking-list">
            <button
              type="button"
              className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
            >
              Booking List
            </button>
          </Link>
        </div>
      </div>

    </>
  );
};

export default HomePage;
