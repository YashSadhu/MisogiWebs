import * as Amplitude from "expo-analytics-amplitude";
import { Platform } from "react-native";
import { Medication, MedicationLog, Profile } from "../types";

// Using a placeholder API key for development
const AMPLITUDE_API_KEY = "test-api-key";

export const analyticsService = {
  // Initialize analytics
  init: async () => {
    try {
      await Amplitude.initializeAsync(AMPLITUDE_API_KEY);
      console.log("Analytics initialized");
      return true;
    } catch (error) {
      console.error("Error initializing analytics:", error);
      return false;
    }
  },

  // Set user properties
  setUserProperties: async (properties: Record<string, any>) => {
    try {
      await Amplitude.setUserPropertiesAsync(properties);
      return true;
    } catch (error) {
      console.error("Error setting user properties:", error);
      return false;
    }
  },

  // Track events
  trackEvent: async (eventName: string, properties?: Record<string, any>) => {
    try {
      await Amplitude.logEventAsync(eventName, properties);
      return true;
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error);
      return false;
    }
  },

  // Track medication events
  trackMedicationTaken: async (
    medication: Medication,
    schedule: any,
    profile: Profile,
  ) => {
    return analyticsService.trackEvent("medication_taken", {
      medicationId: medication.id,
      medicationName: medication.name,
      scheduleTime: schedule.time,
      profileId: profile.id,
      profileName: profile.name,
      platform: Platform.OS,
    });
  },

  trackMedicationMissed: async (
    medication: Medication,
    schedule: any,
    profile: Profile,
  ) => {
    return analyticsService.trackEvent("medication_missed", {
      medicationId: medication.id,
      medicationName: medication.name,
      scheduleTime: schedule.time,
      profileId: profile.id,
      profileName: profile.name,
      platform: Platform.OS,
    });
  },

  trackMedicationSkipped: async (
    medication: Medication,
    schedule: any,
    profile: Profile,
    reason: string,
  ) => {
    return analyticsService.trackEvent("medication_skipped", {
      medicationId: medication.id,
      medicationName: medication.name,
      scheduleTime: schedule.time,
      profileId: profile.id,
      profileName: profile.name,
      reason,
      platform: Platform.OS,
    });
  },

  // Track adherence stats
  trackAdherenceStats: async (profileId: string, stats: any) => {
    return analyticsService.trackEvent("adherence_stats_viewed", {
      profileId,
      adherenceRate: stats.adherenceRate,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      platform: Platform.OS,
    });
  },

  // Track calendar integration
  trackCalendarConnected: async (success: boolean) => {
    return analyticsService.trackEvent("calendar_connected", {
      success,
      platform: Platform.OS,
    });
  },

  // Track app usage
  trackAppOpen: async () => {
    return analyticsService.trackEvent("app_opened", {
      platform: Platform.OS,
    });
  },

  trackScreenView: async (screenName: string) => {
    return analyticsService.trackEvent("screen_viewed", {
      screenName,
      platform: Platform.OS,
    });
  },
};
