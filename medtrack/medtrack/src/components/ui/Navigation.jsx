import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard-home',
      icon: 'Home',
      tooltip: "Today\'s medications and quick stats"
    },
    {
      label: 'Analytics',
      path: '/analytics-dashboard',
      icon: 'BarChart3',
      tooltip: 'Adherence insights and reporting'
    },
    {
      label: 'Calendar',
      path: '/calendar-integration',
      icon: 'Calendar',
      tooltip: 'Integration and reminder settings'
    }
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation - Horizontal Tabs */}
      <nav 
        className="hidden md:block sticky top-16 z-900 bg-surface border-b border-secondary-200 shadow-soft"
        role="tablist"
        aria-label="Main navigation"
      >
        <div className="flex items-center px-6">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleTabClick(item.path)}
              className={`
                flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-smooth
                border-b-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${isActiveTab(item.path)
                  ? 'text-primary border-primary bg-primary-50' :'text-text-secondary border-transparent hover:text-primary hover:border-secondary-300 hover:bg-secondary-50'
                }
              `}
              role="tab"
              aria-selected={isActiveTab(item.path)}
              aria-label={item.tooltip}
              title={item.tooltip}
            >
              <Icon 
                name={item.icon} 
                size={18} 
                strokeWidth={2}
                className={isActiveTab(item.path) ? 'text-primary' : 'text-current'}
              />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-900 bg-surface border-t border-secondary-200 shadow-elevated"
        role="tablist"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleTabClick(item.path)}
              className={`
                flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-smooth
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${isActiveTab(item.path)
                  ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-secondary-50'
                }
              `}
              role="tab"
              aria-selected={isActiveTab(item.path)}
              aria-label={item.tooltip}
              title={item.tooltip}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                strokeWidth={2}
                className={isActiveTab(item.path) ? 'text-primary' : 'text-current'}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActiveTab(item.path) && (
                <div className="w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;