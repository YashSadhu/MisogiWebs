import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useApp } from "../context/AppContext";

interface CalendarDay {
  date: Date;
  dateStr: string;
  value: number;
  isCurrentMonth: boolean;
}

export default function AdherenceCalendar() {
  const { getAdherenceCalendarData } = useApp();
  const [calendarData, setCalendarData] = useState<Record<string, any>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Load calendar data
  useEffect(() => {
    const loadCalendarData = async () => {
      // Calculate start and end dates for the current month view
      const startDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );
      const endDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
      );

      // Get first day of the month and adjust for calendar display
      const firstDay = new Date(startDate);
      firstDay.setDate(firstDay.getDate() - firstDay.getDay());

      // Get last day of the calendar view (6 weeks total)
      const lastDay = new Date(endDate);
      const daysToAdd = 6 - lastDay.getDay();
      lastDay.setDate(lastDay.getDate() + daysToAdd);

      // Fetch adherence data
      const data = await getAdherenceCalendarData(firstDay, lastDay);
      setCalendarData(data);

      // Generate calendar days
      const days: CalendarDay[] = [];
      const currentDate = new Date(firstDay);

      while (currentDate <= lastDay) {
        const dateStr = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
        const isCurrentMonth =
          currentDate.getMonth() === currentMonth.getMonth();

        days.push({
          date: new Date(currentDate),
          dateStr,
          value: data[dateStr]?.value || 0,
          isCurrentMonth,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setCalendarDays(days);
    };

    loadCalendarData();
  }, [currentMonth]);

  // Get color based on adherence value
  const getColorForValue = (value: number) => {
    if (value === 0) return "#F2F2F7"; // No data
    if (value < 0.5) return "#FF3B30"; // Red (poor)
    if (value < 0.8) return "#FF9500"; // Orange (fair)
    return "#34C759"; // Green (good)
  };

  // Format month name
  const formatMonth = () => {
    return currentMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Adherence Calendar</Text>
        <View className="flex-row">
          <Text className="text-blue-500 mr-4" onPress={goToPreviousMonth}>
            Previous
          </Text>
          <Text className="text-blue-500" onPress={goToNextMonth}>
            Next
          </Text>
        </View>
      </View>

      <Text className="text-center font-medium mb-2">{formatMonth()}</Text>

      {/* Day headers */}
      <View className="flex-row justify-between mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text
            key={day}
            className="text-xs text-gray-500 text-center"
            style={{ width: 32 }}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap">
        {calendarDays.map((day, index) => (
          <View
            key={index}
            className="items-center justify-center mb-2"
            style={{ width: 32, height: 32 }}
          >
            <View
              className="rounded-full items-center justify-center"
              style={{
                width: 28,
                height: 28,
                backgroundColor: getColorForValue(day.value),
                opacity: day.isCurrentMonth ? 1 : 0.3,
              }}
            >
              <Text
                className="text-xs"
                style={{ color: day.value > 0 ? "white" : "black" }}
              >
                {day.date.getDate()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View className="flex-row justify-center mt-4">
        <View className="flex-row items-center mr-4">
          <View className="w-3 h-3 rounded-full bg-red-500 mr-1" />
          <Text className="text-xs">Missed</Text>
        </View>
        <View className="flex-row items-center mr-4">
          <View className="w-3 h-3 rounded-full bg-orange-500 mr-1" />
          <Text className="text-xs">Partial</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
          <Text className="text-xs">Perfect</Text>
        </View>
      </View>
    </View>
  );
}
