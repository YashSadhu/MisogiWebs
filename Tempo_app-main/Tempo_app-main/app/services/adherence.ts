import { MedicationLog, AdherenceStats } from "../types";
import { storage } from "./storage";

export const adherenceService = {
  // Calculate adherence statistics for a profile
  calculateAdherenceStats: async (
    profileId: string,
    days: number = 30,
  ): Promise<AdherenceStats> => {
    try {
      const logs = await storage.getMedicationLogs();

      // Filter logs for the specified profile and time period
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffTime = cutoffDate.getTime();

      const profileLogs = logs.filter(
        (log) => log.profileId === profileId && log.scheduledTime >= cutoffTime,
      );

      // Calculate statistics
      const total = profileLogs.length;
      const taken = profileLogs.filter((log) => log.status === "taken").length;
      const missed = profileLogs.filter(
        (log) => log.status === "missed",
      ).length;
      const skipped = profileLogs.filter(
        (log) => log.status === "skipped",
      ).length;

      const adherenceRate = total > 0 ? (taken / total) * 100 : 0;

      // Calculate current streak
      const currentStreak = adherenceService.calculateCurrentStreak(
        profileId,
        logs,
      );

      // Calculate longest streak
      const longestStreak = adherenceService.calculateLongestStreak(
        profileId,
        logs,
      );

      return {
        total,
        taken,
        missed,
        skipped,
        adherenceRate,
        currentStreak,
        longestStreak,
      };
    } catch (error) {
      console.error("Error calculating adherence stats:", error);
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
  },

  // Calculate the current streak of days with perfect adherence
  calculateCurrentStreak: (
    profileId: string,
    logs: MedicationLog[],
  ): number => {
    // Group logs by day
    const logsByDay = adherenceService.groupLogsByDay(logs, profileId);

    // Sort days in descending order (newest first)
    const sortedDays = Object.keys(logsByDay).sort(
      (a, b) => parseInt(b) - parseInt(a),
    );

    // Check if today has any logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime().toString();

    // If no logs for today, start checking from yesterday
    let startIndex = sortedDays[0] === todayTimestamp ? 0 : -1;

    // If we don't have today's data yet, don't break the streak
    if (startIndex === -1) {
      startIndex = 0;
    }

    let streak = 0;

    // Check each day for perfect adherence
    for (let i = startIndex; i < sortedDays.length; i++) {
      const dayLogs = logsByDay[sortedDays[i]];

      // Check if all medications were taken
      const allTaken = dayLogs.every((log) => log.status === "taken");

      if (allTaken) {
        streak++;
      } else {
        break;
      }

      // Check if days are consecutive
      if (i < sortedDays.length - 1) {
        const currentDay = parseInt(sortedDays[i]);
        const nextDay = parseInt(sortedDays[i + 1]);

        // Check if days are consecutive (86400000 ms = 1 day)
        if (currentDay - nextDay > 86400000) {
          break;
        }
      }
    }

    return streak;
  },

  // Calculate the longest streak of days with perfect adherence
  calculateLongestStreak: (
    profileId: string,
    logs: MedicationLog[],
  ): number => {
    // Group logs by day
    const logsByDay = adherenceService.groupLogsByDay(logs, profileId);

    // Sort days in descending order (newest first)
    const sortedDays = Object.keys(logsByDay).sort(
      (a, b) => parseInt(b) - parseInt(a),
    );

    let currentStreak = 0;
    let longestStreak = 0;

    // Check each day for perfect adherence
    for (let i = 0; i < sortedDays.length; i++) {
      const dayLogs = logsByDay[sortedDays[i]];

      // Check if all medications were taken
      const allTaken = dayLogs.every((log) => log.status === "taken");

      if (allTaken) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }

      // Check if days are consecutive
      if (i < sortedDays.length - 1) {
        const currentDay = parseInt(sortedDays[i]);
        const nextDay = parseInt(sortedDays[i + 1]);

        // Check if days are consecutive (86400000 ms = 1 day)
        if (currentDay - nextDay > 86400000) {
          currentStreak = 0;
        }
      }
    }

    return longestStreak;
  },

  // Group logs by day for streak calculations
  groupLogsByDay: (
    logs: MedicationLog[],
    profileId: string,
  ): Record<string, MedicationLog[]> => {
    const profileLogs = logs.filter((log) => log.profileId === profileId);

    return profileLogs.reduce((acc: Record<string, MedicationLog[]>, log) => {
      // Get day timestamp (midnight)
      const date = new Date(log.scheduledTime);
      date.setHours(0, 0, 0, 0);
      const dayTimestamp = date.getTime().toString();

      if (!acc[dayTimestamp]) {
        acc[dayTimestamp] = [];
      }

      acc[dayTimestamp].push(log);
      return acc;
    }, {});
  },

  // Get adherence data for calendar heatmap
  getAdherenceCalendarData: async (
    profileId: string,
    startDate: Date,
    endDate: Date,
  ) => {
    try {
      const logs = await storage.getMedicationLogs();

      // Filter logs for the specified profile and time period
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      const profileLogs = logs.filter(
        (log) =>
          log.profileId === profileId &&
          log.scheduledTime >= startTime &&
          log.scheduledTime <= endTime,
      );

      // Group logs by day
      const logsByDay = adherenceService.groupLogsByDay(profileLogs, profileId);

      // Calculate adherence for each day
      const calendarData: Record<
        string,
        { date: string; value: number; total: number; taken: number }
      > = {};

      // Initialize all days in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
        const dayTimestamp = currentDate.setHours(0, 0, 0, 0).toString();

        const dayLogs = logsByDay[dayTimestamp] || [];
        const total = dayLogs.length;
        const taken = dayLogs.filter((log) => log.status === "taken").length;

        // Calculate adherence value (0-1)
        const value = total > 0 ? taken / total : 0;

        calendarData[dateStr] = {
          date: dateStr,
          value,
          total,
          taken,
        };

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return calendarData;
    } catch (error) {
      console.error("Error getting adherence calendar data:", error);
      return {};
    }
  },
};
