import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth/AuthProvider';
import { getManagerDashboard, getDetailedTeamReport } from '../../services/dashboardService';
import DashboardLayout from '../../Components/dashboard/DashboardLayout';
import { ChartContainer } from '../../Components/dashboard/Charts';
import IconComponent from '../../Components/common/IconComponent';
import { toast } from 'react-toastify';

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [teamReportData, setTeamReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // This month
    endDate: new Date()
  });
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0]
      };
      
      const [dashboardResponse, teamReportResponse] = await Promise.all([
        getManagerDashboard(params),
        getDetailedTeamReport(params)
      ]);

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      } else {
        throw new Error(dashboardResponse.message || 'Failed to load manager dashboard');
      }

      if (teamReportResponse.success) {
        setTeamReportData(teamReportResponse.data);
      }

      // No fancy analytics required for SM view
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
      console.error('Manager Dashboard error:', err);
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
  // No analytics helpers required for simplified SM view

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
      <DashboardLayout title="Manager Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !dashboardData) {
    return (
      <DashboardLayout title="Manager Dashboard">
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
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'teams', label: 'Teams', icon: 'group' }
  ];

  return (
    <DashboardLayout title="Manager Dashboard">
      {/* Header with refresh and date picker */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <IconComponent 
              name="refresh" 
              className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} 
              size="small" 
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <input
            type="date"
            value={dateRange.startDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateRangeChange({
              ...dateRange,
              startDate: new Date(e.target.value)
            })}
            className="mr-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <span className="mx-2 text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateRangeChange({
              ...dateRange,
              endDate: new Date(e.target.value)
            })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {tabButtons.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
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

      {/* Organization Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Quotations"
          value={dashboardData?.organizationOverview?.totalQuotations || 0}
          icon="assessment"
          color="blue"
        />
        <KPICard
          title="Total Bookings"
          value={dashboardData?.organizationOverview?.totalBookings || 0}
          icon="checkCircle"
          color="green"
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(dashboardData?.organizationOverview?.totalRevenue)}
          icon="money"
          color="yellow"
        />
        <KPICard
          title="Total Customers"
          value={dashboardData?.organizationOverview?.totalCustomers || 0}
          icon="people"
          color="purple"
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Team Summary for SM */}
          {teamReportData?.summary && (
            <ChartContainer title="Team Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{teamReportData.summary.teamCount || 0}</p>
                  <p className="text-sm text-gray-600">Team Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{teamReportData.summary.totalQuotations || 0}</p>
                  <p className="text-sm text-gray-600">Total Quotations</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{teamReportData.summary.totalBookings || 0}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(teamReportData.summary.totalRevenue)}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{teamReportData.summary.totalCustomers || 0}</p>
                  <p className="text-sm text-gray-600">Total Customers</p>
                </div>
              </div>
            </ChartContainer>
          )}
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="space-y-6">
          {(teamReportData?.teams || []).map((team) => (
            <ChartContainer key={team.teamLeadId} title={`Team: ${team.teamLeadName}`}>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="text-sm text-gray-600">Team Size
                  <div className="text-xl font-semibold text-gray-900">{team.teamSize}</div>
                </div>
                <div className="text-sm text-gray-600">Quotations
                  <div className="text-xl font-semibold text-gray-900">{team.metrics.quotations}</div>
                </div>
                <div className="text-sm text-gray-600">Bookings
                  <div className="text-xl font-semibold text-gray-900">{team.metrics.bookings}</div>
                </div>
                <div className="text-sm text-gray-600">Revenue
                  <div className="text-xl font-semibold text-gray-900">{formatCurrency(team.metrics.revenue)}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quotations</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(team.members || []).map((m) => (
                      <tr key={m.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{m.metrics.quotations}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{m.metrics.bookings}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(m.metrics.revenue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{m.metrics.customers}</td>
                      </tr>
                    ))}
                    {(!team.members || team.members.length === 0) && (
                      <tr>
                        <td className="px-6 py-4 text-center text-sm text-gray-500" colSpan="6">No members found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ChartContainer>
          ))}
          {(!teamReportData?.teams || teamReportData.teams.length === 0) && (
            <ChartContainer title="Teams Performance">
              <div className="px-6 py-4 text-sm text-gray-500">No teams found</div>
            </ChartContainer>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

// KPI Card Component
const KPICard = ({ title, value, icon, color }) => {
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
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue}`}>
          <IconComponent name={icon} size="medium" />
        </div>
      </div>
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ insight }) => {
  const getInsightIcon = (type) => {
    const icons = {
      positive: 'trendingUp',
      negative: 'trendingDown',
      warning: 'warning',
      info: 'info',
      performance: 'assessment',
      revenue: 'money'
    };
    return icons[type] || 'info';
  };

  const getInsightColor = (type) => {
    const colors = {
      positive: 'green',
      negative: 'red',
      warning: 'yellow',
      info: 'blue',
      performance: 'purple',
      revenue: 'yellow'
    };
    return colors[type] || 'blue';
  };

  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  const color = getInsightColor(insight.type);

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-start space-x-3">
        <IconComponent 
          name={getInsightIcon(insight.type)} 
          size="small" 
          color={color}
        />
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{insight.title}</h4>
          <p className="text-sm mt-1">{insight.message || insight.description}</p>
          {insight.recommendation && (
            <p className="text-xs mt-2 font-medium">
              Recommendation: {insight.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;