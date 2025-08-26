import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/auth/AuthProvider';
import { roles } from '../../Routes/roles';
import { testDashboardConnection } from '../../services/dashboardService';
import SalesDashboard from './SalesDashboard';
import TeamLeadDashboard from './TeamLeadDashboard';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import IconComponent from '../../Components/common/IconComponent';
import MdDashboard from './MdDashboard';

const DashboardSelector = () => {
  const { role, userId, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !userId || !role) {
      navigate('/login');
      return;
    }

    const testConnection = async () => {
      try {
        setConnectionStatus('checking');
        // const response = await testDashboardConnection();
        const response = { success: true };
        if (response.success) {
          setConnectionStatus('connected');
        } else {
          throw new Error(response.message || 'Connection failed');
        }
      } catch (err) {
        console.error('Dashboard connection error:', err);
        setConnectionStatus('failed');
        setError(err.message || 'Failed to connect to dashboard service');
      }
    };

    testConnection();
  }, [userId, role, isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show connection status while checking dashboard connection
  if (connectionStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show connection error
  if (connectionStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <IconComponent name="error" size="xlarge" color="error" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Dashboard Connection Failed
          </h3>
          <p className="text-gray-600 mb-4">
            {error || 'Unable to connect to dashboard service. Please try again.'}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Retry Connection
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (role) {
      case roles.SALES:
      case 'sales':
        return <SalesDashboard />;
      
      case roles.TEAML:
      case 'teamLead':
      case 'teamlead':
        return <TeamLeadDashboard />;
      
      case roles.SM:
      case roles.GM:
      case 'sm':
      case 'gm':
        return <ManagerDashboard />;
      
      case roles.ADMIN:
      case 'admin':
        return <AdminDashboard />;

      case roles.MD:
      case 'md':
        return <MdDashboard />;
      
      case roles.AUDITOR:
      case 'audit':
      case 'auditor':
        return <SalesDashboard />;
      
      case roles.RECEPTION:
      case roles.CRE:
      case 'receptionist':
      case 'cre':
        return <SalesDashboard />;
      
      case roles.GUARD:
      case 'guard':
        return <SalesDashboard />;

      case roles.ACCOUNT:
      case roles.FINANCE:
      case roles.INSURANCE:
      case roles.EDP:
      case 'account':
      case 'finance':
      case 'insurance':
      case 'edp':
        return <SalesDashboard />;
      
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="mb-4">
                <IconComponent name="info" size="xlarge" color="warning" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Dashboard Not Available
              </h3>
              <p className="text-gray-600 mb-4">
                Dashboard for role "{role}" is not configured yet.
              </p>
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Current Role:</strong> {role}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>User ID:</strong> {userId}
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
};

export default DashboardSelector;