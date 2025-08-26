import React, { useState } from 'react';

/**
 * Simple Date Range Picker Component
 * For filtering dashboard data by date ranges
 */
const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onChange, 
  presets = true,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const getPresetRanges = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return [
      {
        label: 'Today',
        startDate: today,
        endDate: now
      },
      {
        label: 'Last 7 days',
        startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: now
      },
      {
        label: 'Last 30 days',
        startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: now
      },
      {
        label: 'This month',
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now
      },
      {
        label: 'Last month',
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0)
      },
      {
        label: 'This quarter',
        startDate: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
        endDate: now
      }
    ];
  };

  const handlePresetClick = (preset) => {
    onChange(preset.startDate, preset.endDate);
    setIsOpen(false);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    onChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    onChange(startDate, newEndDate);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Start Date Input */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={formatDate(startDate)}
            onChange={handleStartDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* To Separator */}
        <div className="text-gray-400 mt-4">to</div>
        
        {/* End Date Input */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={formatDate(endDate)}
            onChange={handleEndDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Preset Button */}
        {presets && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Quick</label>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              Presets
              <svg className="w-4 h-4 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Preset Dropdown */}
      {presets && isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            {getPresetRanges().map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangePicker;