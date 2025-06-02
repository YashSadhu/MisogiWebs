import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useApp } from "../context/AppContext";
import { Clock, Calendar, Plus, Minus } from "lucide-react-native";
import { Medication, MedicationSchedule } from "../types";
import { v4 as uuidv4 } from "uuid";

interface MedicationFormProps {
  existingMedication?: Medication;
  onSave: () => void;
  onCancel: () => void;
}

export default function MedicationForm({
  existingMedication,
  onSave,
  onCancel,
}: MedicationFormProps) {
  const { createMedication, updateMedication, currentProfileId } = useApp();

  // Form state
  const [name, setName] = useState(existingMedication?.name || "");
  const [dosage, setDosage] = useState(existingMedication?.dosage || "");
  const [instructions, setInstructions] = useState(
    existingMedication?.instructions || "",
  );
  const [color, setColor] = useState(existingMedication?.color || "#4285F4");
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(
    existingMedication?.schedule || [
      {
        id: uuidv4(),
        time: "08:00",
        days: [0, 1, 2, 3, 4, 5, 6], // All days by default
      },
    ],
  );

  // Available colors
  const colors = [
    "#4285F4", // Blue
    "#34A853", // Green
    "#FBBC05", // Yellow
    "#EA4335", // Red
    "#9C27B0", // Purple
    "#FF9800", // Orange
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add a new schedule
  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        id: uuidv4(),
        time: "08:00",
        days: [0, 1, 2, 3, 4, 5, 6],
      },
    ]);
  };

  // Remove a schedule
  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  // Update schedule time
  const updateScheduleTime = (id: string, time: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, time } : schedule,
      ),
    );
  };

  // Toggle day selection
  const toggleDay = (scheduleId: string, day: number) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id === scheduleId) {
          const days = [...schedule.days];
          const index = days.indexOf(day);

          if (index === -1) {
            days.push(day);
          } else {
            days.splice(index, 1);
          }

          return { ...schedule, days };
        }
        return schedule;
      }),
    );
  };

  // Save medication
  const handleSave = async () => {
    if (!name || !dosage || schedules.length === 0 || !currentProfileId) {
      return;
    }

    try {
      if (existingMedication) {
        // Update existing medication
        await updateMedication({
          ...existingMedication,
          name,
          dosage,
          instructions,
          color,
          schedule: schedules,
        });
      } else {
        // Create new medication
        await createMedication({
          name,
          dosage,
          instructions,
          color,
          schedule: schedules,
          profileId: currentProfileId,
        });
      }

      onSave();
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">
        {existingMedication ? "Edit Medication" : "Add Medication"}
      </Text>

      {/* Medication Name */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Medication Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          value={name}
          onChangeText={setName}
          placeholder="Enter medication name"
        />
      </View>

      {/* Dosage */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Dosage</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          value={dosage}
          onChangeText={setDosage}
          placeholder="e.g., 10mg, 1 tablet"
        />
      </View>

      {/* Instructions */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Instructions</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="e.g., Take with food"
          multiline
        />
      </View>

      {/* Color Selection */}
      <View className="mb-6">
        <Text className="text-sm font-medium mb-2">Color</Text>
        <View className="flex-row flex-wrap">
          {colors.map((c) => (
            <TouchableOpacity
              key={c}
              className={`w-10 h-10 rounded-full m-1 ${color === c ? "border-2 border-black" : ""}`}
              style={{ backgroundColor: c }}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
      </View>

      {/* Schedule */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">Schedule</Text>
          <TouchableOpacity
            className="bg-blue-500 rounded-full p-2"
            onPress={addSchedule}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {schedules.map((schedule, index) => (
          <View
            key={schedule.id}
            className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Clock size={20} color="#4285F4" />
                <Text className="text-lg font-medium ml-2">
                  Time {index + 1}
                </Text>
              </View>

              {schedules.length > 1 && (
                <TouchableOpacity
                  className="bg-red-100 rounded-full p-2"
                  onPress={() => removeSchedule(schedule.id)}
                >
                  <Minus size={16} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>

            {/* Time Picker */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">Time</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={schedule.time}
                onChangeText={(time) => updateScheduleTime(schedule.id, time)}
                placeholder="HH:MM"
              />
            </View>

            {/* Day Selection */}
            <View>
              <Text className="text-sm font-medium mb-2">Days</Text>
              <View className="flex-row justify-between">
                {dayNames.map((day, i) => (
                  <TouchableOpacity
                    key={i}
                    className={`w-9 h-9 rounded-full items-center justify-center ${schedule.days.includes(i) ? "bg-blue-500" : "bg-gray-200"}`}
                    onPress={() => toggleDay(schedule.id, i)}
                  >
                    <Text
                      className={`text-xs font-medium ${schedule.days.includes(i) ? "text-white" : "text-gray-700"}`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-end mb-8">
        <TouchableOpacity
          className="bg-gray-200 rounded-lg py-3 px-6 mr-3"
          onPress={onCancel}
        >
          <Text className="font-medium">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-3 px-6"
          onPress={handleSave}
        >
          <Text className="font-medium text-white">Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
