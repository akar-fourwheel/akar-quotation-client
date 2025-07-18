import { useEffect, useState, useContext, useCallback, useRef } from "react";
import ListGroup from "../Components/testDriveComponents/ListGroup";
import axios from "axios";
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';
import { showError, showSuccess } from "../utils/toast";
import RequestNotificationModal from "../Components/testDriveComponents/RequestNotificationModal";
import TestDriveVehicleList from "../Components/testDriveComponents/TestDriveVehicleList";

function TestDrivePage() {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [hasNewRecords, setHasNewRecords] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { role } = useContext(AuthContext);
  const audioRef = useRef(null);
  const previousRecordsRef = useRef([]);
  const listGroupRef = useRef(null);
  const [vehiclesData, setVehiclesData] = useState();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [actionStates, setActionStates] = useState({});
  const [activeTab, setActiveTab] = useState('pending');

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    // Preload the audio
    audioRef.current.load();
  }, []);

  const fetchPendingRequests = useCallback(() => {
    axios.get("/test-drive/pending-requests")
      .then((response) => {
        const jsonData = response.data;
        if (jsonData.rows.length > 0) setHasNewRecords(true);
        setPendingRequests(jsonData.rows);
        setStatusLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setStatusLoading(false);
      });
  }, []);
  
  useEffect(() => {
    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 30000);
  
    return () => clearInterval(interval);
  }, [fetchPendingRequests]);
  
  useEffect(() => {
    axios.get("/test-drive/get-demo-vehicles")  
      .then((response) => {
        setVehiclesData(response.data.rows);
      })
      .catch((error) => {
        console.error('Error fetching demo vehicles:', error);
        setError(error.message);
      });
  }, []);

  const handleNotificationClick = () => {    
    // Reset audio to beginning
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setShowNotificationModal(true);
  };

  const handleAccept = async(requestId) => {
    try {
      await axios.put(`/test-drive/accept`, { id: requestId })
      .then((res) => setPendingRequests(pendingRequests.filter((req) => req.id != requestId)))
      
      showSuccess('Request Accepted!')
    } catch (error) {
      showError('Some issue in Accepting request !')
    }
    setShowNotificationModal(false);
  };

  const handleReject = async(requestId, remark) => {
    try {
      await axios.put(`/test-drive/reject`, { id: requestId, remark })
      .then((res) => setPendingRequests(pendingRequests.filter((req) => req.id != requestId)))
      
      showSuccess('Request Rejected!')
    } catch (error) {
      showError('Some issue in rejecting request !')
    }
    setShowNotificationModal(false);
  };

return (
  <div className="min-h-screen bg-gray-100 relative py-12 px-2">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Vehicle Dashboard Card */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
              <i className="fas fa-list-check hidden sm:inline"></i>
              <span className="text-center sm:text-left">Vehicle Availability Dashboard</span>
            </h2>
            {/* Notification Bell */}
            {(role === roles.ADMIN || role === roles.MD || role === roles.GUARD) && ( 
            <button
              onClick={handleNotificationClick}
              className="relative p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer flex-shrink-0"
              title={hasNewRecords ? "New requests received!" : "No new requests!"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {hasNewRecords && (
                <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
              )}
            </button>)}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {statusLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TestDriveVehicleList
                data={vehiclesData || []}
                pendingRequests={pendingRequests}
                getData={fetchPendingRequests}
              />
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-100 text-red-700 px-3 sm:px-4 py-3 rounded shadow text-sm sm:text-base">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
    <RequestNotificationModal
      show={showNotificationModal}
      onClose={() => setShowNotificationModal(false)}
      pendingRequests={pendingRequests}
      onAccept={handleAccept}
      onReject={handleReject}
      actionStates={actionStates}
      setActionStates={setActionStates}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  </div>
);
}

export default TestDrivePage;