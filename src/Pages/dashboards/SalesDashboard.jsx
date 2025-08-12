import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth/AuthProvider';
import { getSalesDashboard, getSalesPerformanceComparison, getActivityFeed } from '../../services/dashboardService';
import DashboardLayout from '../../Components/dashboard/DashboardLayout';
import { BarChart, LineChart, DoughnutChart, ChartContainer } from '../../Components/dashboard/Charts';
import IconComponent, { DashboardIcons } from '../../Components/common/IconComponent';
import { toast } from 'react-toastify';

const SalesDashboard = () => {
  const { username } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    endDate: new Date()
  });
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0]
      };
      
      const [dashboardResponse, performanceResponse, activityResponse] = await Promise.all([
        getSalesDashboard(params),
        getSalesPerformanceComparison(params),
        getActivityFeed({ limit: 10 })
      ]);

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      } else {
        throw new Error(dashboardResponse.message || 'Failed to load sales dashboard');
      }
      
      if (performanceResponse.success) {
        setPerformanceData(performanceResponse.data);
      }

      if (activityResponse.success) {
        setActivityData(activityResponse.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
      console.error('Sales dashboard error:', err);
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
  const getQuotationsByVariantData = () => {
    if (!dashboardData?.breakdown?.quotations?.byVariant) return { labels: [], datasets: [] };
    
    const variants = dashboardData.breakdown.quotations.byVariant;
    return {
      labels: variants.map(v => v.variant || 'Unknown'),
      datasets: [{
        label: 'Quotations',
        data: variants.map(v => v.count || 0)
      }]
    };
  };

  const getBookingsByStatusData = () => {
    if (!dashboardData?.breakdown?.bookings?.byStatus) return { labels: [], datasets: [] };
    
    const statuses = dashboardData.breakdown.bookings.byStatus;
    return {
      labels: statuses.map(s => s.status || 'Unknown'),
      datasets: [{
        label: 'Bookings',
        data: statuses.map(s => s.count || 0)
      }]
    };
  };

  const getPerformanceTrendData = () => {
    if (!performanceData?.trends?.daily) return { labels: [], datasets: [] };
    
    const trends = performanceData.trends.daily.slice(-7); // Last 7 days
    return {
      labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Quotations',
          data: trends.map(t => t.quotations || 0),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: 'Bookings',
          data: trends.map(t => t.bookings || 0),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }
      ]
    };
  };

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
      <DashboardLayout title="Sales Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !dashboardData) {
    return (
      <DashboardLayout title="Sales Dashboard">
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

  return (
    <DashboardLayout title="Sales Dashboard">
      {/* Header with refresh and date picker */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {username}!
          </h1>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Quotations"
          value={dashboardData?.breakdown?.quotations?.total || 0}
          icon="assessment"
          color="blue"
          trend={dashboardData?.personalMetrics?.productivity?.quotationsPerDay}
          trendLabel="per day"
        />
        
        <KPICard
          title="Total Bookings"
          value={dashboardData?.breakdown?.bookings?.total || 0}
          icon="checkCircle"
          color="green"
          trend={dashboardData?.personalMetrics?.productivity?.bookingsPerDay}
          trendLabel="per day"
        />
        
        <KPICard
          title="Total Revenue"
          value={formatCurrency(dashboardData?.breakdown?.bookings?.totalValue)}
          icon="money"
          color="yellow"
          trend={formatCurrency(dashboardData?.personalMetrics?.revenue?.average)}
          trendLabel="avg deal"
        />
        
        <KPICard
          title="Conversion Rate"
          value={`${dashboardData?.breakdown?.customers?.conversionRate || '0%'}`}
          icon="trendingUp"
          color="purple"
          trend={dashboardData?.personalMetrics?.conversion?.quotationToBooking}
          trendLabel="quote to booking"
        />
      </div>

      {/* Personal Performance Metrics */}
      {dashboardData?.personalMetrics && (
        <div className="mb-6">
          <ChartContainer title="Personal Performance Overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Productivity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Quotations/Day:</span>
                    <span className="font-bold text-blue-800">{dashboardData.personalMetrics.productivity.quotationsPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Bookings/Day:</span>
                    <span className="font-bold text-blue-800">{dashboardData.personalMetrics.productivity.bookingsPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Customers/Day:</span>
                    <span className="font-bold text-blue-800">{dashboardData.personalMetrics.productivity.customersPerDay}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-3">Conversion Rates</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-green-600 text-sm">Quote → Booking</span>
                      <span className="text-green-800 font-bold">{dashboardData.personalMetrics.conversion.quotationToBooking}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{width: `${Math.min(dashboardData.personalMetrics.conversion.quotationToBooking, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-green-600 text-sm">Test Drive → Quote</span>
                      <span className="text-green-800 font-bold">{dashboardData.personalMetrics.conversion.testDriveToQuotation}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{width: `${Math.min(dashboardData.personalMetrics.conversion.testDriveToQuotation, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 mb-3">Revenue Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Total Revenue:</span>
                    <span className="font-bold text-yellow-800">{formatCurrency(dashboardData.personalMetrics.revenue.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Avg Deal Size:</span>
                    <span className="font-bold text-yellow-800">{formatCurrency(dashboardData.personalMetrics.revenue.average)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Revenue/Customer:</span>
                    <span className="font-bold text-yellow-800">{formatCurrency(dashboardData.personalMetrics.revenue.perCustomer)}</span>
                  </div>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quotations by Variant */}
        <ChartContainer title="Quotations by Variant">
          <BarChart
            data={getQuotationsByVariantData()}
            height={300}
            options={{
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </ChartContainer>

        {/* Bookings by Status */}
        <ChartContainer title="Bookings by Status">
          <DoughnutChart
            data={getBookingsByStatusData()}
            height={300}
          />
        </ChartContainer>

        {/* Performance Trends */}
        <ChartContainer title="Performance Trends (Last 7 Days)" className="lg:col-span-2">
          <LineChart
            data={getPerformanceTrendData()}
            height={300}
            options={{
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </ChartContainer>
      </div>

      {/* Targets and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Targets */}
        {dashboardData?.targets && (
          <ChartContainer title="Monthly Targets Progress">
            <div className="space-y-4">
              <TargetProgressBar
                label="Quotations"
                current={dashboardData.targets.monthly.quotations.achieved}
                target={dashboardData.targets.monthly.quotations.target}
                color="blue"
              />
              <TargetProgressBar
                label="Bookings"
                current={dashboardData.targets.monthly.bookings.achieved}
                target={dashboardData.targets.monthly.bookings.target}
                color="green"
              />
              <TargetProgressBar
                label="Revenue"
                current={dashboardData.targets.monthly.revenue.achieved}
                target={dashboardData.targets.monthly.revenue.target}
                color="yellow"
                formatValue={formatCurrency}
              />
            </div>
          </ChartContainer>
        )}

        {/* Recent Activity */}
        <ChartContainer title="Recent Activity">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activityData.length > 0 ? (
              activityData.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <IconComponent name="info" size="large" color="secondary" />
                <p className="mt-2">No recent activity</p>
              </div>
            )}
          </div>
        </ChartContainer>
      </div>
    </DashboardLayout>
  );
};

// KPI Card Component
const KPICard = ({ title, value, icon, color, trend, trendLabel }) => {
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
          {trend && (
            <p className="text-xs text-gray-500 mt-1">
              {trend} {trendLabel}
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

// Target Progress Bar Component
const TargetProgressBar = ({ label, current, target, color, formatValue = (v) => v }) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {formatValue(current)} / {formatValue(target)} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color] || colorClasses.blue}`}
          style={{width: `${percentage}%`}}
        ></div>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      quotation: 'assessment',
      booking: 'checkCircle',
      customer: 'person',
      'test-drive': 'directionsCar'
    };
    return icons[type] || 'info';
  };

  const getActivityColor = (type) => {
    const colors = {
      quotation: 'blue',
      booking: 'green',
      customer: 'purple',
      'test-drive': 'yellow'
    };
    return colors[type] || 'gray';
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-full bg-${getActivityColor(activity.type)}-100`}>
        <IconComponent 
          name={getActivityIcon(activity.type)} 
          size="small" 
          color={getActivityColor(activity.type)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SalesDashboard;