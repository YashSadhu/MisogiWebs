import React from "react";
import { View, Text, Image } from "react-native";
import { Calendar, AlertCircle } from "lucide-react-native";

type EmptyStateType = "medications" | "calendar" | "logs" | "profiles";

interface EmptyStateProps {
  type: EmptyStateType;
  message?: string;
}

export default function EmptyState({ type, message }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "medications":
        return <AlertCircle size={48} color="#4285F4" />;
      case "calendar":
        return <Calendar size={48} color="#4285F4" />;
      case "logs":
        return <AlertCircle size={48} color="#4285F4" />;
      case "profiles":
        return <AlertCircle size={48} color="#4285F4" />;
      default:
        return <AlertCircle size={48} color="#4285F4" />;
    }
  };

  const getMessage = () => {
    if (message) return message;

    switch (type) {
      case "medications":
        return "No medications added yet. Tap the + button to add your first medication.";
      case "calendar":
        return "No adherence data available yet. Start tracking your medications to see your adherence calendar.";
      case "logs":
        return "No medication logs found. Your medication history will appear here once you start tracking.";
      case "profiles":
        return "No profiles found. Add a profile to get started.";
      default:
        return "No data available.";
    }
  };

  return (
    <View className="bg-white rounded-xl p-8 items-center justify-center">
      <View className="bg-blue-100 rounded-full p-4 mb-4">{getIcon()}</View>
      <Text className="text-gray-500 text-center">{getMessage()}</Text>
    </View>
  );
}
