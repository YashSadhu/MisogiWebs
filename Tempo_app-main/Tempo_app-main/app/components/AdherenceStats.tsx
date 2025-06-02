import React from "react";
import { View, Text } from "react-native";
import { useApp } from "../context/AppContext";
import { Award, Flame, Target } from "lucide-react-native";

export default function AdherenceStats() {
  const { adherenceStats, refreshAdherenceStats } = useApp();

  if (!adherenceStats) {
    return null;
  }

  const { adherenceRate, currentStreak, longestStreak } = adherenceStats;

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <Text className="text-lg font-bold mb-4">Adherence Stats</Text>

      <View className="flex-row justify-between">
        <View className="items-center">
          <View className="bg-blue-100 rounded-full p-3 mb-2">
            <Target size={24} color="#4285F4" />
          </View>
          <Text className="text-2xl font-bold">
            {adherenceRate.toFixed(0)}%
          </Text>
          <Text className="text-xs text-gray-500">Adherence</Text>
        </View>

        <View className="items-center">
          <View className="bg-orange-100 rounded-full p-3 mb-2">
            <Flame size={24} color="#FF9500" />
          </View>
          <Text className="text-2xl font-bold">{currentStreak}</Text>
          <Text className="text-xs text-gray-500">Current Streak</Text>
        </View>

        <View className="items-center">
          <View className="bg-green-100 rounded-full p-3 mb-2">
            <Award size={24} color="#34C759" />
          </View>
          <Text className="text-2xl font-bold">{longestStreak}</Text>
          <Text className="text-xs text-gray-500">Best Streak</Text>
        </View>
      </View>
    </View>
  );
}
