/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jun 1, 2025")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format a date range to a readable format
 * @param startDateString - ISO date string for start date
 * @param endDateString - ISO date string for end date
 * @returns Formatted date range string (e.g., "Jun 1-3, 2025")
 */
export const formatDateRange = (startDateString: string, endDateString: string): string => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  
  // Same year
  if (startDate.getFullYear() === endDate.getFullYear()) {
    // Same month
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
    // Different month
    return `${startDate.toLocaleDateString('en-US', { month: 'short' })} ${startDate.getDate()} - ${endDate.toLocaleDateString('en-US', { month: 'short' })} ${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  
  // Different year
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

/**
 * Calculate days remaining until a date
 * @param dateString - ISO date string
 * @returns Number of days remaining (negative if date has passed)
 */
export const getDaysRemaining = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  
  const differenceMs = date.getTime() - now.getTime();
  return Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date has passed
 * @param dateString - ISO date string
 * @returns Boolean indicating if date has passed
 */
export const hasDatePassed = (dateString: string): boolean => {
  return getDaysRemaining(dateString) < 0;
};

/**
 * Get a human-readable time remaining string
 * @param dateString - ISO date string
 * @returns String like "5 days left" or "Ended 2 days ago"
 */
export const getTimeRemainingText = (dateString: string): string => {
  const daysRemaining = getDaysRemaining(dateString);
  
  if (daysRemaining > 0) {
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`;
  } else if (daysRemaining === 0) {
    return 'Ends today';
  } else {
    return `Ended ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} ago`;
  }
};