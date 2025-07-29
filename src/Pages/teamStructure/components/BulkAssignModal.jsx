import React, { useState } from 'react';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  SupervisorAccount as SupervisorIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import hierarchyService from '../../../services/hierarchyService';

const BulkAssignModal = ({ 
  open, 
  onClose, 
  availableUsers, 
  selectedMonth, 
  onAssignSuccess 
}) => {
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedSubordinates, setSelectedSubordinates] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleClose = () => {
    if (!loading) {
      setSelectedManager('');
      setSelectedSubordinates([]);
      setTeamName('');
      setLocalError('');
      onClose();
    }
  };

  const handleSubordinateToggle = (userId) => {
    setSelectedSubordinates(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedManager || selectedSubordinates.length === 0) {
      setLocalError('Please select a manager and at least one subordinate');
      return;
    }

    setLoading(true);
    setLocalError('');

    try {
      const response = await hierarchyService.bulkAssignUsers(
        selectedManager,
        selectedSubordinates,
        selectedMonth,
        teamName.trim()
      );

      const message = `Bulk assignment completed: ${response.data.successful} successful, ${response.data.failed} failed`;
      onAssignSuccess(message);
      handleClose();
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getManagerDetails = () => {
    return availableUsers.managers.find(user => user.user_id === selectedManager);
  };

  const getSubordinateDetails = (userId) => {
    return availableUsers.subordinates.find(user => user.user_id === userId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Assignment</h2>
          <p className="text-sm text-gray-600 mt-1">
            Assign multiple subordinates to one manager for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {localError}
            </div>
          )}

          {/* Manager Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SupervisorIcon className="inline w-4 h-4 mr-1" />
              Select Manager
            </label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a manager</option>
              {availableUsers.managers.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username} ({hierarchyService.getRoleDisplayName(user.role)})
                </option>
              ))}
            </select>
          </div>

          {/* Team Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name (Optional)
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={loading}
              placeholder="Enter team name or leave blank"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Subordinates Selection */}
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Select Subordinates ({selectedSubordinates.length} selected)
          </h3>

          <div className="border border-gray-200 rounded-md mb-4 max-h-80 overflow-y-auto">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-1">Select</div>
                <div className="col-span-5">Name</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-3">User ID</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {availableUsers.subordinates.map((user) => (
                <div key={user.user_id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedSubordinates.includes(user.user_id)}
                        onChange={() => handleSubordinateToggle(user.user_id)}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-5 flex items-center">
                      <PersonIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">{user.username}</span>
                    </div>
                    <div className="col-span-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {hierarchyService.getRoleDisplayName(user.role)}
                      </span>
                    </div>
                    <div className="col-span-3 text-sm text-gray-500">{user.user_id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Summary */}
          {selectedManager && selectedSubordinates.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Assignment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                <p className="text-sm mb-3">
                  <strong>Manager:</strong> {getManagerDetails()?.username} ({hierarchyService.getRoleDisplayName(getManagerDetails()?.role)})
                </p>
                <p className="text-sm mb-3">
                  <strong>Subordinates ({selectedSubordinates.length}):</strong>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedSubordinates.map((userId) => {
                    const subordinate = getSubordinateDetails(userId);
                    return (
                      <span 
                        key={userId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <PersonIcon className="w-3 h-3 mr-1" />
                        {subordinate?.username} ({hierarchyService.getRoleDisplayName(subordinate?.role)})
                        <button
                          onClick={() => handleSubordinateToggle(userId)}
                          disabled={loading}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <DeleteIcon className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {teamName && (
                  <p className="text-sm mt-3">
                    <strong>Team Name:</strong> {teamName}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedManager || selectedSubordinates.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <GroupIcon className="w-4 h-4" />
            )}
            {loading ? 'Processing...' : `Assign ${selectedSubordinates.length} User(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkAssignModal; 