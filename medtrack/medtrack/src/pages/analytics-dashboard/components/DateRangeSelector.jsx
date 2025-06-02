import React from 'react';
import Icon from 'components/AppIcon';

const DateRangeSelector = ({ selectedRange, onRangeChange }) => {
  const dateRanges = [
    { value: '7days', label: '7 Days', icon: 'Calendar' },
    { value: '30days', label: '30 Days', icon: 'Calendar' },
    { value: '3months', label: '3 Months', icon: 'Calendar' },
    { value: '6months', label: '6 Months', icon: 'Calendar' },
    { value: 'custom', label: 'Custom Range', icon: 'CalendarRange' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2 sm:mb-0">
        <Icon name="Calendar" size={16} className="text-primary" />
        <span>Date Range:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {dateRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            className={`
              flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-smooth
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${selectedRange === range.value
                ? 'bg-primary text-white' :'bg-secondary-50 text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
              }
            `}
          >
            <Icon name={range.icon} size={14} />
            <span>{range.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeSelector;