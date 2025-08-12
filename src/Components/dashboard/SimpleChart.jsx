import React from 'react';

/**
 * Simple Chart Components
 * Lightweight chart components without external libraries
 */

// Simple Bar Chart
export const SimpleBarChart = ({ data = [], title = '', height = 200, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-${height} bg-gray-50 rounded ${className}`}>
        <span className="text-gray-500 text-sm">No data available</span>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = `${80 / data.length}%`;

  return (
    <div className={`${className}`}>
      {title && <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>}
      <div className="flex items-end justify-between space-x-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 40) : 0;
          return (
            <div key={item.label || index} className="flex flex-col items-center" style={{ width: barWidth }}>
              <div className="flex flex-col items-center justify-end flex-1">
                <span className="text-xs text-gray-600 mb-1 font-medium">
                  {item.value}
                </span>
                <div
                  className="bg-blue-500 rounded-t transition-all duration-300 w-full min-h-[4px]"
                  style={{ height: `${barHeight}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2 text-center truncate w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple Donut Chart
export const SimpleDonutChart = ({ data = [], title = '', size = 120, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: size }}>
        <span className="text-gray-500 text-sm">No data</span>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  let cumulativePercentage = 0;
  const radius = size / 2 - 10;
  const center = size / 2;
  const strokeWidth = 20;

  return (
    <div className={`${className}`}>
      {title && <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">{title}</h4>}
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${(percentage / 100) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`;
              const strokeDashoffset = -((cumulativePercentage / 100) * (2 * Math.PI * radius));
              
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={item.label || index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          
          {/* Center total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{total}</span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-1 max-w-full">
          {data.map((item, index) => (
            <div key={item.label || index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-gray-600 truncate">{item.label}</span>
              <span className="text-gray-900 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple Line Chart (using CSS)
export const SimpleTrendChart = ({ data = [], title = '', height = 100, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded ${className}`} style={{ height }}>
        <span className="text-gray-500 text-sm">No trend data</span>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  return (
    <div className={`${className}`}>
      {title && <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>}
      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-between h-full">
          {data.map((item, index) => {
            const heightPercentage = ((item.value - minValue) / range) * 100;
            const isLast = index === data.length - 1;
            
            return (
              <div key={item.label || index} className="flex flex-col items-center relative flex-1">
                {/* Data point */}
                <div
                  className="bg-blue-500 rounded-full w-2 h-2 relative z-10"
                  style={{ 
                    bottom: `${heightPercentage}%`,
                    position: 'absolute'
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                    {item.value}
                  </div>
                </div>
                
                {/* Connect line to next point */}
                {!isLast && (
                  <div 
                    className="absolute bg-blue-300 h-0.5 z-0"
                    style={{
                      left: '50%',
                      width: '100%',
                      bottom: `${heightPercentage}%`,
                    }}
                  />
                )}
                
                {/* Label */}
                <span className="text-xs text-gray-500 mt-2 text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Progress Bar
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label = '', 
  color = 'blue', 
  showPercentage = true,
  className = '' 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className={`${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color] || colorClasses.blue}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default {
  SimpleBarChart,
  SimpleDonutChart,
  SimpleTrendChart,
  ProgressBar
};