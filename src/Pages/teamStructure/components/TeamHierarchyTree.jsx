import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Collapse,
  IconButton,
  Grid,
  Divider,
  Tooltip,
  Badge
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  SupervisorAccount as SupervisorIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const TeamHierarchyTree = ({ structure, onRefresh }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const toggleExpanded = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
      case 'md':
      case 'gm':
      case 'sm':
        return <AdminIcon />;
      case 'teamLead':
        return <SupervisorIcon />;
      case 'sales':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
      case 'md':
        return 'error';
      case 'gm':
      case 'sm':
        return 'warning';
      case 'teamLead':
        return 'primary';
      case 'sales':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Admin',
      md: 'Managing Director',
      gm: 'General Manager',
      sm: 'Sales Manager',
      teamLead: 'Team Lead',
      sales: 'Customer Advisor'
    };
    return roleNames[role] || role;
  };

  const TreeNode = ({ node, level = 0, isLast = false, path = [] }) => {
    const nodeId = `${node.user_id}-${level}`;
    const isExpanded = expandedNodes.has(nodeId);
    const hasSubordinates = node.subordinates && node.subordinates.length > 0;
    const currentPath = [...path, node.username];

    return (
      <Box sx={{ ml: level > 0 ? 2 : 0, mb: 1 }}>
        {/* Connection Lines */}
        {level > 0 && (
          <Box
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -16,
                top: -8,
                width: 16,
                height: level === 1 ? 24 : 32,
                borderLeft: '2px solid #e0e0e0',
                borderBottom: '2px solid #e0e0e0',
                borderBottomLeftRadius: 8
              }
            }}
          />
        )}

        {/* Node Card */}
        <Card
          sx={{
            mb: 1,
            bgcolor: level === 0 ? 'primary.light' : 'background.paper',
            color: level === 0 ? 'white' : 'text.primary',
            border: level === 0 ? 'none' : '1px solid #e0e0e0',
            boxShadow: level === 0 ? 3 : 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: level === 0 ? 4 : 2,
              transform: 'translateY(-1px)'
            }
          }}
        >
          <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" flex={1}>
                {/* Avatar and User Info */}
                <Avatar
                  sx={{
                    bgcolor: getRoleColor(node.role) + '.main',
                    width: 40,
                    height: 40,
                    mr: 2
                  }}
                >
                  {getRoleIcon(node.role)}
                </Avatar>

                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {node.username}
                    </Typography>
                    <Chip
                      label={getRoleDisplayName(node.role)}
                      size="small"
                      color={getRoleColor(node.role)}
                      variant={level === 0 ? 'filled' : 'outlined'}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    ID: {node.user_id}
                  </Typography>

                  {node.team_name && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <GroupIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        Team: {node.team_name}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Subordinate Count Badge */}
                {hasSubordinates && (
                  <Badge
                    badgeContent={node.subordinates.length}
                    color="secondary"
                    sx={{ mr: 1 }}
                  >
                    <GroupIcon />
                  </Badge>
                )}
              </Box>

              {/* Expand/Collapse Button */}
              {hasSubordinates && (
                <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
                  <IconButton
                    onClick={() => toggleExpanded(nodeId)}
                    size="small"
                    sx={{
                      color: level === 0 ? 'white' : 'primary.main',
                      '&:hover': {
                        bgcolor: level === 0 ? 'rgba(255,255,255,0.1)' : 'primary.light'
                      }
                    }}
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Manager Information */}
            {node.manager && level > 0 && (
              <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <Typography variant="caption" color="text.secondary">
                  Reports to: {node.manager.username} ({getRoleDisplayName(node.manager.role)})
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Subordinates */}
        {hasSubordinates && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ position: 'relative' }}>
              {/* Vertical connector line */}
              {isExpanded && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: -8,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    bgcolor: 'divider',
                    opacity: 0.3
                  }}
                />
              )}

              {node.subordinates.map((subordinate, index) => (
                <TreeNode
                  key={`${subordinate.user_id}-${level + 1}`}
                  node={subordinate}
                  level={level + 1}
                  isLast={index === node.subordinates.length - 1}
                  path={currentPath}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  if (!structure || structure.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No team structure available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Team assignments will appear here once configured
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Quick Stats */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <CardContent sx={{ py: 1 }}>
                <Typography variant="h6">
                  {structure.reduce((acc, node) => {
                    const count = (n) => {
                      let total = n.role === 'teamLead' ? 1 : 0;
                      if (n.subordinates) {
                        total += n.subordinates.reduce((sum, sub) => sum + count(sub), 0);
                      }
                      return total;
                    };
                    return acc + count(node);
                  }, 0)}
                </Typography>
                <Typography variant="body2">Team Leads</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
              <CardContent sx={{ py: 1 }}>
                <Typography variant="h6">
                  {structure.reduce((acc, node) => {
                    const count = (n) => {
                      let total = n.role === 'sales' ? 1 : 0;
                      if (n.subordinates) {
                        total += n.subordinates.reduce((sum, sub) => sum + count(sub), 0);
                      }
                      return total;
                    };
                    return acc + count(node);
                  }, 0)}
                </Typography>
                <Typography variant="body2">Customer Advisors</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <CardContent sx={{ py: 1 }}>
                <Typography variant="h6">
                  {structure.filter(node => 
                    node.subordinates && node.subordinates.length > 0
                  ).length}
                </Typography>
                <Typography variant="body2">Active Teams</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Hierarchy Tree */}
      <Box>
        {structure.map((node, index) => (
          <TreeNode
            key={`${node.user_id}-0`}
            node={node}
            level={0}
            isLast={index === structure.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TeamHierarchyTree; 