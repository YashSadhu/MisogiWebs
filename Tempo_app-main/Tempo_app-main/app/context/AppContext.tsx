import React, { createContext, useContext, useState, useEffect } from "react";
import { Medication, MedicationLog, Profile, AdherenceStats } from "../types";
import {
  storage,
  notificationService,
  calendarService,
  analyticsService,
  adherenceService,
} from "../services";
import { addNotificationResponseListener } from "../services/notifications";
import { Alert, Platform } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

interface AppContextType {
  // Data
  medications: Medication[];
  medicationLogs: MedicationLog[];
  profiles: Profile[];
  currentProfileId: string | null;
  adherenceStats: AdherenceStats | null;
  calendarConnected: boolean;

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Profile methods
  createProfile: (profile: Omit<Profile, "id">) => Promise<Profile>;
  updateProfile: (profile: Profile) => Promise<Profile | null>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  switchProfile: (profileId: string) => Promise<boolean>;
  getCurrentProfile: () => Profile | null;

  // Medication methods
  createMedication: (
    medication: Omit<Medication, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Medication>;
  updateMedication: (medication: Medication) => Promise<Medication | null>;
  deleteMedication: (medicationId: string) => Promise<boolean>;
  getMedicationsForCurrentProfile: () => Medication[];

  // Medication log methods
  markMedicationTaken: (
    medicationId: string,
    scheduleId: string,
  ) => Promise<MedicationLog | null>;
  markMedicationSkipped: (
    medicationId: string,
    scheduleId: string,
    reason: string,
  ) => Promise<MedicationLog | null>;
  getMedicationLogsForDate: (date: Date) => MedicationLog[];

  // Calendar methods
  connectGoogleCalendar: () => Promise<boolean>;
  disconnectGoogleCalendar: () => Promise<boolean>;

  // Adherence methods
  refreshAdherenceStats: () => Promise<AdherenceStats>;
  getAdherenceCalendarData: (
    startDate: Date,
    endDate: Date,
  ) => Promise<Record<string, any>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [adherenceStats, setAdherenceStats] = useState<AdherenceStats | null>(
    null,
  );
  const [calendarConnected, setCalendarConnected] = useState(false);

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        // Initialize analytics
        await analyticsService.init();
        await analyticsService.trackAppOpen();

        // Load data from storage
        const storedMedications = await storage.getMedications();
        const storedLogs = await storage.getMedicationLogs();
        const storedProfiles = await storage.getProfiles();
        const storedProfileId = await storage.getCurrentProfile();
        const calendarIntegration = await storage.getCalendarIntegration();

        // Set initial data
        setMedications(storedMedications);
        setMedicationLogs(storedLogs);

        // Create default profile if none exists
        if (storedProfiles.length === 0) {
          const defaultProfile: Profile = {
            id: uuidv4(),
            name: "Me",
            relationship: "self",
            isDefault: true,
            color: "#4285F4",
          };

          await storage.saveProfiles([defaultProfile]);
          await storage.setCurrentProfile(defaultProfile.id);

          setProfiles([defaultProfile]);
          setCurrentProfileId(defaultProfile.id);
        } else {
          setProfiles(storedProfiles);
          setCurrentProfileId(storedProfileId || storedProfiles[0].id);
        }

        // Set calendar connection status
        setCalendarConnected(calendarIntegration.connected);

        // Request notification permissions
        if (Platform.OS !== "web") {
          await notificationService.requestPermissions();
        }

        // Set up notification response listener
        const subscription = addNotificationResponseListener(
          handleNotificationResponse,
        );

        setIsInitialized(true);
        setIsLoading(false);

        // Calculate adherence stats for current profile
        if (currentProfileId) {
          refreshAdherenceStats();
        }

        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle notification responses
  const handleNotificationResponse = async (response: any) => {
    try {
      const data = response.notification.request.content.data;

      if (data?.medicationId && data?.scheduleId) {
        // Navigate to medication detail or mark as taken
        // This would typically use navigation, but for now we'll just show an alert
        Alert.alert(
          "Medication Reminder",
          "Would you like to mark this medication as taken?",
          [
            {
              text: "Skip",
              onPress: () => {
                // Show skip reason dialog
                Alert.prompt(
                  "Skip Reason",
                  "Why are you skipping this dose?",
                  async (reason) => {
                    await markMedicationSkipped(
                      data.medicationId,
                      data.scheduleId,
                      reason,
                    );
                  },
                );
              },
            },
            {
              text: "Mark as Taken",
              onPress: async () => {
                await markMedicationTaken(data.medicationId, data.scheduleId);
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error("Error handling notification response:", error);
    }
  };

  // Profile methods
  const createProfile = async (
    profileData: Omit<Profile, "id">,
  ): Promise<Profile> => {
    try {
      const newProfile: Profile = {
        ...profileData,
        id: uuidv4(),
      };

      const updatedProfiles = [...profiles, newProfile];
      await storage.saveProfiles(updatedProfiles);

      setProfiles(updatedProfiles);

      // If this is the first profile, set it as current
      if (profiles.length === 0) {
        await storage.setCurrentProfile(newProfile.id);
        setCurrentProfileId(newProfile.id);
      }

      return newProfile;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  };

  const updateProfile = async (profile: Profile): Promise<Profile | null> => {
    try {
      const index = profiles.findIndex((p) => p.id === profile.id);
      if (index === -1) return null;

      const updatedProfiles = [...profiles];
      updatedProfiles[index] = profile;

      await storage.saveProfiles(updatedProfiles);
      setProfiles(updatedProfiles);

      return profile;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  };

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    try {
      // Don't allow deleting the last profile
      if (profiles.length <= 1) {
        return false;
      }

      const updatedProfiles = profiles.filter((p) => p.id !== profileId);
      await storage.saveProfiles(updatedProfiles);

      // If deleting current profile, switch to another one
      if (currentProfileId === profileId) {
        const newCurrentProfile = updatedProfiles[0];
        await storage.setCurrentProfile(newCurrentProfile.id);
        setCurrentProfileId(newCurrentProfile.id);
      }

      setProfiles(updatedProfiles);
      return true;
    } catch (error) {
      console.error("Error deleting profile:", error);
      return false;
    }
  };

  const switchProfile = async (profileId: string): Promise<boolean> => {
    try {
      const profileExists = profiles.some((p) => p.id === profileId);
      if (!profileExists) return false;

      await storage.setCurrentProfile(profileId);
      setCurrentProfileId(profileId);

      // Refresh adherence stats for the new profile
      await refreshAdherenceStats();

      return true;
    } catch (error) {
      console.error("Error switching profile:", error);
      return false;
    }
  };

  const getCurrentProfile = (): Profile | null => {
    if (!currentProfileId) return null;
    return profiles.find((p) => p.id === currentProfileId) || null;
  };

  // Medication methods
  const createMedication = async (
    medicationData: Omit<Medication, "id" | "createdAt" | "updatedAt">,
  ): Promise<Medication> => {
    try {
      const now = Date.now();
      const newMedication: Medication = {
        ...medicationData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };

      // Schedule notifications for each time slot
      for (let i = 0; i < newMedication.schedule.length; i++) {
        const schedule = newMedication.schedule[i];

        // Schedule notification
        const notificationId =
          await notificationService.scheduleMedicationReminder(
            newMedication,
            schedule,
          );

        if (notificationId) {
          newMedication.schedule[i].notificationId = notificationId;
        }

        // Add to Google Calendar if connected
        if (calendarConnected) {
          const eventId = await calendarService.createMedicationEvent(
            newMedication,
            schedule,
          );

          if (eventId) {
            newMedication.schedule[i].calendarEventId = eventId;
          }
        }
      }

      // Save to storage
      await storage.addMedication(newMedication);

      // Update state
      setMedications([...medications, newMedication]);

      // Track event
      await analyticsService.trackEvent("medication_created", {
        medicationId: newMedication.id,
        medicationName: newMedication.name,
        scheduleCount: newMedication.schedule.length,
        profileId: newMedication.profileId,
      });

      return newMedication;
    } catch (error) {
      console.error("Error creating medication:", error);
      throw error;
    }
  };

  const updateMedication = async (
    medication: Medication,
  ): Promise<Medication | null> => {
    try {
      const index = medications.findIndex((m) => m.id === medication.id);
      if (index === -1) return null;

      const oldMedication = medications[index];
      const updatedMedication = {
        ...medication,
        updatedAt: Date.now(),
      };

      // Cancel old notifications and schedule new ones
      for (const oldSchedule of oldMedication.schedule) {
        if (oldSchedule.notificationId) {
          await notificationService.cancelMedicationReminder(
            oldSchedule.notificationId,
          );
        }

        if (oldSchedule.calendarEventId && calendarConnected) {
          const calendarIntegration = await storage.getCalendarIntegration();
          if (calendarIntegration.calendarId) {
            await calendarService.deleteMedicationEvent(
              calendarIntegration.calendarId,
              oldSchedule.calendarEventId,
            );
          }
        }
      }

      // Schedule new notifications
      for (let i = 0; i < updatedMedication.schedule.length; i++) {
        const schedule = updatedMedication.schedule[i];

        // Schedule notification
        const notificationId =
          await notificationService.scheduleMedicationReminder(
            updatedMedication,
            schedule,
          );

        if (notificationId) {
          updatedMedication.schedule[i].notificationId = notificationId;
        }

        // Add to Google Calendar if connected
        if (calendarConnected) {
          const eventId = await calendarService.createMedicationEvent(
            updatedMedication,
            schedule,
          );

          if (eventId) {
            updatedMedication.schedule[i].calendarEventId = eventId;
          }
        }
      }

      // Save to storage
      await storage.updateMedication(updatedMedication);

      // Update state
      const updatedMedications = [...medications];
      updatedMedications[index] = updatedMedication;
      setMedications(updatedMedications);

      // Track event
      await analyticsService.trackEvent("medication_updated", {
        medicationId: updatedMedication.id,
        medicationName: updatedMedication.name,
        scheduleCount: updatedMedication.schedule.length,
        profileId: updatedMedication.profileId,
      });

      return updatedMedication;
    } catch (error) {
      console.error("Error updating medication:", error);
      return null;
    }
  };

  const deleteMedication = async (medicationId: string): Promise<boolean> => {
    try {
      const medication = medications.find((m) => m.id === medicationId);
      if (!medication) return false;

      // Cancel notifications
      for (const schedule of medication.schedule) {
        if (schedule.notificationId) {
          await notificationService.cancelMedicationReminder(
            schedule.notificationId,
          );
        }

        if (schedule.calendarEventId && calendarConnected) {
          const calendarIntegration = await storage.getCalendarIntegration();
          if (calendarIntegration.calendarId) {
            await calendarService.deleteMedicationEvent(
              calendarIntegration.calendarId,
              schedule.calendarEventId,
            );
          }
        }
      }

      // Delete from storage
      await storage.deleteMedication(medicationId);

      // Update state
      setMedications(medications.filter((m) => m.id !== medicationId));

      // Track event
      await analyticsService.trackEvent("medication_deleted", {
        medicationId,
        medicationName: medication.name,
        profileId: medication.profileId,
      });

      return true;
    } catch (error) {
      console.error("Error deleting medication:", error);
      return false;
    }
  };

  const getMedicationsForCurrentProfile = (): Medication[] => {
    if (!currentProfileId) return [];
    return medications.filter((m) => m.profileId === currentProfileId);
  };

  // Medication log methods
  const markMedicationTaken = async (
    medicationId: string,
    scheduleId: string,
  ): Promise<MedicationLog | null> => {
    try {
      const medication = medications.find((m) => m.id === medicationId);
      if (!medication) return null;

      const schedule = medication.schedule.find((s) => s.id === scheduleId);
      if (!schedule) return null;

      const now = Date.now();

      // Create log entry
      const log: MedicationLog = {
        id: uuidv4(),
        medicationId,
        scheduleId,
        status: "taken",
        scheduledTime: now, // Ideally this would be the actual scheduled time
        actionTime: now,
        profileId: medication.profileId,
      };

      // Save to storage
      await storage.addMedicationLog(log);

      // Update state
      setMedicationLogs([...medicationLogs, log]);

      // Track event
      const profile = profiles.find((p) => p.id === medication.profileId);
      if (profile) {
        await analyticsService.trackMedicationTaken(
          medication,
          schedule,
          profile,
        );
      }

      // Refresh adherence stats
      await refreshAdherenceStats();

      return log;
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      return null;
    }
  };

  const markMedicationSkipped = async (
    medicationId: string,
    scheduleId: string,
    reason: string,
  ): Promise<MedicationLog | null> => {
    try {
      const medication = medications.find((m) => m.id === medicationId);
      if (!medication) return null;

      const schedule = medication.schedule.find((s) => s.id === scheduleId);
      if (!schedule) return null;

      const now = Date.now();

      // Create log entry
      const log: MedicationLog = {
        id: uuidv4(),
        medicationId,
        scheduleId,
        status: "skipped",
        scheduledTime: now, // Ideally this would be the actual scheduled time
        actionTime: now,
        skipReason: reason,
        profileId: medication.profileId,
      };

      // Save to storage
      await storage.addMedicationLog(log);

      // Update state
      setMedicationLogs([...medicationLogs, log]);

      // Track event
      const profile = profiles.find((p) => p.id === medication.profileId);
      if (profile) {
        await analyticsService.trackMedicationSkipped(
          medication,
          schedule,
          profile,
          reason,
        );
      }

      // Refresh adherence stats
      await refreshAdherenceStats();

      return log;
    } catch (error) {
      console.error("Error marking medication as skipped:", error);
      return null;
    }
  };

  const getMedicationLogsForDate = (date: Date): MedicationLog[] => {
    // Set time to midnight
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter logs for the current profile and specified date
    return medicationLogs.filter(
      (log) =>
        log.profileId === currentProfileId &&
        log.scheduledTime >= startOfDay.getTime() &&
        log.scheduledTime <= endOfDay.getTime(),
    );
  };

  // Calendar methods
  const connectGoogleCalendar = async (): Promise<boolean> => {
    try {
      const success = await calendarService.connectGoogleCalendar();

      if (success) {
        setCalendarConnected(true);

        // Track event
        await analyticsService.trackCalendarConnected(true);

        // Add existing medications to calendar
        for (const medication of medications) {
          if (medication.profileId === currentProfileId) {
            for (let i = 0; i < medication.schedule.length; i++) {
              const schedule = medication.schedule[i];

              const eventId = await calendarService.createMedicationEvent(
                medication,
                schedule,
              );

              if (eventId) {
                // Update medication with calendar event ID
                const updatedMedication = { ...medication };
                updatedMedication.schedule[i].calendarEventId = eventId;

                await storage.updateMedication(updatedMedication);

                // Update state
                const index = medications.findIndex(
                  (m) => m.id === medication.id,
                );
                if (index !== -1) {
                  const updatedMedications = [...medications];
                  updatedMedications[index] = updatedMedication;
                  setMedications(updatedMedications);
                }
              }
            }
          }
        }
      } else {
        // Track failed connection
        await analyticsService.trackCalendarConnected(false);
      }

      return success;
    } catch (error) {
      console.error("Error connecting Google Calendar:", error);
      await analyticsService.trackCalendarConnected(false);
      return false;
    }
  };

  const disconnectGoogleCalendar = async (): Promise<boolean> => {
    try {
      const success = await calendarService.disconnectGoogleCalendar();

      if (success) {
        setCalendarConnected(false);

        // Remove calendar event IDs from medications
        const updatedMedications = medications.map((medication) => {
          const updatedSchedules = medication.schedule.map((schedule) => ({
            ...schedule,
            calendarEventId: undefined,
          }));

          return {
            ...medication,
            schedule: updatedSchedules,
          };
        });

        await storage.saveMedications(updatedMedications);
        setMedications(updatedMedications);

        // Track event
        await analyticsService.trackEvent("calendar_disconnected");
      }

      return success;
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      return false;
    }
  };

  // Adherence methods
  const refreshAdherenceStats = async (): Promise<AdherenceStats> => {
    try {
      if (!currentProfileId) {
        throw new Error("No current profile");
      }

      const stats =
        await adherenceService.calculateAdherenceStats(currentProfileId);
      setAdherenceStats(stats);

      // Track event
      await analyticsService.trackAdherenceStats(currentProfileId, stats);

      return stats;
    } catch (error) {
      console.error("Error refreshing adherence stats:", error);
      return {
        total: 0,
        taken: 0,
        missed: 0,
        skipped: 0,
        adherenceRate: 0,
        currentStreak: 0,
        longestStreak: 0,
      };
    }
  };

  const getAdherenceCalendarData = async (startDate: Date, endDate: Date) => {
    try {
      if (!currentProfileId) {
        return {};
      }

      return await adherenceService.getAdherenceCalendarData(
        currentProfileId,
        startDate,
        endDate,
      );
    } catch (error) {
      console.error("Error getting adherence calendar data:", error);
      return {};
    }
  };

  const contextValue: AppContextType = {
    // Data
    medications,
    medicationLogs,
    profiles,
    currentProfileId,
    adherenceStats,
    calendarConnected,

    // Loading states
    isLoading,
    isInitialized,

    // Profile methods
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile,
    getCurrentProfile,

    // Medication methods
    createMedication,
    updateMedication,
    deleteMedication,
    getMedicationsForCurrentProfile,

    // Medication log methods
    markMedicationTaken,
    markMedicationSkipped,
    getMedicationLogsForDate,

    // Calendar methods
    connectGoogleCalendar,
    disconnectGoogleCalendar,

    // Adherence methods
    refreshAdherenceStats,
    getAdherenceCalendarData,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
