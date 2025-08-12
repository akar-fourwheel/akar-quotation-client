import React from 'react';

/**
 * Reusable Dashboard Card Component
 * Used for displaying metrics, KPIs, and other dashboard content
 */
const DashboardCard = ({ 
  title, 
  children, 
  className = '', 
  headerActions = null,
  loading = false,
  error = null 
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center text-red-500">
          <div className="text-sm font-medium">Error loading data</div>
          <div className="text-xs text-gray-500 mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {headerActions}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;