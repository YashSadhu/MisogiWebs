import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useApp } from "../context/AppContext";
import {
  MedicationCard,
  AdherenceStats,
  ProfileSelector,
  EmptyState,
} from "../components";
import { AddMedicationButton } from "../components";
import { Medication, MedicationSchedule } from "../types";

interface ScheduledMedication {
  medication: Medication;
  schedule: MedicationSchedule;
  status: "upcoming" | "due" | "missed";
}

export default function DashboardScreen() {
  const {
    getMedicationsForCurrentProfile,
    getCurrentProfile,
    medicationLogs,
    analyticsService,
  } = useApp();

  const [todayMedications, setTodayMedications] = useState<
    ScheduledMedication[]
  >([]);

  // Track screen view
  useEffect(() => {
    analyticsService.trackScreenView("Dashboard");
  }, []);

  // Get today's medications
  useEffect(() => {
    const medications = getMedicationsForCurrentProfile();
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6 (Sunday-Saturday)

    const scheduledMeds: ScheduledMedication[] = [];

    medications.forEach((medication) => {
      medication.schedule.forEach((schedule) => {
        // Check if this schedule applies to today
        if (schedule.days.includes(dayOfWeek)) {
          // Parse time (HH:MM)
          const [hours, minutes] = schedule.time.split(":").map(Number);

          // Create scheduled time
          const scheduledTime = new Date(today);
          scheduledTime.setHours(hours, minutes, 0, 0);

          // Determine status
          let status: "upcoming" | "due" | "missed" = "upcoming";

          const now = new Date();
          const timeDiff = scheduledTime.getTime() - now.getTime();

          if (timeDiff < 0) {
            // More than 1 hour late = missed
            if (timeDiff < -3600000) {
              status = "missed";
            } else {
              status = "due";
            }
          } else if (timeDiff < 1800000) {
            // Less than 30 minutes until due
            status = "due";
          }

          // Check if already taken
          const isTaken = medicationLogs.some(
            (log) =>
              log.medicationId === medication.id &&
              log.scheduleId === schedule.id &&
              new Date(log.scheduledTime).toDateString() ===
                today.toDateString(),
          );

          // Only add if not taken
          if (!isTaken) {
            scheduledMeds.push({
              medication,
              schedule,
              status,
            });
          }
        }
      });
    });

    // Sort by time
    scheduledMeds.sort((a, b) => {
      const [aHours, aMinutes] = a.schedule.time.split(":").map(Number);
      const [bHours, bMinutes] = b.schedule.time.split(":").map(Number);

      if (aHours !== bHours) {
        return aHours - bHours;
      }

      return aMinutes - bMinutes;
    });

    setTodayMedications(scheduledMeds);
  }, [getMedicationsForCurrentProfile, medicationLogs]);

  const currentProfile = getCurrentProfile();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <ProfileSelector />

        <Text className="text-2xl font-bold mb-2">
          {currentProfile
            ? `${currentProfile.name}'s Medications`
            : "Medications"}
        </Text>

        <Text className="text-gray-500 mb-6">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <AdherenceStats />

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Today's Medications</Text>
          <AddMedicationButton />
        </View>

        {todayMedications.length > 0 ? (
          todayMedications.map((item, index) => (
            <MedicationCard
              key={`${item.medication.id}-${item.schedule.id}`}
              medication={item.medication}
              schedule={item.schedule}
              status={item.status}
            />
          ))
        ) : (
          <EmptyState type="medications" />
        )}
      </View>
    </ScrollView>
  );
}
