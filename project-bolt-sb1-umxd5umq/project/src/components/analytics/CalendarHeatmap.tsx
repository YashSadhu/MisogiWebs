import React, { useEffect, useRef } from 'react';
import { DoseLog } from '../../types';

interface CalendarHeatmapProps {
  logs: DoseLog[];
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // This is a simplified heatmap implementation
  // In a real app, you would use a library like react-calendar-heatmap
  useEffect(() => {
    if (!containerRef.current) return;

    // Calculate the date range (current month)
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Calculate the week day of the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Clear container
    containerRef.current.innerHTML = '';

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-7 gap-2';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'text-xs text-gray-500 text-center font-medium';
      dayHeader.textContent = day;
      grid.appendChild(dayHeader);
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement('div');
      grid.appendChild(emptyCell);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Count adherence for this day (simplified for demo)
      // In a real app, you would calculate this from actual logs
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.scheduled).toISOString().split('T')[0];
        return logDate === dateString;
      });
      
      const totalLogs = dayLogs.length;
      const takenLogs = dayLogs.filter(log => log.status === 'taken' || log.status === 'late').length;
      
      let adherenceRate = 0;
      if (totalLogs > 0) {
        adherenceRate = (takenLogs / totalLogs) * 100;
      }
      
      // Create the day cell
      const cell = document.createElement('div');
      cell.className = 'aspect-square rounded flex flex-col items-center justify-center text-xs';
      
      // Set cell color based on adherence rate
      if (totalLogs === 0) {
        cell.className += ' bg-gray-100 text-gray-400';
      } else if (adherenceRate >= 100) {
        cell.className += ' bg-emerald-500 text-white';
      } else if (adherenceRate >= 75) {
        cell.className += ' bg-emerald-300 text-emerald-900';
      } else if (adherenceRate >= 50) {
        cell.className += ' bg-amber-300 text-amber-900';
      } else {
        cell.className += ' bg-red-300 text-red-900';
      }
      
      // Add day number
      const dayNumber = document.createElement('div');
      dayNumber.textContent = day.toString();
      
      // Highlight today
      if (date.getDate() === today.getDate() && 
          date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear()) {
        dayNumber.className = 'font-bold';
        cell.className += ' ring-2 ring-offset-1 ring-indigo-500';
      }
      
      cell.appendChild(dayNumber);
      
      // Add adherence percentage if there are logs
      if (totalLogs > 0) {
        const adherenceText = document.createElement('div');
        adherenceText.className = 'text-xs mt-1';
        adherenceText.textContent = `${Math.round(adherenceRate)}%`;
        cell.appendChild(adherenceText);
      }
      
      grid.appendChild(cell);
    }

    containerRef.current.appendChild(grid);
  }, [logs]);

  return (
    <div className="p-2" ref={containerRef} />
  );
};

export default CalendarHeatmap;