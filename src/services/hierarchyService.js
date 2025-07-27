import axios from 'axios';

const BASE_ENDPOINT = '/hierarchy';

class HierarchyService {
  // Get team structure for a specific month
  async getTeamStructure(month = null) {
    try {
      const params = month ? { month } : {};
      const response = await axios.get(`${BASE_ENDPOINT}/team-structure`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching team structure:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch team structure');
    }
  }

  // Get subordinates for current user
  async getSubordinates(includeIndirect = true, month = null) {
    try {
      const params = { 
        includeIndirect: includeIndirect.toString(),
        ...(month && { month })
      };
      const response = await axios.get(`${BASE_ENDPOINT}/subordinates`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching subordinates:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subordinates');
    }
  }

  // Get manager chain for current user
  async getManagerChain(month = null) {
    try {
      const params = month ? { month } : {};
      const response = await axios.get(`${BASE_ENDPOINT}/managers`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching manager chain:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch manager chain');
    }
  }

  // Get available users based on caller's role
  async getAvailableUsers() {
    try {
      const response = await axios.get(`${BASE_ENDPOINT}/available-users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch available users');
    }
  }

  // Generic assignment - assign any subordinate to any manager
  async assignUser(subordinateUserId, managerUserId, assignmentMonth, teamName = '') {
    try {
      const response = await axios.post(`${BASE_ENDPOINT}/assign-user`, {
        subordinateUserId,
        managerUserId,
        assignmentMonth,
        teamName
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning user:', error);
      throw new Error(error.response?.data?.message || 'Failed to assign user');
    }
  }

  // Bulk assignment - assign multiple subordinates to one manager
  async bulkAssignUsers(managerUserId, subordinateUserIds, assignmentMonth, teamName = '') {
    try {
      const response = await axios.post(`${BASE_ENDPOINT}/bulk-assign`, {
        managerUserId,
        subordinateUserIds,
        assignmentMonth,
        teamName
      });
      return response.data;
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      throw new Error(error.response?.data?.message || 'Failed to perform bulk assignment');
    }
  }

  // Helper method to format month for API calls
  formatMonth(date) {
    if (!date) return null;
    return date.toISOString().slice(0, 7); // YYYY-MM format
  }

  // Helper method to get current month in API format
  getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
  }

  // Helper method to get role display names
  getRoleDisplayName(role) {
    const roleNames = {
      admin: 'Admin',
      md: 'Managing Director',
      gm: 'General Manager',
      sm: 'Sales Manager',
      teamLead: 'Team Lead',
      sales: 'Customer Advisor'
    };
    return roleNames[role] || role;
  }

  // Helper method to check if a role can manage another
  canRoleManage(managerRole, subordinateRole) {
    const roleLevels = {
      'sales': 1,
      'teamLead': 2,
      'sm': 3,
      'gm': 4,
      'md': 5,
      'admin': 6
    };

    const managerLevel = roleLevels[managerRole] || 0;
    const subordinateLevel = roleLevels[subordinateRole] || 0;
    
    return managerLevel > subordinateLevel;
  }
}

export default new HierarchyService(); 