import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material';
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
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Team Structure Management
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                label="Month"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const monthStr = date.toISOString().slice(0, 7);
                  return (
                    <MenuItem key={monthStr} value={monthStr}>
                      {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadTeamData} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" gap={2} mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAssignModalOpen(true)}
            disabled={availableUsers.subordinates.length === 0 || availableUsers.managers.length === 0}
          >
            Assign User
          </Button>
          <Button
            variant="outlined"
            startIcon={<GroupIcon />}
            onClick={() => setBulkAssignModalOpen(true)}
            disabled={availableUsers.subordinates.length === 0 || availableUsers.managers.length === 0}
          >
            Bulk Assignment
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <CardContent sx={{ pb: 1 }}>
                <SupervisorIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.totalManagers}</Typography>
                <Typography variant="body2">Managers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
              <CardContent sx={{ pb: 1 }}>
                <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.totalUsers}</Typography>
                <Typography variant="body2">Total Users</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <CardContent sx={{ pb: 1 }}>
                <GroupIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.assignedUsers}</Typography>
                <Typography variant="body2">Assigned Users</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <CardContent sx={{ pb: 1 }}>
                <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.unassignedUsers}</Typography>
                <Typography variant="body2">Unassigned Users</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
              <CardContent sx={{ pb: 1 }}>
                <GroupIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.teams}</Typography>
                <Typography variant="body2">Active Teams</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Team Hierarchy */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Team Hierarchy - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {teamStructure.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No team structure found for this month
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Start by assigning users to managers to build your team structure
            </Typography>
          </Box>
        ) : (
          <TeamHierarchyTree 
            structure={teamStructure} 
            onRefresh={loadTeamData}
          />
        )}
      </Paper>

      {/* Modals */}
      <AssignUserModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        availableUsers={availableUsers}
        selectedMonth={selectedMonth}
        onSuccess={handleAssignSuccess}
        onError={handleError}
      />

      <BulkAssignModal
        open={bulkAssignModalOpen}
        onClose={() => setBulkAssignModalOpen(false)}
        availableUsers={availableUsers}
        selectedMonth={selectedMonth}
        onSuccess={handleAssignSuccess}
        onError={handleError}
      />
    </Container>
  );
};

export default TeamStructure;