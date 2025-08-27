import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth/AuthProvider';
import { getTeamLeadDashboard, getActivityFeed } from '../../services/dashboardService';
import DashboardLayout from '../../Components/dashboard/DashboardLayout';
import { BarChart, LineChart, DoughnutChart, ChartContainer } from '../../Components/dashboard/Charts';
import IconComponent, { DashboardIcons } from '../../Components/common/IconComponent';
import { toast } from 'react-toastify';

const TeamLeadDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingApproval, setProcessingApproval] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // This month
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
      
      const [dashboardResponse, activityResponse] = await Promise.all([
        getTeamLeadDashboard(params),
        getActivityFeed({ limit: 15 })
      ]);

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      } else {
        throw new Error(dashboardResponse.message || 'Failed to load team lead dashboard');
      }

      if (activityResponse.success) {
        setActivityData(activityResponse.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
      console.error('Team Lead Dashboard error:', err);
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

  // Handle booking approval
  const handleBookingApproval = async (bookingId, action, comments = '') => {
    // try {
    //   setProcessingApproval(bookingId);
    //   const requestData = {
    //     bookingId,
    //     action,
    //     comments
    //   };
      
    //   const response = await approveBookingRequest(requestData);

    //   if (response.success) {
    //     toast.success(`Booking ${action}d successfully!`);
    //     // Refresh dashboard data to reflect changes
    //     await fetchDashboardData();
    //   } else {
    //     throw new Error(response.message || `Failed to ${action} booking`);
    //   }
    // } catch (err) {
    //   toast.error(err.message || `Failed to ${action} booking`);
    //   console.error('Booking approval error:', err);
    // } finally {
    //   setProcessingApproval(null);
    // }
  };

  // Data formatting functions for charts
  const getTeamPerformanceData = () => {
    if (!dashboardData?.teamMembers) return { labels: [], datasets: [] };
    
    const members = dashboardData.teamMembers;
    return {
      labels: members.map(m => m.username || 'Unknown'),
      datasets: [
        {
          label: 'Quotations',
          data: members.map(m => m.performance?.quotations || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        },
        {
          label: 'Bookings',
          data: members.map(m => m.performance?.bookings || 0),
          backgroundColor: 'rgba(16, 185, 129, 0.8)'
        }
      ]
    };
  };

  const getTeamRevenueData = () => {
    if (!dashboardData?.teamMembers) return { labels: [], datasets: [] };
    
    const members = dashboardData.teamMembers;
    return {
      labels: members.map(m => m.username || 'Unknown'),
      datasets: [{
        label: 'Revenue (₹)',
        data: members.map(m => m.performance?.revenue || 0)
      }]
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
      <DashboardLayout title="Team Lead Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !dashboardData) {
    return (
      <DashboardLayout title="Team Lead Dashboard">
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
    <DashboardLayout title="Team Lead Dashboard">
      {/* Header with refresh and date picker */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Team Lead Dashboard
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

      {/* Team Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Team Quotations"
          value={dashboardData?.teamOverview?.totalQuotations || 0}
          icon="assessment"
          color="blue"
          trend={`${dashboardData?.teamPerformance?.teamSize || 0} members`}
          trendLabel=""
        />
        
        <KPICard
          title="Team Bookings"
          value={dashboardData?.teamOverview?.totalBookings || 0}
          icon="checkCircle"
          color="green"
          trend={`${dashboardData?.teamPerformance?.avgBookingsPerMember || 0} avg/member`}
          trendLabel=""
        />
        
        <KPICard
          title="Team Revenue"
          value={formatCurrency(dashboardData?.teamOverview?.totalRevenue)}
          icon="money"
          color="yellow"
          trend={formatCurrency(dashboardData?.teamPerformance?.avgRevenuePerMember)}
          trendLabel="avg/member"
        />
        
        <KPICard
          title="Pending Approvals"
          value={dashboardData?.teamOverview?.pendingApprovals || 0}
          icon="warning"
          color="red"
          trend={dashboardData?.teamOverview?.conversionRate || '0%'}
          trendLabel="conversion rate"
        />
      </div>

      {/* Team Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team Member Performance */}
        <ChartContainer title="Team Performance Comparison">
          <BarChart
            data={getTeamPerformanceData()}
            height={350}
            options={{
              plugins: {
                legend: { position: 'top' }
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

        {/* Team Revenue Distribution */}
        <ChartContainer title="Revenue by Team Member">
          <BarChart
            data={getTeamRevenueData()}
            height={350}
            options={{
              plugins: {
                legend: { display: false }
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45
                  }
                },
                y: {
                  ticks: {
                    callback: function(value) {
                      return '₹' + new Intl.NumberFormat('en-IN', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(value);
                    }
                  }
                }
              }
            }}
          />
        </ChartContainer>
      </div>

      {/* Pending Approvals and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Approvals */}
        <ChartContainer title="Pending Booking Approvals">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {dashboardData?.pendingApprovals?.length > 0 ? (
              dashboardData.pendingApprovals.map((approval) => (
                <PendingApprovalCard
                  key={approval.id || approval.bookingId}
                  approval={approval}
                  onApprove={(comments) => handleBookingApproval(approval.bookingId, 'approve', comments)}
                  onReject={(comments) => handleBookingApproval(approval.bookingId, 'reject', comments)}
                  processing={processingApproval === approval.bookingId}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <IconComponent name="checkCircle" size="large" color="success" />
                <p className="mt-2">No pending approvals</p>
              </div>
            )}
          </div>
        </ChartContainer>

        {/* Recent Activity */}
        <ChartContainer title="Recent Team Activity">
          <div className="space-y-3 max-h-96 overflow-y-auto">
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

      {/* Team Members Performance Table */}
      {dashboardData?.teamMembers && dashboardData.teamMembers.length > 0 && (
        <ChartContainer title="Detailed Team Performance">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quotations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.teamMembers.map((member) => (
                  <tr key={member.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <IconComponent name="person" size="small" color="blue" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.username || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.performance?.quotations || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.performance?.bookings || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(member.performance?.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.performance?.conversionRate || '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartContainer>
      )}
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

// Pending Approval Card Component
const PendingApprovalCard = ({ approval, onApprove, onReject, processing }) => {
  const [comments, setComments] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleApprove = () => {
    onApprove(comments);
    setComments('');
    setShowComments(false);
  };

  const handleReject = () => {
    onReject(comments);
    setComments('');
    setShowComments(false);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">
            Booking #{approval.bookingId || approval.id}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {approval.customerName || approval.customer_name || 'Unknown Customer'}
          </p>
          <p className="text-sm text-gray-600">
            {approval.model || approval.Model || 'Unknown Model'}
          </p>
          <p className="text-sm text-gray-600">
            Amount: ₹{new Intl.NumberFormat('en-IN').format(approval.amount || approval.Booking_Amount || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Requested: {new Date(approval.timestamp || approval.booking_timestamp || Date.now()).toLocaleString()}
          </p>
        </div>
        {/* 
        // TODO: Uncomment this when the approval is implemented
        {/* <div className="flex space-x-2 ml-4">
          <button
            onClick={handleApprove}
            disabled={processing}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            <IconComponent name="checkCircle" size="small" className="mr-1" />
            Approve
          </button>
          <button
            onClick={handleReject}
            disabled={processing}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <IconComponent name="cancel" size="small" className="mr-1" />
            Reject
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <IconComponent name="edit" size="small" className="mr-1" />
            Comment
          </button>
        </div> */}
      </div>
      
      {showComments && (
        <div className="mt-3">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add comments (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
      )}
      
      {processing && (
        <div className="mt-2 text-xs text-blue-600">
          Processing...
        </div>
      )}
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

export default TeamLeadDashboard;