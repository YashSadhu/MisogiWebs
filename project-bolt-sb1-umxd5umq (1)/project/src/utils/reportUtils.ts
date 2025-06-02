// Utility functions for generating reports

import { Medication, DoseLog } from '../types';
import { formatDate, formatTime, calculateAdherence } from './dateUtils';

/**
 * Generate adherence data for a single medication
 */
export const generateMedicationAdherenceData = (
  medication: Medication,
  logs: DoseLog[]
): {
  medicationName: string;
  dose: string;
  totalDoses: number;
  takenDoses: number;
  lateDoses: number;
  missedDoses: number;
  adherenceRate: number;
} => {
  const medicationLogs = logs.filter(log => log.medicationId === medication.id);
  
  const takenDoses = medicationLogs.filter(log => log.status === 'taken').length;
  const lateDoses = medicationLogs.filter(log => log.status === 'late').length;
  const missedDoses = medicationLogs.filter(log => log.status === 'missed').length;
  const totalDoses = takenDoses + lateDoses + missedDoses;
  
  return {
    medicationName: medication.name,
    dose: medication.dose,
    totalDoses,
    takenDoses,
    lateDoses,
    missedDoses,
    adherenceRate: calculateAdherence(takenDoses + lateDoses, totalDoses),
  };
};

/**
 * Generate adherence report for all medications
 */
export const generateAdherenceReport = (
  medications: Medication[],
  logs: DoseLog[]
): {
  overallAdherence: number;
  medicationAdherence: ReturnType<typeof generateMedicationAdherenceData>[];
  mostMissedMedication: string | null;
} => {
  const medicationAdherence = medications.map(medication => 
    generateMedicationAdherenceData(medication, logs)
  );
  
  const totalTaken = medicationAdherence.reduce((sum, med) => sum + med.takenDoses + med.lateDoses, 0);
  const totalDoses = medicationAdherence.reduce((sum, med) => sum + med.totalDoses, 0);
  
  // Find the medication with the most missed doses
  let mostMissedMedication: string | null = null;
  let maxMissedDoses = 0;
  
  medicationAdherence.forEach(med => {
    if (med.missedDoses > maxMissedDoses) {
      mostMissedMedication = med.medicationName;
      maxMissedDoses = med.missedDoses;
    }
  });
  
  return {
    overallAdherence: calculateAdherence(totalTaken, totalDoses),
    medicationAdherence,
    mostMissedMedication,
  };
};

/**
 * Generate CSV data for logs
 */
export const generateCSVData = (
  medications: Medication[],
  logs: DoseLog[]
): string => {
  // Create a map of medication IDs to names for easy lookup
  const medicationMap = new Map(
    medications.map(med => [med.id, `${med.name} (${med.dose})`])
  );
  
  // CSV header
  let csv = 'Medication,Scheduled Time,Status,Taken Time\n';
  
  // Sort logs by scheduled time
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.scheduled).getTime() - new Date(b.scheduled).getTime()
  );
  
  // Add each log as a row
  sortedLogs.forEach(log => {
    const medicationName = medicationMap.get(log.medicationId) || 'Unknown';
    const scheduled = new Date(log.scheduled);
    const scheduledStr = `${formatDate(log.scheduled)} ${formatTime(scheduled.getHours().toString().padStart(2, '0') + ':' + scheduled.getMinutes().toString().padStart(2, '0'))}`;
    const status = log.status.charAt(0).toUpperCase() + log.status.slice(1);
    const takenTime = log.timestamp ? formatDate(log.timestamp) + ' ' + formatTime(new Date(log.timestamp).getHours().toString().padStart(2, '0') + ':' + new Date(log.timestamp).getMinutes().toString().padStart(2, '0')) : 'N/A';
    
    csv += `"${medicationName}","${scheduledStr}","${status}","${takenTime}"\n`;
  });
  
  return csv;
};

/**
 * Generate PDF data object for download
 * Note: In a real app, you would use a library like jsPDF
 */
export const generatePDFReportData = (
  medications: Medication[],
  logs: DoseLog[]
): {
  title: string;
  generatedDate: string;
  adherenceData: ReturnType<typeof generateAdherenceReport>;
  recentLogs: Array<{
    medication: string;
    scheduled: string;
    status: string;
    takenTime: string;
  }>;
} => {
  const adherenceData = generateAdherenceReport(medications, logs);
  
  // Get recent logs (last 10)
  const medicationMap = new Map(
    medications.map(med => [med.id, `${med.name} (${med.dose})`])
  );
  
  const sortedLogs = [...logs]
    .sort((a, b) => new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime())
    .slice(0, 10);
  
  const recentLogs = sortedLogs.map(log => {
    const medicationName = medicationMap.get(log.medicationId) || 'Unknown';
    const scheduled = new Date(log.scheduled);
    const scheduledStr = `${formatDate(log.scheduled)} ${formatTime(scheduled.getHours().toString().padStart(2, '0') + ':' + scheduled.getMinutes().toString().padStart(2, '0'))}`;
    const status = log.status.charAt(0).toUpperCase() + log.status.slice(1);
    const takenTime = log.timestamp ? formatDate(log.timestamp) + ' ' + formatTime(new Date(log.timestamp).getHours().toString().padStart(2, '0') + ':' + new Date(log.timestamp).getMinutes().toString().padStart(2, '0')) : 'N/A';
    
    return {
      medication: medicationName,
      scheduled: scheduledStr,
      status,
      takenTime,
    };
  });
  
  return {
    title: 'MedTrack Adherence Report',
    generatedDate: formatDate(new Date().toISOString()),
    adherenceData,
    recentLogs,
  };
};

/**
 * Create and download a CSV file
 */
export const downloadCSV = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};