import React, { useState, useEffect } from 'react';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  SupervisorAccount as SupervisorIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import hierarchyService from '../../services/hierarchyService';
import AssignUserModal from './components/AssignUserModal';
import BulkAssignModal from './components/BulkAssignModal';
import TeamHierarchyTree from './components/TeamHierarchyTree';

const TeamStructure = () => {
  const [teamStructure, setTeamStructure] = useState([]);
  const [availableUsers, setAvailableUsers] = useState({ subordinates: [], managers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, [selectedMonth]);

  const loadTeamData = async () => {
    setLoading(true);
    setError('');
    try {
      const [structureResponse, usersResponse] = await Promise.all([
        hierarchyService.getTeamStructure(selectedMonth),
        hierarchyService.getAvailableUsers()
      ]);
      
      setTeamStructure(structureResponse.data.structure || []);
      setAvailableUsers(usersResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleAssignSuccess = (message) => {
    setSuccess(message);
    loadTeamData();
    setAssignModalOpen(false);
    setBulkAssignModalOpen(false);
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    // Clear error message after 5 seconds
    setTimeout(() => setError(''), 5000);
  };

  const getStatsData = () => {
    const stats = {
      totalUsers: 0,
      totalManagers: 0,
      assignedUsers: 0,
      unassignedUsers: 0,
      teams: 0
    };

    const countStructure = (structure) => {
      structure.forEach(node => {
        stats.totalUsers++;
        
        if (node.subordinates && node.subordinates.length > 0) {
          stats.totalManagers++;
          stats.teams++;
          stats.assignedUsers += node.subordinates.length;
          countStructure(node.subordinates);
        }
      });
    };

    countStructure(teamStructure);
    stats.unassignedUsers = Math.max(0, availableUsers.subordinates.length - stats.assignedUsers);

    return stats;
  };

  const stats = getStatsData();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7);
    return {
      value: monthStr,
      label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Team Structure Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={loadTeamData}
              className="px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center cursor-pointer"
              title="Refresh Data"
            >
              <RefreshIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => setAssignModalOpen(true)}
            disabled={availableUsers.subordinates.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <AddIcon className="w-4 h-4" />
            Assign User
          </button>
          <button
            onClick={() => setBulkAssignModalOpen(true)}
            disabled={availableUsers.subordinates.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <GroupIcon className="w-4 h-4" />
            Bulk Assignment
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-blue-500 text-white rounded-lg p-4 text-center">
            <SupervisorIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalManagers}</div>
            <div className="text-sm opacity-90">Managers</div>
          </div>
          <div className="bg-purple-500 text-white rounded-lg p-4 text-center">
            <PersonIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm opacity-90">Total Users</div>
          </div>
          <div className="bg-green-500 text-white rounded-lg p-4 text-center">
            <GroupIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.assignedUsers}</div>
            <div className="text-sm opacity-90">Assigned Users</div>
          </div>
          <div className="bg-yellow-500 text-white rounded-lg p-4 text-center">
            <PersonIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.unassignedUsers}</div>
            <div className="text-sm opacity-90">Unassigned Users</div>
          </div>
          <div className="bg-indigo-500 text-white rounded-lg p-4 text-center col-span-2 sm:col-span-1">
            <GroupIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.teams}</div>
            <div className="text-sm opacity-90">Active Teams</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button
            onClick={() => setSuccess('')}
            className="text-green-500 hover:text-green-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Team Hierarchy */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-2">
          Team Hierarchy - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </h2>
        <div className="border-t border-gray-200 mb-6"></div>
        
        {teamStructure.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              No team structure found for this month
            </h3>
            <p className="text-sm text-gray-400">
              Start by assigning users to managers to build your team structure
            </p>
          </div>
        ) : (
          <TeamHierarchyTree 
            structure={teamStructure} 
            onRefresh={loadTeamData}
          />
        )}
      </div>

      <AssignUserModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onAssignSuccess={handleAssignSuccess}
        availableUsers={availableUsers}
        selectedMonth={selectedMonth}
      />

      <BulkAssignModal
        open={bulkAssignModalOpen}
        onClose={() => setBulkAssignModalOpen(false)}
        onAssignSuccess={handleAssignSuccess}
        availableUsers={availableUsers}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default TeamStructure;