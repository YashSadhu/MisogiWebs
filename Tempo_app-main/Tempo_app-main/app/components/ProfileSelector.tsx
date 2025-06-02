import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useApp } from "../context/AppContext";
import { User } from "lucide-react-native";
import AddProfileButton from "./AddProfileButton";

export default function ProfileSelector() {
  const { profiles, currentProfileId, switchProfile } = useApp();

  const handleProfilePress = (profileId: string) => {
    switchProfile(profileId);
  };

  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="py-2"
      >
        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            className={`mr-3 items-center ${profile.id === currentProfileId ? "opacity-100" : "opacity-50"}`}
            onPress={() => handleProfilePress(profile.id)}
          >
            <View
              className="rounded-full items-center justify-center mb-1"
              style={{
                width: 48,
                height: 48,
                backgroundColor: profile.color || "#4285F4",
                borderWidth: profile.id === currentProfileId ? 2 : 0,
                borderColor: "white",
              }}
            >
              <User size={24} color="white" />
            </View>
            <Text className="text-xs">{profile.name}</Text>
          </TouchableOpacity>
        ))}

        <AddProfileButton />
      </ScrollView>
    </View>
  );
}
