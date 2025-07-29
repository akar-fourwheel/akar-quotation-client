import React, { useState } from 'react';
import {
  Person as PersonIcon,
  SupervisorAccount as SupervisorIcon
} from '@mui/icons-material';
import hierarchyService from '../../../services/hierarchyService';

const AssignUserModal = ({ 
  open, 
  onClose, 
  availableUsers, 
  selectedMonth, 
  onAssignSuccess 
}) => {
  const [selectedSubordinate, setSelectedSubordinate] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleClose = () => {
    if (!loading) {
      setSelectedSubordinate('');
      setSelectedManager('');
      setTeamName('');
      setLocalError('');
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubordinate || !selectedManager) {
      setLocalError('Please select both subordinate and manager');
      return;
    }

    setLoading(true);
    setLocalError('');

    try {
      const response = await hierarchyService.assignUser(
        selectedSubordinate,
        selectedManager,
        selectedMonth,
        teamName.trim()
      );

      onAssignSuccess(response.message || 'User assigned successfully');
      handleClose();
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedSubordinateDetails = () => {
    return availableUsers.subordinates.find(user => user.user_id === selectedSubordinate);
  };

  const getSelectedManagerDetails = () => {
    return availableUsers.managers.find(user => user.user_id === selectedManager);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign User to Manager</h2>
          <p className="text-sm text-gray-600 mt-1">
            Assign a subordinate to a manager for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
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
              {availableUsers.managers.sort((a, b) => a.role.localeCompare(b.role)).map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username} ({hierarchyService.getRoleDisplayName(user.role)})
                </option>
              ))}
            </select>
          </div>

          {/* Subordinate Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PersonIcon className="inline w-4 h-4 mr-1" />
              Select Subordinate
            </label>
            <select
              value={selectedSubordinate}
              onChange={(e) => setSelectedSubordinate(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a subordinate</option>
              {availableUsers.subordinates.sort((a, b) => b.role.localeCompare(a.role)).map((user) => (
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

          {/* Assignment Preview */}
          {selectedSubordinate && selectedManager && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Assignment Preview</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm mb-2">
                  <strong>Manager:</strong> {getSelectedManagerDetails()?.username} ({hierarchyService.getRoleDisplayName(getSelectedManagerDetails()?.role)})
                </p>
                <p className="text-sm mb-2">
                  <strong>Subordinate:</strong> {getSelectedSubordinateDetails()?.username} ({hierarchyService.getRoleDisplayName(getSelectedSubordinateDetails()?.role)})
                </p>
                <p className="text-sm mb-2">
                  <strong>Month:</strong> {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
                {teamName && (
                  <p className="text-sm">
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
            disabled={loading || !selectedSubordinate || !selectedManager}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {loading ? 'Assigning...' : 'Assign User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserModal; 