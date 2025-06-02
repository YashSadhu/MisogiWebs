import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Medication, MedicationSchedule } from "../types";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  // Request permissions for notifications
  requestPermissions: async () => {
    if (Platform.OS === "web") {
      return false;
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get notification permissions");
        return false;
      }

      return true;
    }

    console.log("Must use physical device for notifications");
    return false;
  },

  // Schedule a notification for a medication dose
  scheduleMedicationReminder: async (
    medication: Medication,
    schedule: MedicationSchedule,
  ): Promise<string | null> => {
    try {
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) return null;

      // Parse time (HH:MM)
      const [hours, minutes] = schedule.time.split(":").map(Number);

      // Create trigger for each day of the week
      const triggers = schedule.days.map((day) => ({
        weekday: day + 1, // Notifications API uses 1-7 for days (1 = Monday)
        hour: hours,
        minute: minutes,
        repeats: true,
      }));

      // Schedule notifications for each day
      const notificationIds = await Promise.all(
        triggers.map((trigger) =>
          Notifications.scheduleNotificationAsync({
            content: {
              title: `Time to take ${medication.name}`,
              body: `${medication.dosage} - ${medication.instructions}`,
              data: { medicationId: medication.id, scheduleId: schedule.id },
            },
            trigger,
          }),
        ),
      );

      // Return the first ID (we'll use this as a reference)
      return notificationIds[0] || null;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  },

  // Cancel a scheduled notification
  cancelMedicationReminder: async (notificationId: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return true;
    } catch (error) {
      console.error("Error canceling notification:", error);
      return false;
    }
  },

  // Cancel all notifications for a medication
  cancelAllMedicationReminders: async (
    medicationId: string,
    schedules: MedicationSchedule[],
  ) => {
    try {
      for (const schedule of schedules) {
        if (schedule.notificationId) {
          await Notifications.cancelScheduledNotificationAsync(
            schedule.notificationId,
          );
        }
      }
      return true;
    } catch (error) {
      console.error("Error canceling notifications:", error);
      return false;
    }
  },

  // Get all pending notifications
  getPendingNotifications: async () => {
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};

// Add a listener for notification responses
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void,
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

// Add a listener for received notifications
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void,
) => {
  return Notifications.addNotificationReceivedListener(callback);
};
