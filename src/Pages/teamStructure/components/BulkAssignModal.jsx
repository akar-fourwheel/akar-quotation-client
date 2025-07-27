import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
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
  onSuccess, 
  onError 
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
      onSuccess(message);
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

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px', maxHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div">
          Bulk Assignment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assign multiple subordinates to one manager for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ overflow: 'visible' }}>
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        {/* Manager Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Manager</InputLabel>
          <Select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            label="Select Manager"
            disabled={loading}
            startAdornment={<SupervisorIcon sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="">
              <em>Choose a manager</em>
            </MenuItem>
            {availableUsers.managers.map((user) => (
              <MenuItem key={user.user_id} value={user.user_id}>
                <Box display="flex" alignItems="center">
                  <SupervisorIcon sx={{ mr: 1, fontSize: 18 }} />
                  {user.username} ({hierarchyService.getRoleDisplayName(user.role)}) - ID: {user.user_id}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Team Name */}
        <TextField
          fullWidth
          label="Team Name (Optional)"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          disabled={loading}
          placeholder="Enter team name or leave blank"
          sx={{ mb: 3 }}
        />

        {/* Subordinates Selection */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Subordinates ({selectedSubordinates.length} selected)
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3, maxHeight: '300px', overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Select</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>User ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableUsers.subordinates.map((user) => (
                <TableRow key={user.user_id} hover>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSubordinates.includes(user.user_id)}
                      onChange={() => handleSubordinateToggle(user.user_id)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={hierarchyService.getRoleDisplayName(user.role)} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{user.user_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Assignment Summary */}
        {selectedManager && selectedSubordinates.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Assignment Summary
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, maxHeight: '200px', overflow: 'auto' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Manager:</strong> {getManagerDetails()?.username} ({hierarchyService.getRoleDisplayName(getManagerDetails()?.role)})
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Subordinates ({selectedSubordinates.length}):</strong>
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedSubordinates.map((userId) => {
                  const subordinate = getSubordinateDetails(userId);
                  return (
                    <Chip 
                      key={userId}
                      icon={<PersonIcon />} 
                      label={`${subordinate?.username} (${hierarchyService.getRoleDisplayName(subordinate?.role)})`}
                      size="small" 
                      onDelete={() => handleSubordinateToggle(userId)}
                      disabled={loading}
                    />
                  );
                })}
              </Box>

              {teamName && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Team Name:</strong> {teamName}
                </Typography>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedManager || selectedSubordinates.length === 0}
          startIcon={loading ? <CircularProgress size={18} /> : <GroupIcon />}
        >
          {loading ? 'Processing...' : `Assign ${selectedSubordinates.length} User(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkAssignModal; 