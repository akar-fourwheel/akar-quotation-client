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
  Divider
} from '@mui/material';
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
  onSuccess, 
  onError 
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

      onSuccess(response.message || 'User assigned successfully');
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

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div">
          Assign User to Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assign a subordinate to a manager for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {/* Subordinate Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Subordinate</InputLabel>
            <Select
              value={selectedSubordinate}
              onChange={(e) => setSelectedSubordinate(e.target.value)}
              label="Select Subordinate"
              disabled={loading}
              startAdornment={<PersonIcon sx={{ mr: 1, color: 'action.active' }} />}
            >
              <MenuItem value="">
                <em>Choose a subordinate</em>
              </MenuItem>
              {availableUsers.subordinates.map((user) => (
                <MenuItem key={user.user_id} value={user.user_id}>
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                    {user.username} ({hierarchyService.getRoleDisplayName(user.role)}) - ID: {user.user_id}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

          {/* Assignment Preview */}
          {selectedSubordinate && selectedManager && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Assignment Preview
              </Typography>
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Subordinate:</strong> {getSelectedSubordinateDetails()?.username} ({hierarchyService.getRoleDisplayName(getSelectedSubordinateDetails()?.role)}) - ID: {selectedSubordinate}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Manager:</strong> {getSelectedManagerDetails()?.username} ({hierarchyService.getRoleDisplayName(getSelectedManagerDetails()?.role)}) - ID: {selectedManager}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Month:</strong> {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </Typography>
                {teamName && (
                  <Typography variant="body2">
                    <strong>Team Name:</strong> {teamName}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
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
          disabled={loading || !selectedSubordinate || !selectedManager}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? 'Assigning...' : 'Assign User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUserModal; 