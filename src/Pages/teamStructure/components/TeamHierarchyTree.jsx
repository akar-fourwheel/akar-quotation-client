import React, { useState } from 'react';
import { ExpandMoreIcon, ExpandLessIcon, PersonIcon, SupervisorIcon, GroupIcon, AdminIcon } from '../../../utils/icons';

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
        return <AdminIcon className="w-4 h-4" />;
      case 'teamLead':
        return <SupervisorIcon className="w-4 h-4" />;
      case 'sales':
        return <PersonIcon className="w-4 h-4" />;
      default:
        return <PersonIcon className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
      case 'md':
        return 'bg-red-500';
      case 'gm':
      case 'sm':
        return 'bg-yellow-500';
      case 'teamLead':
        return 'bg-blue-500';
      case 'sales':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleColorBorder = (role) => {
    switch (role) {
      case 'admin':
      case 'md':
        return 'border-red-200';
      case 'gm':
      case 'sm':
        return 'border-yellow-200';
      case 'teamLead':
        return 'border-blue-200';
      case 'sales':
        return 'border-purple-200';
      default:
        return 'border-gray-200';
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
      <div className={`${level > 0 ? 'ml-4 sm:ml-8' : ''} mb-2`}>
        {/* Connection Lines */}
        {level > 0 && (
          <div className="relative">
            <div className="absolute -left-4 sm:-left-8 top-0 w-4 sm:w-8 h-6 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"></div>
          </div>
        )}

        {/* Node Card */}
        <div
          className={`mb-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
            level === 0 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                {/* Avatar and User Info */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white mr-2 sm:mr-3 flex-shrink-0 ${getRoleColor(node.role)}`}>
                  {getRoleIcon(node.role)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-semibold truncate">
                      {node.username}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      level === 0 
                        ? 'bg-white bg-opacity-20 text-black' 
                        : `${getRoleColorBorder(node.role)} ${getRoleColor(node.role)} text-white`
                    }`}>
                      {getRoleDisplayName(node.role)}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm mb-1 ${level === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
                    ID: {node.user_id}
                  </p>

                  {node.team_name && (
                    <div className="flex items-center gap-1">
                      <GroupIcon className="w-4 h-4" />
                      <p className={`text-xs sm:text-sm italic ${level === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
                        Team: {node.team_name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Subordinate Count Badge */}
                {hasSubordinates && (
                  <div className="relative flex-shrink-0 mr-2">
                    <GroupIcon className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {node.subordinates.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Expand/Collapse Button */}
              {hasSubordinates && (
                <button
                  onClick={() => toggleExpanded(nodeId)}
                  className={`p-1 rounded-full transition-colors flex-shrink-0 ${
                    level === 0 
                      ? 'hover:bg-white hover:bg-opacity-10 text-white' 
                      : 'hover:bg-blue-50 text-blue-600'
                  }`}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <ExpandLessIcon className="w-5 h-5" /> : <ExpandMoreIcon className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Manager Information */}
            {node.manager && level > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200 border-opacity-20">
                <p className="text-xs text-gray-400">
                  Reports to: {node.manager.username} ({getRoleDisplayName(node.manager.role)})
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subordinates */}
        {hasSubordinates && isExpanded && (
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 opacity-30"></div>
            
            {node.subordinates.map((subordinate, index) => (
              <TreeNode
                key={`${subordinate.user_id}-${level + 1}`}
                node={subordinate}
                level={level + 1}
                isLast={index === node.subordinates.length - 1}
                path={currentPath}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!structure || structure.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <GroupIcon className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          No team structure available
        </h3>
        <p className="text-sm text-gray-400">
          Team assignments will appear here once configured
        </p>
      </div>
    );
  }

  const countByRole = (structure, targetRole) => {
    return structure.reduce((acc, node) => {
      const count = (n) => {
        let total = n.role === targetRole ? 1 : 0;
        if (n.subordinates) {
          total += n.subordinates.reduce((sum, sub) => sum + count(sub), 0);
        }
        return total;
      };
      return acc + count(node);
    }, 0);
  };

  return (
    <div>
      {/* Quick Stats */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">
              {countByRole(structure, 'teamLead')}
            </div>
            <div className="text-sm opacity-90">Team Leads</div>
          </div>
          <div className="bg-purple-500 text-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">
              {countByRole(structure, 'sales')}
            </div>
            <div className="text-sm opacity-90">Customer Advisors</div>
          </div>
          <div className="bg-green-500 text-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">
              {structure.filter(node => 
                node.subordinates && node.subordinates.length > 0
              ).length}
            </div>
            <div className="text-sm opacity-90">Active Teams</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mb-6"></div>

      {/* Hierarchy Tree */}
      <div>
        {structure.map((node, index) => (
          <TreeNode
            key={`${node.user_id}-0`}
            node={node}
            level={0}
            isLast={index === structure.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamHierarchyTree; 