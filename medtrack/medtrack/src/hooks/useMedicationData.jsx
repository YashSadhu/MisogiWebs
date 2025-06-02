// src/hooks/useMedicationData.jsx

import { useState, useEffect, useCallback } from 'react';
import {
  loadMedications,
  saveMedications,
  logMedicationAdherence,
  loadAdherenceLogs,
  getAdherenceForDateRange,
  calculateMedicationStats,
  getMostMissedMedications
} from '../utils/medicationStorage';
import notificationSystem from '../utils/notificationSystem';

export const useMedicationData = () => {
  const [medications, setMedications] = useState([]);
  const [adherenceLogs, setAdherenceLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    overallAdherence: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTaken: 0,
    totalMissed: 0
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const loadedMedications = loadMedications();
        const loadedLogs = loadAdherenceLogs();
        const calculatedStats = calculateMedicationStats();
        
        setMedications(loadedMedications);
        setAdherenceLogs(loadedLogs);
        setStats(calculatedStats);
        
        // Initialize notification system
        await notificationSystem.initialize();
      } catch (error) {
        console.error('Error loading medication data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Add new medication
  const addMedication = useCallback((medicationData) => {
    const newMedication = {
      id: Date.now(),
      ...medicationData,
      enabled: true,
      createdAt: new Date().toISOString()
    };
    
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
    
    // Update notification system
    notificationSystem.updateNotifications();
    
    return newMedication;
  }, [medications]);

  // Update medication
  const updateMedication = useCallback((medicationId, updates) => {
    const updatedMedications = medications.map(med => 
      med.id === medicationId ? { ...med, ...updates, updatedAt: new Date().toISOString() } : med
    );
    
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
    
    // Update notification system
    notificationSystem.updateNotifications();
    
    return updatedMedications.find(med => med.id === medicationId);
  }, [medications]);

  // Delete medication
  const deleteMedication = useCallback((medicationId) => {
    const updatedMedications = medications.filter(med => med.id !== medicationId);
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
    
    // Update notification system
    notificationSystem.updateNotifications();
  }, [medications]);

  // Log medication adherence
  const logAdherence = useCallback((medicationId, status, timestamp = new Date()) => {
    const log = logMedicationAdherence(medicationId, status, timestamp);
    
    if (log) {
      const updatedLogs = [...adherenceLogs, log];
      setAdherenceLogs(updatedLogs);
      
      // Recalculate stats
      const newStats = calculateMedicationStats();
      setStats(newStats);
      
      return log;
    }
    
    return null;
  }, [adherenceLogs]);

  // Get today's medications with status
  const getTodaysMedications = useCallback(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayLogs = adherenceLogs.filter(log => log.date === todayStr);
    
    const todaysMeds = [];
    
    medications.forEach(medication => {
      if (medication.enabled && medication.times) {
        medication.times.forEach(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);
          
          // Find corresponding log
          const log = todayLogs.find(l => 
            l.medicationId === medication.id && 
            l.scheduledTime === time
          );
          
          let status = 'upcoming';
          if (log) {
            status = log.status;
          } else if (scheduledTime < today) {
            const gracePeriod = 30 * 60 * 1000; // 30 minutes
            if (today.getTime() - scheduledTime.getTime() > gracePeriod) {
              status = 'missed';
            } else {
              status = 'pending';
            }
          }
          
          todaysMeds.push({
            ...medication,
            scheduledTime: time,
            status,
            log,
            sortTime: scheduledTime.getTime()
          });
        });
      }
    });
    
    // Sort by scheduled time
    return todaysMeds.sort((a, b) => a.sortTime - b.sortTime);
  }, [medications, adherenceLogs]);

  // Get adherence data for date range
  const getAdherenceData = useCallback((startDate, endDate) => {
    return getAdherenceForDateRange(startDate, endDate);
  }, []);

  // Get most missed medications
  const getMostMissed = useCallback(() => {
    return getMostMissedMedications();
  }, []);

  // Get adherence by time of day
  const getAdherenceByTimeOfDay = useCallback(() => {
    const timeSlots = {
      'Morning (6-12)': { start: 6, end: 12, total: 0, taken: 0 },
      'Afternoon (12-17)': { start: 12, end: 17, total: 0, taken: 0 },
      'Evening (17-21)': { start: 17, end: 21, total: 0, taken: 0 },
      'Night (21-6)': { start: 21, end: 24, total: 0, taken: 0 }
    };
    
    medications.forEach(medication => {
      if (medication.times) {
        medication.times.forEach(timeStr => {
          const [hours] = timeStr.split(':').map(Number);
          
          let timeSlot = null;
          if (hours >= 6 && hours < 12) timeSlot = 'Morning (6-12)';
          else if (hours >= 12 && hours < 17) timeSlot = 'Afternoon (12-17)';
          else if (hours >= 17 && hours < 21) timeSlot = 'Evening (17-21)';
          else timeSlot = 'Night (21-6)';
          
          timeSlots[timeSlot].total++;
          
          const takenLogs = adherenceLogs.filter(log => 
            log.medicationId === medication.id && 
            log.status === 'taken' && 
            log.scheduledTime === timeStr
          );
          
          timeSlots[timeSlot].taken += takenLogs.length;
        });
      }
    });
    
    return Object.entries(timeSlots).map(([time, data]) => ({
      time: time.split(' ')[0],
      adherence: data.total > 0 ? Math.round((data.taken / data.total) * 100) : 0,
      total: data.total
    }));
  }, [medications, adherenceLogs]);

  // Get medication categories distribution
  const getMedicationCategories = useCallback(() => {
    const categories = {};
    
    medications.forEach(medication => {
      const category = medication.category || 'Other';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
    });
    
    const total = medications.length;
    
    return Object.entries(categories).map(([name, count]) => ({
      name,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      count
    }));
  }, [medications]);

  return {
    // Data
    medications,
    adherenceLogs,
    stats,
    isLoading,
    
    // Actions
    addMedication,
    updateMedication,
    deleteMedication,
    logAdherence,
    
    // Computed data
    getTodaysMedications,
    getAdherenceData,
    getMostMissed,
    getAdherenceByTimeOfDay,
    getMedicationCategories
  };
};

export default useMedicationData;