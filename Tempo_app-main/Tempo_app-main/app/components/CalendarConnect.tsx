import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useApp } from "../context/AppContext";
import { Calendar, Check, X } from "lucide-react-native";

export default function CalendarConnect() {
  const { calendarConnected, connectGoogleCalendar, disconnectGoogleCalendar } =
    useApp();

  const handleConnect = async () => {
    if (calendarConnected) {
      await disconnectGoogleCalendar();
    } else {
      await connectGoogleCalendar();
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Calendar size={20} color="#4285F4" />
          <Text className="text-lg font-medium ml-2">Google Calendar</Text>
        </View>

        <View className="flex-row items-center">
          {calendarConnected ? (
            <>
              <Check size={16} color="#34C759" />
              <Text className="text-green-500 ml-1">Connected</Text>
            </>
          ) : (
            <>
              <X size={16} color="#FF3B30" />
              <Text className="text-red-500 ml-1">Not Connected</Text>
            </>
          )}
        </View>
      </View>

      <Text className="text-sm text-gray-500 my-2">
        {calendarConnected
          ? "Your medication schedule is synced with Google Calendar."
          : "Connect to sync your medication schedule with Google Calendar."}
      </Text>

      <TouchableOpacity
        className={`py-2 px-4 rounded-full ${calendarConnected ? "bg-red-100" : "bg-blue-500"}`}
        onPress={handleConnect}
      >
        <Text
          className={`text-center font-medium ${calendarConnected ? "text-red-500" : "text-white"}`}
        >
          {calendarConnected ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
