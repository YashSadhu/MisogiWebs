import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Check, X, Clock } from "lucide-react-native";
import { Medication, MedicationSchedule } from "../types";
import { useApp } from "../context/AppContext";

interface MedicationCardProps {
  medication: Medication;
  schedule: MedicationSchedule;
  status?: "upcoming" | "due" | "missed";
  onPress?: () => void;
}

export default function MedicationCard({
  medication,
  schedule,
  status = "upcoming",
  onPress,
}: MedicationCardProps) {
  const { markMedicationTaken, markMedicationSkipped } = useApp();

  const handleMarkTaken = async () => {
    await markMedicationTaken(medication.id, schedule.id);
  };

  const handleSkip = async () => {
    // In a real app, we'd show a dialog to get the reason
    await markMedicationSkipped(
      medication.id,
      schedule.id,
      "User skipped dose",
    );
  };

  const getStatusColor = () => {
    switch (status) {
      case "due":
        return "#FF9500"; // Orange
      case "missed":
        return "#FF3B30"; // Red
      default:
        return "#34C759"; // Green
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "due":
        return <Clock size={20} color="#FF9500" />;
      case "missed":
        return <X size={20} color="#FF3B30" />;
      default:
        return <Clock size={20} color="#34C759" />;
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: medication.color || "#4285F4",
      }}
      onPress={onPress}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold">{medication.name}</Text>
          <Text className="text-sm text-gray-600">{medication.dosage}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {medication.instructions}
          </Text>
        </View>

        <View className="items-center">
          <View className="bg-gray-100 rounded-full p-2 mb-2">
            {getStatusIcon()}
          </View>
          <Text
            className="text-sm font-medium"
            style={{ color: getStatusColor() }}
          >
            {schedule.time}
          </Text>
        </View>
      </View>

      {(status === "due" || status === "missed") && (
        <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
          <TouchableOpacity
            className="bg-gray-200 rounded-full py-2 px-4 mr-2"
            onPress={handleSkip}
          >
            <Text className="text-sm font-medium">Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-500 rounded-full py-2 px-4"
            onPress={handleMarkTaken}
          >
            <Text className="text-sm font-medium text-white">Mark Taken</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
