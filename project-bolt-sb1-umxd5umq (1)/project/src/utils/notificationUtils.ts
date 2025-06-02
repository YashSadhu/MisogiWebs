// Utility functions for notifications and reminders

/**
 * Request notification permissions
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

/**
 * Show a notification for a medication dose
 */
export const showMedicationNotification = (
  medicationName: string,
  dose: string,
  time: string
): void => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('MedTrack Reminder', {
      body: `Time to take ${medicationName} (${dose}) at ${time}`,
      icon: '/favicon.ico',
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

/**
 * Generate Google Calendar event URL for a medication schedule
 */
export const generateGoogleCalendarURL = (
  medicationName: string,
  dose: string,
  date: string,
  time: string,
  recurrence: string = 'DAILY'
): string => {
  const title = encodeURIComponent(`Take ${medicationName} (${dose})`);
  const startDate = `${date}T${time}:00`;
  const endDate = `${date}T${time.split(':')[0]}:${(parseInt(time.split(':')[1]) + 5).toString().padStart(2, '0')}:00`;
  
  let recurrenceRule = '';
  if (recurrence === 'DAILY') {
    recurrenceRule = '&recur=RRULE:FREQ=DAILY';
  } else if (recurrence === 'WEEKLY') {
    recurrenceRule = '&recur=RRULE:FREQ=WEEKLY';
  }
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.replace(/[-:]/g, '')}/${endDate.replace(/[-:]/g, '')}${recurrenceRule}&details=Medication%20reminder%20from%20MedTrack`;
};

/**
 * Schedule local notifications for medications
 * (This is a simplified version - in a real app, you would use a service worker)
 */
export const scheduleLocalNotifications = (
  medications: Array<{
    id: string;
    name: string;
    dose: string;
    timeSlots: string[];
  }>
): void => {
  // Clear any existing notification timers
  if (window.notificationTimers) {
    window.notificationTimers.forEach(timerId => clearTimeout(timerId));
  }
  
  window.notificationTimers = [];
  
  medications.forEach(medication => {
    medication.timeSlots.forEach(timeSlot => {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const delay = scheduledTime.getTime() - now.getTime();
      
      const timerId = setTimeout(() => {
        showMedicationNotification(medication.name, medication.dose, timeSlot);
      }, delay);
      
      window.notificationTimers.push(timerId);
    });
  });
};

// Add the notificationTimers property to the Window interface
declare global {
  interface Window {
    notificationTimers: number[];
  }
}

// Initialize the notification timers array
if (typeof window !== 'undefined') {
  window.notificationTimers = [];
}