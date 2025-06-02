import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Medication, MedicationLog, Profile } from "../types";

const STORAGE_KEYS = {
  MEDICATIONS: "medtrack_medications",
  MEDICATION_LOGS: "medtrack_medication_logs",
  PROFILES: "medtrack_profiles",
  CURRENT_PROFILE: "medtrack_current_profile",
  CALENDAR_INTEGRATION: "medtrack_calendar_integration",
  GOOGLE_AUTH: "medtrack_google_auth",
};

// Secure storage for sensitive data
export const secureStorage = {
  saveGoogleAuth: async (authData: any) => {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.GOOGLE_AUTH,
      JSON.stringify(authData),
    );
  },
  getGoogleAuth: async () => {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.GOOGLE_AUTH);
    return data ? JSON.parse(data) : null;
  },
  removeGoogleAuth: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.GOOGLE_AUTH);
  },
};

// Regular storage for app data
export const storage = {
  // Medications
  saveMedications: async (medications: Medication[]) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.MEDICATIONS,
      JSON.stringify(medications),
    );
  },
  getMedications: async (): Promise<Medication[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    return data ? JSON.parse(data) : [];
  },
  addMedication: async (medication: Medication) => {
    const medications = await storage.getMedications();
    medications.push(medication);
    await storage.saveMedications(medications);
    return medication;
  },
  updateMedication: async (medication: Medication) => {
    const medications = await storage.getMedications();
    const index = medications.findIndex((med) => med.id === medication.id);
    if (index !== -1) {
      medications[index] = medication;
      await storage.saveMedications(medications);
      return medication;
    }
    return null;
  },
  deleteMedication: async (medicationId: string) => {
    const medications = await storage.getMedications();
    const filtered = medications.filter((med) => med.id !== medicationId);
    await storage.saveMedications(filtered);
  },

  // Medication Logs
  saveMedicationLogs: async (logs: MedicationLog[]) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.MEDICATION_LOGS,
      JSON.stringify(logs),
    );
  },
  getMedicationLogs: async (): Promise<MedicationLog[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATION_LOGS);
    return data ? JSON.parse(data) : [];
  },
  addMedicationLog: async (log: MedicationLog) => {
    const logs = await storage.getMedicationLogs();
    logs.push(log);
    await storage.saveMedicationLogs(logs);
    return log;
  },

  // Profiles
  saveProfiles: async (profiles: Profile[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  },
  getProfiles: async (): Promise<Profile[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES);
    return data ? JSON.parse(data) : [];
  },
  setCurrentProfile: async (profileId: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, profileId);
  },
  getCurrentProfile: async (): Promise<string | null> => {
    return AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE);
  },

  // Calendar Integration
  saveCalendarIntegration: async (integration: any) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CALENDAR_INTEGRATION,
      JSON.stringify(integration),
    );
  },
  getCalendarIntegration: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CALENDAR_INTEGRATION);
    return data ? JSON.parse(data) : { connected: false, syncEnabled: false };
  },

  // Utility
  clearAllData: async () => {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.GOOGLE_AUTH);
  },
};
