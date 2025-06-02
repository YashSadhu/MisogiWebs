import * as Calendar from "expo-calendar";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import { Medication, MedicationSchedule } from "../types";
import { secureStorage, storage } from "./storage";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_AUTH_CONFIG = {
  clientId: "test-client-id", // Replace with actual client ID in production
  scopes: ["https://www.googleapis.com/auth/calendar"],
  redirectUri: AuthSession.makeRedirectUri({
    scheme: "medtrack",
    path: "auth",
  }),
};

export const calendarService = {
  // Request calendar permissions
  requestCalendarPermissions: async () => {
    if (Platform.OS === "web") {
      return false;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === "granted";
  },

  // Get available calendars
  getCalendars: async () => {
    try {
      const hasPermission = await calendarService.requestCalendarPermissions();
      if (!hasPermission) return [];

      return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    } catch (error) {
      console.error("Error getting calendars:", error);
      return [];
    }
  },

  // Create a medication calendar event
  createMedicationEvent: async (
    medication: Medication,
    schedule: MedicationSchedule,
  ): Promise<string | null> => {
    try {
      const calendarIntegration = await storage.getCalendarIntegration();
      if (!calendarIntegration.connected || !calendarIntegration.calendarId) {
        return null;
      }

      const hasPermission = await calendarService.requestCalendarPermissions();
      if (!hasPermission) return null;

      // Parse time (HH:MM)
      const [hours, minutes] = schedule.time.split(":").map(Number);

      // Create start and end dates
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + 15); // 15 minute event

      // Create event details
      const eventDetails = {
        title: `Take ${medication.name}`,
        notes: `${medication.dosage} - ${medication.instructions}`,
        startDate,
        endDate,
        calendarId: calendarIntegration.calendarId,
        alarms: [{ relativeOffset: -5 }], // 5 minute reminder
        recurrenceRule: {
          frequency: Calendar.Frequency.WEEKLY,
          occurrence: 52, // Repeat for a year
          daysOfTheWeek: schedule.days.map((day) => ({
            dayOfTheWeek: day + 1,
          })),
        },
      };

      // Create the event
      const eventId = await Calendar.createEventAsync(
        calendarIntegration.calendarId,
        eventDetails,
      );
      return eventId;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      return null;
    }
  },

  // Delete a medication calendar event
  deleteMedicationEvent: async (calendarId: string, eventId: string) => {
    try {
      const hasPermission = await calendarService.requestCalendarPermissions();
      if (!hasPermission) return false;

      await Calendar.deleteEventAsync(eventId);
      return true;
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      return false;
    }
  },

  // Google Calendar OAuth
  connectGoogleCalendar: async () => {
    try {
      // Start OAuth flow
      const discovery = await AuthSession.fetchDiscoveryAsync(
        "https://accounts.google.com",
      );

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_AUTH_CONFIG.clientId,
        scopes: GOOGLE_AUTH_CONFIG.scopes,
        redirectUri: GOOGLE_AUTH_CONFIG.redirectUri,
      });

      const result = await request.promptAsync(discovery);

      if (result.type === "success") {
        // Save the auth data
        await secureStorage.saveGoogleAuth({
          accessToken: result.authentication?.accessToken,
          refreshToken: result.authentication?.refreshToken,
          expiresIn: result.authentication?.expiresIn,
          issuedAt: Date.now(),
        });

        // Create or find a calendar for medication tracking
        const calendarId =
          await calendarService.createOrFindMedicationCalendar();

        if (calendarId) {
          await storage.saveCalendarIntegration({
            connected: true,
            calendarId,
            syncEnabled: true,
          });
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
      return false;
    }
  },

  // Create or find a dedicated calendar for medications
  createOrFindMedicationCalendar: async (): Promise<string | null> => {
    try {
      const authData = await secureStorage.getGoogleAuth();
      if (!authData?.accessToken) return null;

      // Check if we need to refresh the token
      if (authData.issuedAt + authData.expiresIn * 1000 < Date.now()) {
        // Token expired, need to reconnect
        return null;
      }

      // List calendars to see if our calendar already exists
      const response = await fetch(
        `${GOOGLE_CALENDAR_API}/users/me/calendarList`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      // Look for our calendar
      const medCalendar = data.items?.find(
        (cal: any) => cal.summary === "MedTrack Medications",
      );

      if (medCalendar) {
        return medCalendar.id;
      }

      // Create a new calendar
      const createResponse = await fetch(`${GOOGLE_CALENDAR_API}/calendars`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: "MedTrack Medications",
          description: "Medication schedule and reminders from MedTrack app",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const newCalendar = await createResponse.json();
      return newCalendar.id;
    } catch (error) {
      console.error("Error creating medication calendar:", error);
      return null;
    }
  },

  // Disconnect Google Calendar
  disconnectGoogleCalendar: async () => {
    try {
      await secureStorage.removeGoogleAuth();
      await storage.saveCalendarIntegration({
        connected: false,
        syncEnabled: false,
      });
      return true;
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      return false;
    }
  },
};
