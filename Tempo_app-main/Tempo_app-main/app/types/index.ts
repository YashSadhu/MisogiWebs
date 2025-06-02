export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  schedule: MedicationSchedule[];
  color: string;
  profileId: string; // For family management
  createdAt: number;
  updatedAt: number;
}

export interface MedicationSchedule {
  id: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 for days of week (0 = Sunday)
  notificationId?: string;
  calendarEventId?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  scheduleId: string;
  status: "taken" | "missed" | "skipped";
  scheduledTime: number; // Timestamp
  actionTime: number; // When user took action
  skipReason?: string;
  profileId: string;
}

export interface Profile {
  id: string;
  name: string;
  relationship: string;
  isDefault: boolean;
  color: string;
}

export interface AdherenceStats {
  total: number;
  taken: number;
  missed: number;
  skipped: number;
  adherenceRate: number;
  currentStreak: number;
  longestStreak: number;
}

export interface CalendarIntegration {
  connected: boolean;
  calendarId?: string;
  syncEnabled: boolean;
}
