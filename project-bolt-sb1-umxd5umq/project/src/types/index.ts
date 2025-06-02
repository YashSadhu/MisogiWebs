// Type definitions for the MedTrack application

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: number; // times per day
  startDate: string;
  endDate: string;
  categoryId: string;
  userId: string;
  timeSlots: string[]; // Array of times in HH:MM format
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  timestamp: string;
  scheduled: string;
  status: 'taken' | 'missed' | 'late';
  userId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MedicationState {
  medications: Medication[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface LogState {
  logs: DoseLog[];
  isLoading: boolean;
  error: string | null;
}

export interface ReminderSettings {
  enableNotifications: boolean;
  enableCalendarSync: boolean;
  reminderTime: number; // minutes before scheduled dose
}

export interface AppSettings {
  reminders: ReminderSettings;
  theme: 'light' | 'dark' | 'system';
}