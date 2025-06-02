import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, subDays } from 'date-fns';

const CalendarHeatmap = ({ data, title }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get calendar days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = subDays(monthStart, getDay(monthStart));
  const endDate = addDays(monthEnd, 6 - getDay(monthEnd));
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Get adherence level for a specific date
  const getAdherenceLevel = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = data.find(d => d.date === dateStr);
    
    if (!dayData) return 0;
    
    const adherence = dayData.adherence;
    if (adherence >= 95) return 4;
    if (adherence >= 80) return 3;
    if (adherence >= 60) return 2;
    if (adherence >= 40) return 1;
    return 0;
  };

  // Get color class based on adherence level
  const getColorClass = (level) => {
    const colors = [
      'bg-secondary-100', // No data
      'bg-error-200',     // Very low (0-39%)
      'bg-warning-200',   // Low (40-59%)
      'bg-warning-400',   // Medium (60-79%)
      'bg-success-400',   // Good (80-94%)
      'bg-success-600'    // Excellent (95-100%)
    ];
    return colors[level] || colors[0];
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = data.find(d => d.date === dateStr);
    setSelectedDate(dayData);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentMonth(subDays(monthStart, 1));
    } else {
      setCurrentMonth(addDays(monthEnd, 1));
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary">Visual representation of daily adherence patterns</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <span className="text-sm font-medium text-text-primary min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={() => navigateMonth('next')}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-text-secondary py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const adherenceLevel = getAdherenceLevel(date);
            const isCurrentMonth = format(date, 'MM') === format(currentMonth, 'MM');
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  w-8 h-8 rounded text-xs font-medium transition-smooth
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                  ${isCurrentMonth ? 'text-text-primary' : 'text-text-secondary opacity-50'}
                  ${getColorClass(adherenceLevel)}
                  ${isToday ? 'ring-2 ring-primary-500' : ''}
                  hover:scale-110 hover:shadow-soft
                `}
                title={`${format(date, 'MMM dd, yyyy')} - ${adherenceLevel > 0 ? `${getAdherenceLevel(date) * 20}% adherence` : 'No data'}`}
              >
                {format(date, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-text-primary">Adherence Level:</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">Less</span>
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${getColorClass(level)}`}
                title={`${level * 20}-${(level + 1) * 20 - 1}%`}
              ></div>
            ))}
            <span className="text-xs text-text-secondary">More</span>
          </div>
        </div>
        
        {selectedDate && (
          <div className="bg-primary-50 rounded-lg p-3 border border-primary-200">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <div className="text-sm">
                <span className="font-medium text-text-primary">
                  {format(new Date(selectedDate.date), 'MMM dd, yyyy')}:
                </span>
                <span className="text-text-secondary ml-1">
                  {selectedDate.takenDoses}/{selectedDate.totalDoses} doses ({selectedDate.adherence}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarHeatmap;