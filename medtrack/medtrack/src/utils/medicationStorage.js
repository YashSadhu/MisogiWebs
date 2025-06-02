// src/utils/medicationStorage.js

// Real medication data storage utilities
export const STORAGE_KEYS = {
  MEDICATIONS: 'medtrack_medications',
  ADHERENCE_LOG: 'medtrack_adherence_log',
  USER_SETTINGS: 'medtrack_user_settings',
  NOTIFICATION_PREFERENCES: 'medtrack_notification_preferences'
};

// Save medication data
export const saveMedications = (medications) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
    return true;
  } catch (error) {
    console.error('Error saving medications:', error);
    return false;
  }
};

// Load medication data
export const loadMedications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading medications:', error);
    return [];
  }
};

// Log medication adherence
export const logMedicationAdherence = (medicationId, status, timestamp = new Date()) => {
  try {
    const logs = loadAdherenceLogs();
    const newLog = {
      id: Date.now(),
      medicationId,
      status, // 'taken', 'missed', 'skipped'
      timestamp: timestamp.toISOString(),
      date: timestamp.toISOString().split('T')[0]
    };
    
    logs.push(newLog);
    localStorage.setItem(STORAGE_KEYS.ADHERENCE_LOG, JSON.stringify(logs));
    return newLog;
  } catch (error) {
    console.error('Error logging adherence:', error);
    return null;
  }
};

// Load adherence logs
export const loadAdherenceLogs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ADHERENCE_LOG);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading adherence logs:', error);
    return [];
  }
};

// Get adherence data for date range
export const getAdherenceForDateRange = (startDate, endDate) => {
  const logs = loadAdherenceLogs();
  const medications = loadMedications();
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const adherenceData = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayLogs = logs.filter(log => log.date === dateStr);
    
    const totalScheduled = medications.reduce((sum, med) => {
      return sum + (med.times ? med.times.length : 0);
    }, 0);
    
    const taken = dayLogs.filter(log => log.status === 'taken').length;
    const missed = dayLogs.filter(log => log.status === 'missed').length;
    const adherenceRate = totalScheduled > 0 ? Math.round((taken / totalScheduled) * 100) : 0;
    
    adherenceData.push({
      date: dateStr,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      adherence: adherenceRate,
      totalDoses: totalScheduled,
      takenDoses: taken,
      missedDoses: missed
    });
  }
  
  return adherenceData;
};

// Calculate medication statistics
export const calculateMedicationStats = () => {
  const logs = loadAdherenceLogs();
  const medications = loadMedications();
  
  if (logs.length === 0 || medications.length === 0) {
    return {
      overallAdherence: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalTaken: 0,
      totalMissed: 0
    };
  }
  
  const totalTaken = logs.filter(log => log.status === 'taken').length;
  const totalMissed = logs.filter(log => log.status === 'missed').length;
  const overallAdherence = Math.round((totalTaken / (totalTaken + totalMissed)) * 100) || 0;
  
  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const dayLogs = logs.filter(log => log.date === dateStr);
    const dailyMedCount = medications.reduce((sum, med) => sum + (med.times ? med.times.length : 0), 0);
    const takenCount = dayLogs.filter(log => log.status === 'taken').length;
    
    const dailyAdherence = dailyMedCount > 0 ? (takenCount / dailyMedCount) * 100 : 0;
    
    if (dailyAdherence >= 80) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return {
    overallAdherence,
    currentStreak,
    longestStreak: Math.max(currentStreak, 0), // This would need more complex calculation for true longest
    totalTaken,
    totalMissed
  };
};

// Get most missed medications
export const getMostMissedMedications = () => {
  const logs = loadAdherenceLogs();
  const medications = loadMedications();
  
  const medicationStats = medications.map(med => {
    const medLogs = logs.filter(log => log.medicationId === med.id);
    const missedCount = medLogs.filter(log => log.status === 'missed').length;
    const takenCount = medLogs.filter(log => log.status === 'taken').length;
    const totalDoses = missedCount + takenCount;
    const missedPercentage = totalDoses > 0 ? (missedCount / totalDoses) * 100 : 0;
    
    return {
      ...med,
      missedCount,
      totalDoses,
      missedPercentage: Math.round(missedPercentage * 10) / 10,
      trend: 'stable' // This would need trend calculation based on recent data
    };
  });
  
  return medicationStats
    .filter(med => med.missedCount > 0)
    .sort((a, b) => b.missedPercentage - a.missedPercentage);
};

// Save user notification preferences
export const saveNotificationPreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return false;
  }
};

// Load user notification preferences
export const loadNotificationPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
    return stored ? JSON.parse(stored) : {
      enabled: true,
      reminderMinutes: 5,
      soundEnabled: true,
      followUpEnabled: true,
      followUpMinutes: 15
    };
  } catch (error) {
    console.error('Error loading notification preferences:', error);
    return {
      enabled: true,
      reminderMinutes: 5,
      soundEnabled: true,
      followUpEnabled: true,
      followUpMinutes: 15
    };
  }
};