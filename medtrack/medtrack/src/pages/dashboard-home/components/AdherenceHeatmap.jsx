import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AdherenceHeatmap = ({ selectedProfile }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock adherence data for the current month
  const adherenceData = {
    0: { date: '2024-01-01', adherence: 100, doses: 4, taken: 4 },
    1: { date: '2024-01-02', adherence: 75, doses: 4, taken: 3 },
    2: { date: '2024-01-03', adherence: 100, doses: 4, taken: 4 },
    3: { date: '2024-01-04', adherence: 50, doses: 4, taken: 2 },
    4: { date: '2024-01-05', adherence: 100, doses: 4, taken: 4 },
    5: { date: '2024-01-06', adherence: 100, doses: 4, taken: 4 },
    6: { date: '2024-01-07', adherence: 75, doses: 4, taken: 3 },
    7: { date: '2024-01-08', adherence: 100, doses: 4, taken: 4 },
    8: { date: '2024-01-09', adherence: 100, doses: 4, taken: 4 },
    9: { date: '2024-01-10', adherence: 25, doses: 4, taken: 1 },
    10: { date: '2024-01-11', adherence: 100, doses: 4, taken: 4 },
    11: { date: '2024-01-12', adherence: 100, doses: 4, taken: 4 },
    12: { date: '2024-01-13', adherence: 75, doses: 4, taken: 3 },
    13: { date: '2024-01-14', adherence: 100, doses: 4, taken: 4 },
    14: { date: '2024-01-15', adherence: 100, doses: 4, taken: 4 },
    15: { date: '2024-01-16', adherence: 50, doses: 4, taken: 2 },
    16: { date: '2024-01-17', adherence: 100, doses: 4, taken: 4 },
    17: { date: '2024-01-18', adherence: 100, doses: 4, taken: 4 },
    18: { date: '2024-01-19', adherence: 75, doses: 4, taken: 3 },
    19: { date: '2024-01-20', adherence: 100, doses: 4, taken: 4 },
    20: { date: '2024-01-21', adherence: 100, doses: 4, taken: 4 },
    21: { date: '2024-01-22', adherence: 100, doses: 4, taken: 4 },
    22: { date: '2024-01-23', adherence: 75, doses: 4, taken: 3 },
    23: { date: '2024-01-24', adherence: 100, doses: 4, taken: 4 },
    24: { date: '2024-01-25', adherence: 100, doses: 4, taken: 4 },
    25: { date: '2024-01-26', adherence: 50, doses: 4, taken: 2 },
    26: { date: '2024-01-27', adherence: 100, doses: 4, taken: 4 },
    27: { date: '2024-01-28', adherence: 100, doses: 4, taken: 4 },
    28: { date: '2024-01-29', adherence: 75, doses: 4, taken: 3 },
    29: { date: '2024-01-30', adherence: 100, doses: 4, taken: 4 },
    30: { date: '2024-01-31', adherence: 100, doses: 4, taken: 4 }
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return 'bg-accent-500';
    if (adherence >= 75) return 'bg-accent-400';
    if (adherence >= 50) return 'bg-warning-400';
    if (adherence >= 25) return 'bg-warning-300';
    if (adherence > 0) return 'bg-error-400';
    return 'bg-secondary-200';
  };

  const getAdherenceText = (adherence) => {
    if (adherence >= 90) return 'Excellent';
    if (adherence >= 75) return 'Good';
    if (adherence >= 50) return 'Fair';
    if (adherence >= 25) return 'Poor';
    if (adherence > 0) return 'Very Poor';
    return 'No Data';
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-8 h-8"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = day - 1;
      const dayData = adherenceData[dayIndex];
      const isToday = day === new Date().getDate() && 
                     selectedMonth === new Date().getMonth() && 
                     selectedYear === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dayData)}
          className={`
            w-8 h-8 rounded cursor-pointer transition-smooth relative
            ${dayData ? getAdherenceColor(dayData.adherence) : 'bg-secondary-100'}
            ${isToday ? 'ring-2 ring-primary-500 ring-offset-1' : ''}
            hover:scale-110 hover:shadow-soft
          `}
          title={dayData ? `${dayData.adherence}% adherence (${dayData.taken}/${dayData.doses} doses)` : 'No data'}
        >
          <span className={`
            absolute inset-0 flex items-center justify-center text-xs font-medium
            ${dayData && dayData.adherence >= 50 ? 'text-white' : 'text-text-primary'}
          `}>
            {day}
          </span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={20} color="var(--color-primary)" strokeWidth={2} />
            <h2 className="text-lg font-semibold text-text-primary">Adherence Calendar</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-1 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded transition-smooth"
            >
              <Icon name="ChevronLeft" size={16} strokeWidth={2} />
            </button>
            
            <span className="text-sm font-medium text-text-primary min-w-[120px] text-center">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
            
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-1 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded transition-smooth"
            >
              <Icon name="ChevronRight" size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-xs font-medium text-text-secondary text-center py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-secondary-200 rounded"></div>
              <div className="w-3 h-3 bg-error-400 rounded"></div>
              <div className="w-3 h-3 bg-warning-300 rounded"></div>
              <div className="w-3 h-3 bg-warning-400 rounded"></div>
              <div className="w-3 h-3 bg-accent-400 rounded"></div>
              <div className="w-3 h-3 bg-accent-500 rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="p-6 bg-secondary-50">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            {new Date(selectedDate.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Adherence Rate:</span>
              <span className={`ml-2 font-medium ${
                selectedDate.adherence >= 75 ? 'text-accent-600' : 
                selectedDate.adherence >= 50 ? 'text-warning-600' : 'text-error-600'
              }`}>
                {selectedDate.adherence}% ({getAdherenceText(selectedDate.adherence)})
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Doses Taken:</span>
              <span className="ml-2 font-medium text-text-primary">
                {selectedDate.taken} of {selectedDate.doses}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdherenceHeatmap;