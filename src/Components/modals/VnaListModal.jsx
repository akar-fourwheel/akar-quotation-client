import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showError } from '../../utils/toast.js';
import getDate from '../../utils/getDate.js'


const VnaListModal = ({ onClose }) => {

  const [vnaData, setVnaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStockDetails, setShowStockDetails] = useState(false);
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('INPROGRESS');

  useEffect(() => {
    const fetchVnaData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/vna-list');
        setVnaData(response.data);
      } catch (error) {
        console.error('Error fetching VNA data:', error);
        showError('Failed to load VNA list');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVnaData();
  }, []);

  const getPlantStockYearInfo = (item, year) => {
    const y2024 = item['Y_2024'] || 0;
    const y2025 = item['Y_2025'] || 0;

    if (year === '2024') {
      return y2024 > 0 ? 'Available' : '-';
    } else if (year === '2025') {
      return y2025 > 0 ? 'Available' : '-';
    }
  };

  const handleStockClick = (stockData, stockType) => {
    setSelectedStockData({ data: stockData, type: stockType });
    setShowStockDetails(true);
  };

  const filteredData = vnaData.filter(row => row.booking_status?.trim().toLowerCase() === bookingStatusFilter.toLowerCase());

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#00000061] backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#00000061] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Vehicle Not Available (VNA) List</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setBookingStatusFilter('INPROGRESS')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium ${bookingStatusFilter === 'INPROGRESS'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setBookingStatusFilter('CANCELLED')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium ${bookingStatusFilter === 'CANCELLED'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Cancelled
          </button>
        </div>



        <div className="overflow-x-auto max-h-[70vh]">
          {vnaData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No VNA records found</div>
              <div className="text-gray-500 text-sm">All vehicles are currently available in stock</div>
            </div>
          ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Quotation ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Customer Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Sales Person
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Vehicle Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Stock Availability
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Request Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Request Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {row.quotation_id}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">{row.customer_name || 'N/A'}</div>
                              <div className="text-gray-500 text-xs">
                                {row.customer_phone || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {row.sales_advisor || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">{row.product_line}</div>
                              <div className="text-gray-500 text-xs">
                                {row.manufacturing_yr} • {row.fuel} • {row.vc_color}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {row.stockAvailability && (
                                <div className="space-y-1">
                                  {row.stockAvailability.zawl_stock.length > 0 && (
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => handleStockClick(row.stockAvailability.zawl_stock, 'ZAWL')}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 hover:bg-green-200 cursor-pointer transition-colors"
                                      >
                                        ZAWL
                                      </button>
                                      <span className="text-xs text-gray-600">
                                        {row.stockAvailability.zawl_stock.length} available
                                      </span>
                                    </div>
                                  )}
                                  {row.stockAvailability.zonal_stock.length > 0 && (
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => handleStockClick(row.stockAvailability.zonal_stock, 'ZONAL')}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 hover:bg-blue-200 cursor-pointer transition-colors"
                                      >
                                        ZONAL
                                      </button>
                                      <span className="text-xs text-gray-600">
                                        {row.stockAvailability.zonal_stock.length} available
                                      </span>
                                    </div>
                                  )}
                                  {row.stockAvailability.plant_stock.length > 0 && (
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => handleStockClick(row.stockAvailability.plant_stock, 'PLANT')}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2 hover:bg-purple-200 cursor-pointer transition-colors"
                                      >
                                        PLANT
                                      </button>
                                      <span className="text-xs text-gray-600">
                                        {row.stockAvailability.plant_stock.length} available
                                      </span>
                                    </div>
                                  )}
                                  {row.stockAvailability.zawl_stock.length === 0 &&
                                    row.stockAvailability.zonal_stock.length === 0 &&
                                    row.stockAvailability.plant_stock.length === 0 && (
                                      <span className="text-xs text-red-600">Not available in any stock</span>
                                    )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {getDate(row.created_on)}
                            </div>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {row.booking_status || 'N/A'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block lg:hidden space-y-2">
                  {filteredData.map((row, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
                      {/* Header with Quotation ID and Status */}
                      <div className="flex justify-between items-baseline mb-2">
                        <div className="text-sm font-semibold text-gray-900">
                          {row.quotation_id}
                        </div>
                        <div className="flex flex-col items-end text-right min-w-[80px]">
                          <div className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                            {row.booking_status || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 text-right md:break-all leading-tight">
                            {getDate(row.created_on)}
                          </div>
                        </div>
                      </div>

                      {/* Main Content in Grid */}
                      {/* Customer + Vehicle on left, Sales + Stock on right */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                          {/* Customer */}
                          <div>
                            <div className="text-xs text-gray-600 mb-0.5">Customer</div>
                            <div className="text-sm font-medium text-gray-900 leading-tight">{row.customer_name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{row.customer_phone || 'N/A'}</div>
                          </div>

                          {/* Vehicle */}
                          <div>
                            <div className="text-xs text-gray-600 mb-0.5">Vehicle</div>
                            <div className="text-sm font-medium text-gray-900 leading-tight break-all">{row.product_line}</div>
                            <div className="text-xs text-gray-500">{row.manufacturing_yr} • {row.vc_color}</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between text-right gap-2">
                          {/* Sales Person */}
                          <div>
                            <div className="text-xs text-gray-600 mb-0.5">Sales Person</div>
                            <div className="text-sm text-gray-900">{row.sales_advisor || 'N/A'}</div>
                          </div>

                          {/* Stock */}
                          <div>
                            <div className="text-xs text-gray-600 mb-0.5">Stock</div>
                            {row.stockAvailability && (
                              <div className="flex flex-wrap justify-end gap-1">
                                {row.stockAvailability.zawl_stock.length > 0 && (
                                  <button
                                    onClick={() => handleStockClick(row.stockAvailability.zawl_stock, 'ZAWL')}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
                                  >
                                    ZAWL ({row.stockAvailability.zawl_stock.length})
                                  </button>
                                )}
                                {row.stockAvailability.zonal_stock.length > 0 && (
                                  <button
                                    onClick={() => handleStockClick(row.stockAvailability.zonal_stock, 'ZONAL')}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  >
                                    ZONAL ({row.stockAvailability.zonal_stock.length})
                                  </button>
                                )}
                                {row.stockAvailability.plant_stock.length > 0 && (
                                  <button
                                    onClick={() => handleStockClick(row.stockAvailability.plant_stock, 'PLANT')}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200"
                                  >
                                    PLANT ({row.stockAvailability.plant_stock.length})
                                  </button>
                                )}
                                {row.stockAvailability.zawl_stock.length === 0 &&
                                  row.stockAvailability.zonal_stock.length === 0 &&
                                  row.stockAvailability.plant_stock.length === 0 && (
                                    <span className="text-xs text-red-600">Not available</span>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </>

          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Stock Details Modal */}
      {showStockDetails && selectedStockData && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedStockData.type} Stock Details
              </h3>
              <button
                onClick={() => setShowStockDetails(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto max-h-[60vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedStockData.type === 'ZAWL' && (
                      <>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Material</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Model</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Variant</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Color</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Serial Number</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Plant</th>
                      </>
                    )}
                    {selectedStockData.type === 'ZONAL' && (
                      <>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Region</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Dealer</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">City</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Chassis No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Color</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      </>
                    )}
                    {selectedStockData.type === 'PLANT' && (
                      <>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Model</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Material</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Variant</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Color</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Y_2024</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Y_2025</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedStockData.data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {selectedStockData.type === 'ZAWL' && (
                        <>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Material || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Model || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Varient || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Color || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Serial_number || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Plant || '-'}</td>
                        </>
                      )}
                      {selectedStockData.type === 'ZONAL' && (
                        <>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Region || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Dealer || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.City || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Chassis_No || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Colour || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Logical_Status || '-'}</td>
                        </>
                      )}
                      {selectedStockData.type === 'PLANT' && (
                        <>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Model || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Material || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Variant || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.Color || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{getPlantStockYearInfo(item, '2024') || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{getPlantStockYearInfo(item, '2025') || '-'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowStockDetails(false)}
                className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VnaListModal; 