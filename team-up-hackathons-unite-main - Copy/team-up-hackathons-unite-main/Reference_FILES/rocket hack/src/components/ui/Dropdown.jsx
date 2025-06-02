import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Dropdown = ({
  variant = 'select',
  placeholder = 'Select option...',
  options = [],
  value,
  onChange,
  onSelect,
  multiple = false,
  searchable = false,
  disabled = false,
  error,
  label,
  className = '',
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState(multiple ? (value || []) : value ? [value] : []);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelect = (option) => {
    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      setSelectedValues(newValues);
      onChange?.(newValues);
      onSelect?.(option, newValues);
    } else {
      setSelectedValues([option.value]);
      setIsOpen(false);
      setSearchTerm('');
      onChange?.(option.value);
      onSelect?.(option, option.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder;
    
    if (multiple) {
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option?.label || selectedValues[0];
      }
      return `${selectedValues.length} selected`;
    } else {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
  };

  const baseClasses = 'relative w-full';
  const triggerClasses = `flex items-center justify-between w-full px-3 py-2 text-left bg-background border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
    error 
      ? 'border-error focus:border-error focus:ring-error' :'border-border focus:border-primary focus:ring-primary'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}`;

  const dropdownClasses = 'absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto';

  if (variant === 'action-menu' || variant === 'user-menu') {
    return (
      <div ref={dropdownRef} className={`${baseClasses} ${className}`}>
        <button
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={triggerClasses}
          aria-expanded={isOpen}
          aria-haspopup="true"
          {...props}
        >
          {children || (
            <>
              <span className="flex items-center space-x-2">
                <Icon name="MoreVertical" size={16} />
                <span>Actions</span>
              </span>
              <Icon name="ChevronDown" size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {isOpen && (
          <div className={dropdownClasses}>
            <div className="py-1">
              {options.map((option, index) => (
                <button
                  key={option.value || index}
                  onClick={() => handleSelect(option)}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left transition-colors ${
                    option.destructive 
                      ? 'text-error hover:bg-red-50' :'text-text-primary hover:bg-surface'
                  } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={option.disabled}
                >
                  {option.icon && (
                    <Icon name={option.icon} size={16} className="mr-3" />
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium ${error ? 'text-error' : 'text-text-primary'}`}>
          {label}
        </label>
      )}
      
      <div ref={dropdownRef} className={baseClasses}>
        <button
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={triggerClasses}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          {...props}
        >
          <span className="block truncate">{getDisplayValue()}</span>
          <Icon name="ChevronDown" size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className={dropdownClasses} role="listbox">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-text-tertiary">
                  {searchTerm ? 'No results found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value || index}
                    onClick={() => handleSelect(option)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors hover:bg-surface ${
                      selectedValues.includes(option.value) ? 'bg-primary-light text-primary' : 'text-text-primary'
                    }`}
                    role="option"
                    aria-selected={selectedValues.includes(option.value)}
                  >
                    <span className="flex items-center">
                      {option.icon && (
                        <Icon name={option.icon} size={16} className="mr-3" />
                      )}
                      {option.label}
                    </span>
                    {multiple && selectedValues.includes(option.value) && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error flex items-center">
          <Icon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;