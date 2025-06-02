import React, { useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { AdherenceCalendar, CalendarConnect } from "../components";
import { useApp } from "../context/AppContext";

export default function CalendarScreen() {
  const { analyticsService } = useApp();

  // Track screen view
  useEffect(() => {
    analyticsService.trackScreenView("Calendar");
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Adherence Calendar</Text>

        <AdherenceCalendar />

        <View className="h-6" />

        <Text className="text-2xl font-bold mb-4">Calendar Integration</Text>

        <CalendarConnect />
      </View>
    </ScrollView>
  );
}
