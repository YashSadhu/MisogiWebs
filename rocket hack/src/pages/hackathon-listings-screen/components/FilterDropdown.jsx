import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const FilterDropdown = ({ onFilterChange, currentFilter = 'all' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    { value: 'all', label: 'All Hackathons', icon: 'List' },
    { value: 'open', label: 'Registration Open', icon: 'Calendar' },
    { value: 'closed', label: 'Registration Closed', icon: 'CalendarX' },
    { value: 'upcoming', label: 'Starting Soon', icon: 'Clock' },
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'recent', label: 'Recently Added', icon: 'Plus' }
  ];

  const currentFilterOption = filterOptions.find(option => option.value === currentFilter);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelect = (filterValue) => {
    onFilterChange(filterValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Filter hackathons"
      >
        <Icon name="Filter" size={16} className="text-text-secondary" />
        <span className="text-sm font-medium text-text-primary">
          {currentFilterOption?.label || 'Filter'}
        </span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background rounded-lg shadow-lg border border-border py-2 z-50">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterSelect(option.value)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-surface transition-colors ${
                currentFilter === option.value ? 'bg-primary-light text-primary' : 'text-text-primary'
              }`}
            >
              <Icon 
                name={option.icon} 
                size={16} 
                className={currentFilter === option.value ? 'text-primary' : 'text-text-secondary'} 
              />
              <span className="text-sm font-medium">{option.label}</span>
              {currentFilter === option.value && (
                <Icon name="Check" size={16} className="text-primary ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;