import React, { useState } from 'react';
import Icon from '../AppIcon';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount] = useState(3);

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleProfileAction = (action) => {
    console.log(`Profile action: ${action}`);
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-surface border-b border-secondary-200 shadow-soft">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon 
              name="Pill" 
              size={24} 
              color="white" 
              strokeWidth={2}
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-text-primary">MedTracker</h1>
            <p className="text-xs text-text-secondary">Healthcare Management</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Notifications"
          >
            <Icon name="Bell" size={20} strokeWidth={2} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-error rounded-full">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-2 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Settings"
          >
            <Icon name="Settings" size={20} strokeWidth={2} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={handleProfileToggle}
              className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="User profile"
              aria-expanded={isProfileOpen}
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="#2563EB" strokeWidth={2} />
              </div>
              <span className="hidden md:block text-sm font-medium text-text-primary">
                Dr. Sarah Wilson
              </span>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-elevated border border-secondary-200 py-2 z-1100">
                <div className="px-4 py-3 border-b border-secondary-200">
                  <p className="text-sm font-medium text-text-primary">Dr. Sarah Wilson</p>
                  <p className="text-xs text-text-secondary">sarah.wilson@healthcare.com</p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => handleProfileAction('profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-smooth"
                  >
                    <Icon name="User" size={16} className="mr-3" />
                    My Profile
                  </button>
                  
                  <button
                    onClick={() => handleProfileAction('switch')}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-smooth"
                  >
                    <Icon name="Users" size={16} className="mr-3" />
                    Switch Profile
                  </button>
                  
                  <button
                    onClick={() => handleProfileAction('preferences')}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-smooth"
                  >
                    <Icon name="Settings" size={16} className="mr-3" />
                    Preferences
                  </button>
                </div>
                
                <div className="border-t border-secondary-200 py-1">
                  <button
                    onClick={() => handleProfileAction('logout')}
                    className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-smooth"
                  >
                    <Icon name="LogOut" size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;