// Utility functions for date and time handling

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format a time string (HH:MM) to a more readable format
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

/**
 * Calculate if a time is within a certain range from now
 */
export const isTimeWithinRange = (timeString: string, minutesRange: number): boolean => {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diffMs = targetTime.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  
  return diffMinutes >= -minutesRange && diffMinutes <= minutesRange;
};

/**
 * Check if a time is upcoming (within the next hour)
 */
export const isUpcomingTime = (timeString: string, minutesAhead = 60): boolean => {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diffMs = targetTime.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  
  return diffMinutes > 0 && diffMinutes <= minutesAhead;
};

/**
 * Check if a time is overdue (within the last 4 hours)
 */
export const isOverdueTime = (timeString: string, minutesBehind = 240): boolean => {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diffMs = targetTime.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  
  return diffMinutes < 0 && diffMinutes >= -minutesBehind;
};

/**
 * Get the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

/**
 * Get the current time in HH:MM format
 */
export const getCurrentTime = (): string => {
  const date = new Date();
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Calculate adherence percentage
 */
export const calculateAdherence = (taken: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((taken / total) * 100);
};

/**
 * Group dates by week for weekly reporting
 */
export const groupByWeek = (dates: Date[]): { weekStart: string; dates: Date[] }[] => {
  const weeks: { [key: string]: Date[] } = {};
  
  dates.forEach(date => {
    const dayOfWeek = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - dayOfWeek);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    
    weeks[weekKey].push(date);
  });
  
  return Object.entries(weeks).map(([weekStart, dates]) => ({
    weekStart,
    dates,
  }));
};