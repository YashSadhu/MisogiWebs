import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = ({ variant = 'default' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Hackathons', path: '/hackathon-listings-screen' },
    { name: 'Teams', path: '/team-formation-screen' },
    { name: 'Dashboard', path: '/team-dashboard-screen' },
  ];

  const isActive = (path) => location.pathname === path;

  const headerClasses = {
    default: 'bg-background border-b border-border',
    transparent: 'bg-transparent',
    compact: 'bg-background border-b border-border py-2'
  };

  const logoClasses = {
    default: 'h-8 w-auto',
    transparent: 'h-8 w-auto',
    compact: 'h-6 w-auto'
  };

  return (
    <header className={`sticky top-0 z-50 ${headerClasses[variant]}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Skip to content link for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
          >
            Skip to content
          </a>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/hackathon-listings-screen" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-text-primary">HackTeam</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-light' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and User Controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Search" size={16} className="text-text-tertiary" />
              </div>
              <input
                type="text"
                placeholder="Search hackathons..."
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-surface transition-colors"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <Icon name="ChevronDown" size={16} className="text-text-tertiary" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg border border-border py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-surface"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-surface"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-surface transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} className="text-text-primary" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary bg-primary-light' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Search" size={16} className="text-text-tertiary" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search hackathons..."
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;