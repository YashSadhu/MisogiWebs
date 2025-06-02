import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useApp } from "../context/AppContext";
import {
  Bell,
  Calendar,
  User,
  Trash2,
  LogOut,
  Shield,
  HelpCircle,
} from "lucide-react-native";
import { storage } from "../services/storage";
import { analyticsService } from "../services/analytics";

export default function SettingsScreen() {
  const {
    calendarConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    profiles,
    getCurrentProfile,
  } = useApp();

  const [darkMode, setDarkMode] = useState(false);
  const [sendAnalytics, setSendAnalytics] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  // Track screen view
  useEffect(() => {
    analyticsService.trackScreenView("Settings");
  }, []);

  const handleCalendarIntegration = async () => {
    if (calendarConnected) {
      Alert.alert(
        "Disconnect Calendar",
        "Are you sure you want to disconnect Google Calendar? Your medication events will no longer sync.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: async () => {
              const success = await disconnectGoogleCalendar();
              if (success) {
                Alert.alert(
                  "Success",
                  "Google Calendar disconnected successfully.",
                );
              } else {
                Alert.alert("Error", "Failed to disconnect Google Calendar.");
              }
            },
          },
        ],
      );
    } else {
      const success = await connectGoogleCalendar();
      if (!success) {
        Alert.alert(
          "Error",
          "Failed to connect to Google Calendar. Please try again.",
        );
      }
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear App Data",
      "Are you sure you want to clear all app data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            await storage.clearAllData();
            Alert.alert(
              "Success",
              "All data has been cleared. The app will now restart.",
            );
          },
        },
      ],
    );
  };

  const handleAnalyticsToggle = (value: boolean) => {
    setSendAnalytics(value);
    if (value) {
      analyticsService.init();
      analyticsService.trackEvent("analytics_enabled");
    } else {
      analyticsService.trackEvent("analytics_disabled");
    }
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    analyticsService.trackEvent("theme_changed", { darkMode: value });
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationEnabled(value);
    analyticsService.trackEvent("notifications_toggled", { enabled: value });
  };

  const navigateToFamilyProfiles = () => {
    analyticsService.trackScreenView("FamilyProfiles");
    Alert.alert(
      "Coming Soon",
      "Family profile management will be available in the next update.",
    );
  };

  const navigateToNotificationSettings = () => {
    analyticsService.trackScreenView("NotificationSettings");
    Alert.alert(
      "Coming Soon",
      "Detailed notification settings will be available in the next update.",
    );
  };

  const currentProfile = getCurrentProfile();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Settings</Text>

        {/* User Profile Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6 items-center">
          <View className="bg-blue-500 rounded-full w-16 h-16 items-center justify-center mb-2">
            <Text className="text-white text-2xl font-bold">
              {currentProfile?.name.charAt(0) || "M"}
            </Text>
          </View>
          <Text className="text-lg font-bold">
            {currentProfile?.name || "Me"}
          </Text>
          <Text className="text-sm text-gray-500 mb-3">
            {profiles.length} {profiles.length === 1 ? "Profile" : "Profiles"}
          </Text>

          <TouchableOpacity
            className="bg-blue-100 py-2 px-4 rounded-full"
            onPress={navigateToFamilyProfiles}
          >
            <Text className="text-blue-500 font-medium">Manage Profiles</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <Text className="text-lg font-bold mb-3">Features</Text>

        <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <TouchableOpacity
            className="p-4 flex-row items-center border-b border-gray-100"
            onPress={navigateToNotificationSettings}
          >
            <View className="bg-orange-100 rounded-full p-2 mr-3">
              <Bell size={20} color="#FF9500" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Notification Settings</Text>
              <Text className="text-sm text-gray-500">
                Configure reminders and alerts
              </Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={handleNotificationToggle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 flex-row items-center border-b border-gray-100"
            onPress={handleCalendarIntegration}
          >
            <View className="bg-green-100 rounded-full p-2 mr-3">
              <Calendar size={20} color="#34C759" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Calendar Integration</Text>
              <Text className="text-sm text-gray-500">
                {calendarConnected
                  ? "Connected to Google Calendar"
                  : "Sync with Google Calendar"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 flex-row items-center"
            onPress={navigateToFamilyProfiles}
          >
            <View className="bg-purple-100 rounded-full p-2 mr-3">
              <User size={20} color="#AF52DE" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Family Profiles</Text>
              <Text className="text-sm text-gray-500">
                Manage family members
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <Text className="text-lg font-bold mb-3">App Settings</Text>

        <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <View className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="font-medium">Dark Mode</Text>
            <Switch value={darkMode} onValueChange={handleDarkModeToggle} />
          </View>

          <View className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="font-medium">Send Anonymous Usage Data</Text>
            <Switch
              value={sendAnalytics}
              onValueChange={handleAnalyticsToggle}
            />
          </View>

          <TouchableOpacity
            className="p-4 flex-row items-center"
            onPress={handleClearData}
          >
            <View className="flex-row items-center">
              <Trash2 size={20} color="#FF3B30" />
              <Text className="font-medium text-red-500 ml-2">
                Clear App Data
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text className="text-lg font-bold mb-3">About</Text>

        <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <TouchableOpacity className="p-4 flex-row items-center border-b border-gray-100">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <Shield size={20} color="#4285F4" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Privacy Policy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center border-b border-gray-100">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <HelpCircle size={20} color="#4285F4" />
            </View>
            <View className="flex-1">
              <Text className="font-medium">Help & Support</Text>
            </View>
          </TouchableOpacity>

          <View className="p-4 items-center">
            <Text className="text-gray-500">MedTrack v1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity className="bg-red-100 p-4 rounded-xl flex-row items-center justify-center mb-8">
          <LogOut size={20} color="#FF3B30" />
          <Text className="ml-2 text-red-500 font-medium">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
