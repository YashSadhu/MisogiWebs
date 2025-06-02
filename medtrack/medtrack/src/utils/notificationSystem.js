// src/utils/notificationSystem.js

import { loadMedications, loadNotificationPreferences, logMedicationAdherence } from './medicationStorage';

class NotificationSystem {
  constructor() {
    this.scheduledNotifications = new Map();
    this.notificationCallbacks = [];
    this.isInitialized = false;
  }

  // Initialize the notification system
  async initialize() {
    if (this.isInitialized) return;

    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
      }
    }

    // Start scheduling notifications
    this.scheduleAllNotifications();
    this.isInitialized = true;

    // Check for missed medications every minute
    setInterval(() => {
      this.checkMissedMedications();
    }, 60000);
  }

  // Add notification callback for UI updates
  addNotificationCallback(callback) {
    this.notificationCallbacks.push(callback);
  }

  // Remove notification callback
  removeNotificationCallback(callback) {
    this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
  }

  // Trigger notification callbacks
  triggerNotificationCallbacks(notification) {
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  // Schedule all notifications based on medication data
  scheduleAllNotifications() {
    // Clear existing notifications
    this.clearAllScheduledNotifications();

    const medications = loadMedications();
    const preferences = loadNotificationPreferences();

    if (!preferences.enabled) return;

    medications.forEach(medication => {
      if (medication.enabled && medication.times) {
        medication.times.forEach(time => {
          this.scheduleMedicationNotification(medication, time, preferences);
        });
      }
    });
  }

  // Schedule a single medication notification
  scheduleMedicationNotification(medication, timeString, preferences) {
    const now = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Schedule for today
    const todayNotification = new Date();
    todayNotification.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (todayNotification <= now) {
      todayNotification.setDate(todayNotification.getDate() + 1);
    }

    // Schedule reminder notification (before medication time)
    const reminderTime = new Date(todayNotification.getTime() - (preferences.reminderMinutes * 60000));
    if (reminderTime > now) {
      this.scheduleNotification(
        `${medication.id}-reminder-${timeString}`,
        reminderTime,
        {
          type: 'reminder',
          medication,
          title: 'Medication Reminder',
          message: `${medication.name} (${medication.dosage}) is due in ${preferences.reminderMinutes} minutes`,
          scheduledTime: timeString
        }
      );
    }

    // Schedule medication time notification
    this.scheduleNotification(
      `${medication.id}-time-${timeString}`,
      todayNotification,
      {
        type: 'medication',
        medication,
        title: 'Time to Take Medication',
        message: `Time to take ${medication.name} (${medication.dosage})`,
        scheduledTime: timeString
      }
    );

    // Schedule follow-up notification if enabled
    if (preferences.followUpEnabled) {
      const followUpTime = new Date(todayNotification.getTime() + (preferences.followUpMinutes * 60000));
      this.scheduleNotification(
        `${medication.id}-followup-${timeString}`,
        followUpTime,
        {
          type: 'followup',
          medication,
          title: 'Medication Follow-up',
          message: `Did you take ${medication.name}? Please confirm.`,
          scheduledTime: timeString
        }
      );
    }
  }

  // Schedule a single notification
  scheduleNotification(id, dateTime, notificationData) {
    const delay = dateTime.getTime() - new Date().getTime();
    
    if (delay <= 0) return; // Don't schedule past notifications

    const timeoutId = setTimeout(() => {
      this.showNotification(notificationData);
      this.scheduledNotifications.delete(id);
      
      // Reschedule for next day
      const nextDay = new Date(dateTime);
      nextDay.setDate(nextDay.getDate() + 1);
      this.scheduleNotification(id, nextDay, notificationData);
    }, delay);

    this.scheduledNotifications.set(id, {
      timeoutId,
      dateTime,
      notificationData
    });
  }

  // Show notification (both browser notification and UI notification)
  showNotification(notificationData) {
    const preferences = loadNotificationPreferences();

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(notificationData.title, {
        body: notificationData.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `medication-${notificationData.medication.id}`,
        requireInteraction: true,
        data: notificationData
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        // Navigate to medication tracking if needed
      };
    }

    // Play sound if enabled
    if (preferences.soundEnabled) {
      this.playNotificationSound();
    }

    // Trigger UI notification callbacks
    this.triggerNotificationCallbacks({
      id: Date.now(),
      ...notificationData,
      timestamp: new Date()
    });
  }

  // Play notification sound
  playNotificationSound() {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  // Check for missed medications
  checkMissedMedications() {
    const medications = loadMedications();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    medications.forEach(medication => {
      if (medication.enabled && medication.times) {
        medication.times.forEach(timeString => {
          const [hours, minutes] = timeString.split(':').map(Number);
          const medicationTime = new Date();
          medicationTime.setHours(hours, minutes, 0, 0);
          
          // Check if medication time has passed and no action was taken
          if (now > medicationTime) {
            const gracePeriod = 30 * 60 * 1000; // 30 minutes grace period
            if (now.getTime() - medicationTime.getTime() > gracePeriod) {
              // Check if this medication was already marked as missed
              const logs = JSON.parse(localStorage.getItem('medtrack_adherence_log') || '[]');
              const existingLog = logs.find(log => 
                log.medicationId === medication.id && 
                log.date === today &&
                log.scheduledTime === timeString
              );
              
              if (!existingLog) {
                // Auto-mark as missed after grace period
                logMedicationAdherence(medication.id, 'missed', medicationTime);
                
                this.showNotification({
                  type: 'missed',
                  medication,
                  title: 'Missed Medication',
                  message: `You missed ${medication.name} scheduled for ${timeString}`,
                  scheduledTime: timeString
                });
              }
            }
          }
        });
      }
    });
  }

  // Clear all scheduled notifications
  clearAllScheduledNotifications() {
    this.scheduledNotifications.forEach(({ timeoutId }) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
  }

  // Update notifications when medication data changes
  updateNotifications() {
    this.scheduleAllNotifications();
  }

  // Get upcoming notifications
  getUpcomingNotifications(limit = 5) {
    const upcoming = [];
    
    this.scheduledNotifications.forEach((scheduledNotification, id) => {
      upcoming.push({
        id,
        ...scheduledNotification
      });
    });
    
    return upcoming
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, limit);
  }
}

// Create and export singleton instance
export const notificationSystem = new NotificationSystem();
export default notificationSystem;