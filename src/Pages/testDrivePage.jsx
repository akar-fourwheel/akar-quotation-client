import { useEffect, useState, useContext } from "react";
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
  const { role } = useContext(AuthContext);


  const getData = () => {
    axios.get("/test-drive")
      .then((response) => {
        const jsonData = response.data;
        setJsonData(jsonData.joined);
        setRecords(jsonData.records || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto">
        {/* Vehicle Dashboard Card */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg px-6 py-4">
            <h2 className="text-center text-2xl font-bold flex items-center justify-center gap-2">
              <i className="fas fa-list-check"></i>
              Vehicle Availability Dashboard
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <ListGroup data={jsonData?.data || []} getData={getData} />
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
