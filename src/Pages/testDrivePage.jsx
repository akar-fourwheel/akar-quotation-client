import { useEffect, useState, useContext, useRef } from "react";
import ListGroup from "../Components/testDriveComponents/ListGroup";
import AllRecords from "../Components/testDriveComponents/AllRecords";
import axios from "axios";
import { roles } from '../Routes/roles';
import { AuthContext } from '../context/auth/AuthProvider';

function TestDrivePage() {
  const [jsonData, setJsonData] = useState(null);
  const [records, setRecords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasNewRecords, setHasNewRecords] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { role } = useContext(AuthContext);
  const audioRef = useRef(null);
  const previousRecordsRef = useRef([]);
  const listGroupRef = useRef(null);

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    // Preload the audio
    audioRef.current.load();
  }, []);

  const getData = () => {
    axios.get("/test-drive", {
      params: {
        role
      }
    })
      .then((response) => {
        const jsonData = response.data;
        setJsonData(jsonData.joined);

        // Check for records with status 0
        if (jsonData.records?.data) {
          const currentRecords = jsonData.records.data;
          const pendingRecords = currentRecords.filter(record => record.status === 0);

          // Set hasNewRecords based on whether there are any pending records
          setHasNewRecords(pendingRecords.length > 0);

          if (previousRecordsRef.current.length > 0) {
            const newRecords = pendingRecords.filter(
              record => !previousRecordsRef.current.some(
                prev => prev.model === record.model && prev.sales_person === record.sales_person && prev.cx_name === record.cx_name
              )
            );

            if (newRecords.length > 0) {
              // Play sound with error handling
              try {
                audioRef.current.play().catch(error => {
                  console.error('Error playing notification sound:', error);
                });
              } catch (error) {
                console.error('Error with audio playback:', error);
              }
            }
          }
          previousRecordsRef.current = pendingRecords;
          setPendingRequests(pendingRecords);
        } else {
          setPendingRequests([]);
        }

        setRecords(jsonData.records || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
        setPendingRequests([]);
      });
  };

  useEffect(() => {
    getData();
    // Poll for new records every 10 seconds
    const interval = setInterval(getData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    // Reset audio to beginning
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    // Trigger notification modal in ListGroup
    if (listGroupRef.current) {
      listGroupRef.current.showNotificationModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="max-w-7xl mx-auto">
        {/* Vehicle Dashboard Card */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-center text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-list-check"></i>
                Vehicle Availability Dashboard
              </h2>
              {/* Notification Bell */}
              <button
                onClick={handleNotificationClick}
                className="relative p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title={hasNewRecords ? "New requests received!" : "No new requests!"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
                  <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <ListGroup 
                ref={listGroupRef}
                data={jsonData?.data || []} 
                getData={getData}
                pendingRecords={pendingRequests}
                hasNewRecords={hasNewRecords}
              />
            )}
            {error && (
              <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded shadow">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>
        {role === roles.ADMIN && (
          <div className="bg-white shadow-lg rounded-lg mt-10">
            <div className="bg-gray-200 text-gray-800 rounded-t-lg px-6 py-4">
              <h3 className="text-center text-xl font-semibold flex items-center justify-center gap-2">
                <i className="fas fa-history"></i>
                All Records
              </h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <AllRecords data={records.data.filter(record => record.in_km !== 0) || []} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestDrivePage;
