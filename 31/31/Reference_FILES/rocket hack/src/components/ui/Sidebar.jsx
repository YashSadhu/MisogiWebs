import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ variant = 'expanded' }) => {
  const [isCollapsed, setIsCollapsed] = useState(variant === 'collapsed');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Hackathons',
      path: '/hackathon-listings-screen',
      icon: 'Calendar',
      description: 'Browse and join hackathons'
    },
    {
      name: 'Team Formation',
      path: '/team-formation-screen',
      icon: 'Users',
      description: 'Find teammates and create teams'
    },
    {
      name: 'Dashboard',
      path: '/team-dashboard-screen',
      icon: 'LayoutDashboard',
      description: 'Manage your teams and projects'
    },
    {
      name: 'Hackathon Details',
      path: '/hackathon-details-registration-screen',
      icon: 'Info',
      description: 'View hackathon information'
    },
  ];

  const quickActions = [
    { name: 'Create Team', icon: 'Plus', action: () => console.log('Create team') },
    { name: 'Join Hackathon', icon: 'UserPlus', action: () => console.log('Join hackathon') },
    { name: 'View Profile', icon: 'User', action: () => console.log('View profile') },
  ];

  const isActive = (path) => location.pathname === path;

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  if (variant === 'mobile') {
    return (
      <>
        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleMobileToggle}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-text-primary">HackTeam</span>
            </div>
            <button
              onClick={handleMobileToggle}
              className="p-2 rounded-md hover:bg-surface transition-colors"
              aria-label="Close sidebar"
            >
              <Icon name="X" size={20} className="text-text-primary" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleMobileToggle}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-light text-primary border-l-4 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <Icon name={item.icon} size={20} />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-text-tertiary">{item.description}</div>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={handleMobileToggle}
          className="fixed top-4 left-4 z-30 p-2 bg-background border border-border rounded-md shadow-lg lg:hidden"
          aria-label="Open sidebar"
        >
          <Icon name="Menu" size={20} className="text-text-primary" />
        </button>
      </>
    );
  }

  return (
    <div className={`hidden lg:flex flex-col bg-background border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-text-primary">HackTeam</span>
          </div>
        )}
        <button
          onClick={handleToggleCollapse}
          className="p-2 rounded-md hover:bg-surface transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon 
            name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
            size={20} 
            className="text-text-primary" 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors group ${
              isActive(item.path)
                ? 'bg-primary-light text-primary border-l-4 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
            aria-current={isActive(item.path) ? 'page' : undefined}
            title={isCollapsed ? item.name : ''}
          >
            <Icon name={item.icon} size={20} />
            {!isCollapsed && (
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-text-tertiary group-hover:text-text-secondary">
                  {item.description}
                </div>
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={action.action}
                className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              >
                <Icon name={action.icon} size={16} />
                <span className="text-sm">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed Quick Actions */}
      {isCollapsed && (
        <div className="p-2 border-t border-border">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={action.action}
              className="flex items-center justify-center w-full p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors mb-2"
              title={action.name}
            >
              <Icon name={action.icon} size={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;