import React, { useState, useEffect } from 'react';
import { getAdminDashboard, getSystemHealth, getDashboardOverview } from '../../services/dashboardService';
import DashboardLayout from '../../Components/dashboard/DashboardLayout';
import { BarChart, DoughnutChart, ChartContainer } from '../../Components/dashboard/Charts';
import IconComponent from '../../Components/common/IconComponent';
import { toast } from 'react-toastify';

const MdDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0]
      };
      
      const [dashboardResponse, healthResponse, overviewResponse] = await Promise.all([
        getAdminDashboard(params),
        getSystemHealth(),
        getDashboardOverview(params)
      ]);

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      } else {
        throw new Error(dashboardResponse.message || 'Failed to load admin dashboard');
      }

      if (healthResponse.success) {
        setSystemHealth(healthResponse.data);
      }

      if (overviewResponse.success) {
        setOverviewData(overviewResponse.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
      console.error('Admin Dashboard error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Data formatting functions for charts
  const getSystemOverviewData = () => {
    if (!dashboardData?.systemOverview) return { labels: [], datasets: [] };
    
    const overview = dashboardData.systemOverview;
    return {
      labels: ['Quotations', 'Bookings', 'Customers', 'Active Users'],
      datasets: [{
        label: 'Count',
        data: [
          overview.totalQuotations || 0,
          overview.totalBookings || 0,
          overview.totalCustomers || 0,
          overview.activeUsers || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(215, 197, 255, 0.8)'
        ]
      }]
    };
  };

  const getUserActivityData = () => {
    if (!dashboardData?.userActivity?.topPerformers) return { labels: [], datasets: [] };
    
    const performers = dashboardData.userActivity.topPerformers;
    return {
      labels: performers.map(p => p.username || 'Unknown'),
      datasets: [
        {
          label: 'Quotations',
          data: performers.map(p => p.quotations || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        },
        {
          label: 'Bookings',
          data: performers.map(p => p.bookings || 0),
          backgroundColor: 'rgba(16, 185, 129, 0.8)'
        }
      ]
    };
  };

  const getInventoryData = () => {
    if (!dashboardData?.breakdown?.inventory?.byModel) return { labels: [], datasets: [] };
    
    const inventory = dashboardData.breakdown.inventory.byModel;
    return {
      labels: inventory.map(i => i.model || 'Unknown'),
      datasets: [{
        label: 'Stock Count',
        data: inventory.map(i => i.count || 0)
      }]
    };
  };

//   const getSystemHealthData = () => {
//     if (!systemHealth?.components) return { labels: [], datasets: [] };
    
//     const components = systemHealth.components;
//     const healthyCount = Object.values(components).filter(c => c.status === 'healthy').length;
//     const unhealthyCount = Object.values(components).length - healthyCount;
    
//     return {
//       labels: ['Healthy', 'Issues'],
//       datasets: [{
//         data: [healthyCount, unhealthyCount],
//         backgroundColor: [
//           'rgba(16, 185, 129, 0.8)',
//           'rgba(239, 68, 68, 0.8)'
//         ]
//       }]
//     };
//   };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  if (loading && !dashboardData) {
    return (
      <DashboardLayout title="MD Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !dashboardData) {
    return (
      <DashboardLayout title="MD Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <IconComponent name="error" className="text-red-400" size="small" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabButtons = [
    { id: 'overview', label: 'System Overview', icon: 'dashboard' },
    { id: 'users', label: 'User Management', icon: 'people' },
    // { id: 'health', label: 'System Health', icon: 'settings' },
    // { id: 'alerts', label: 'Alerts', icon: 'warning' }
  ];

  return (
    <DashboardLayout title="MD Dashboard">
      {/* Header with refresh and date picker */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-end">
          <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="cursor-pointer inline-flex items-center mr-2 px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <IconComponent 
                name="refresh" 
                className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} 
                size="small" 
              />
              {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <input
            type="date"
            value={dateRange.startDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateRangeChange({
              ...dateRange,
              startDate: new Date(e.target.value)
            })}
            className="mr-2 px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer"
          />
          <span className="mx-2 text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateRangeChange({
              ...dateRange,
              endDate: new Date(e.target.value)
            })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer"
          />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {tabButtons.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconComponent name={tab.icon} size="small" className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* System Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Users"
          value={dashboardData?.systemOverview?.activeUsers || 0}
          icon="people"
          color="blue"
          status={systemHealth?.overall}
        />
        
        <KPICard
          title="System Health"
          value={systemHealth?.overall || 'Unknown'}
          icon="settings"
          color={systemHealth?.overall === 'healthy' ? 'green' : 'red'}
        />
        
        <KPICard
          title="Total Revenue"
          value={formatCurrency(dashboardData?.systemOverview?.totalRevenue)}
          icon="money"
          color="yellow"
        />
        
        <KPICard
          title="Inventory Count"
          value={dashboardData?.systemOverview?.totalInventoryValue}
          icon="storefront"
          color="purple"
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="System Overview">
              <DoughnutChart
                data={getSystemOverviewData()}
                height={300}
              />
            </ChartContainer>

            <ChartContainer title="Inventory by Model">
              <BarChart
                data={getInventoryData()}
                height={300}
                options={{
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    x: {
                      ticks: {
                        maxRotation: 45
                      }
                    }
                  }
                }}
              />
            </ChartContainer>
          </div>

          {/* Revenue and Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Business Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-600">Total Quotations:</span>
                  <span className="font-bold text-blue-800">{formatNumber(dashboardData?.systemOverview?.totalQuotations)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Total Bookings:</span>
                  <span className="font-bold text-blue-800">{formatNumber(dashboardData?.systemOverview?.totalBookings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Total Customers:</span>
                  <span className="font-bold text-blue-800">{formatNumber(dashboardData?.systemOverview?.totalCustomers)}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Financial Overview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600">Total Revenue:</span>
                  <span className="font-bold text-green-800">{formatCurrency(dashboardData?.systemOverview?.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Inventory Value:</span>
                  <span className="font-bold text-green-800">{formatCurrency(dashboardData?.systemOverview?.totalInventoryValue)}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-600">Active Users:</span>
                  <span className="font-bold text-purple-800">{dashboardData?.systemOverview?.activeUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600">System Health:</span>
                  <span className={`font-bold ${systemHealth?.overall === 'healthy' ? 'text-green-800' : 'text-red-800'}`}>
                    {systemHealth?.overall || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Activity */}
          <ChartContainer title="Top Performers">
            <BarChart
              data={getUserActivityData()}
              height={350}
              options={{
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </ChartContainer>

          {/* User Statistics */}
          {dashboardData?.userActivity && (
            <ChartContainer title="User Statistics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.userActivity.totalActiveUsers}</p>
                  <p className="text-sm text-blue-700">Total Active Users</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{dashboardData.userActivity.newUsersThisMonth}</p>
                  <p className="text-sm text-green-700">New Users This Month</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">{dashboardData.userActivity.topPerformers?.length || 0}</p>
                  <p className="text-sm text-yellow-700">Top Performers</p>
                </div>
              </div>
            </ChartContainer>
          )}
        </div>
      )}

      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="System Components Health">
              <PieChart
                data={getSystemHealthData()}
                height={300}
              />
            </ChartContainer>

            <ChartContainer title="Component Details">
              <div className="space-y-3">
                {systemHealth?.components && Object.entries(systemHealth.components).map(([component, details]) => (
                  <div key={component} className={`p-3 rounded-lg border ${
                    details.status === 'healthy' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{component}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        details.status === 'healthy'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {details.status}
                      </span>
                    </div>
                    {details.responseTime && (
                      <p className="text-sm text-gray-600 mt-1">
                        Response Time: {details.responseTime}
                      </p>
                    )}
                    {details.error && (
                      <p className="text-sm text-red-600 mt-1">
                        Error: {details.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ChartContainer>
          </div>

          {/* System Metrics */}
          {systemHealth?.components?.system && (
            <ChartContainer title="System Metrics">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{systemHealth.components.system.uptime || 'N/A'}</p>
                  <p className="text-sm text-blue-700">Uptime</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{systemHealth.components.system.memoryUsage || 'N/A'}</p>
                  <p className="text-sm text-green-700">Memory Usage</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{systemHealth.components.system.cpuUsage || 'N/A'}</p>
                  <p className="text-sm text-yellow-700">CPU Usage</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{systemHealth.components.system.activeConnections || 'N/A'}</p>
                  <p className="text-sm text-purple-700">Active Connections</p>
                </div>
              </div>
            </ChartContainer>
          )}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* System Alerts */}
          <ChartContainer title="System Alerts">
            <div className="space-y-3">
              {dashboardData?.systemAlerts && dashboardData.systemAlerts.length > 0 ? (
                dashboardData.systemAlerts.map((alert, index) => (
                  <AlertCard key={index} alert={alert} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <IconComponent name="checkCircle" size="large" color="success" />
                  <p className="mt-2">No system alerts</p>
                </div>
              )}
            </div>
          </ChartContainer>
        </div>
      )}
    </DashboardLayout>
  );
};

// KPI Card Component
const KPICard = ({ title, value, icon, color, status }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-purple-500 text-white',
    red: 'bg-red-500 text-white'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {status && (
            <p className={`text-xs mt-1 ${
              status === 'healthy' ? 'text-green-600' : 'text-red-600'
            }`}>
              Status: {status}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue}`}>
          <IconComponent name={icon} size="medium" />
        </div>
      </div>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ alert }) => {
  const getAlertIcon = (type) => {
    const icons = {
      warning: 'warning',
      error: 'error',
      info: 'info',
      success: 'checkCircle'
    };
    return icons[type] || 'info';
  };

  const getAlertColor = (priority) => {
    const colors = {
      high: 'red',
      medium: 'yellow',
      low: 'blue'
    };
    return colors[priority] || 'blue';
  };

  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const color = getAlertColor(alert.priority);

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-start space-x-3">
        <IconComponent 
          name={getAlertIcon(alert.type)} 
          size="small" 
          color={color}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">{alert.title}</h4>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              alert.priority === 'high' 
                ? 'bg-red-100 text-red-800'
                : alert.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {alert.priority} priority
            </span>
          </div>
          <p className="text-sm mt-1">{alert.message}</p>
          <p className="text-xs mt-2">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MdDashboard;