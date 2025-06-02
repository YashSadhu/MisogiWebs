import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useApp } from "../context/AppContext";
import { Profile } from "../types";

interface ProfileFormProps {
  existingProfile?: Profile;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileForm({
  existingProfile,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const { createProfile, updateProfile } = useApp();

  // Form state
  const [name, setName] = useState(existingProfile?.name || "");
  const [relationship, setRelationship] = useState(
    existingProfile?.relationship || "self",
  );
  const [color, setColor] = useState(existingProfile?.color || "#4285F4");

  // Available colors
  const colors = [
    "#4285F4", // Blue
    "#34A853", // Green
    "#FBBC05", // Yellow
    "#EA4335", // Red
    "#9C27B0", // Purple
    "#FF9800", // Orange
  ];

  // Available relationships
  const relationships = [
    { value: "self", label: "Self" },
    { value: "spouse", label: "Spouse/Partner" },
    { value: "child", label: "Child" },
    { value: "parent", label: "Parent" },
    { value: "relative", label: "Other Relative" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" },
  ];

  // Save profile
  const handleSave = async () => {
    if (!name) {
      return;
    }

    try {
      if (existingProfile) {
        // Update existing profile
        await updateProfile({
          ...existingProfile,
          name,
          relationship,
          color,
        });
      } else {
        // Create new profile
        await createProfile({
          name,
          relationship,
          color,
          isDefault: false,
        });
      }

      onSave();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">
        {existingProfile ? "Edit Profile" : "Add Profile"}
      </Text>

      {/* Profile Name */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          value={name}
          onChangeText={setName}
          placeholder="Enter profile name"
        />
      </View>

      {/* Relationship */}
      <View className="mb-6">
        <Text className="text-sm font-medium mb-2">Relationship</Text>
        <View className="flex-row flex-wrap">
          {relationships.map((rel) => (
            <TouchableOpacity
              key={rel.value}
              className={`py-2 px-4 rounded-full m-1 ${relationship === rel.value ? "bg-blue-500" : "bg-gray-200"}`}
              onPress={() => setRelationship(rel.value)}
            >
              <Text
                className={`text-sm ${relationship === rel.value ? "text-white" : "text-gray-800"}`}
              >
                {rel.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    </View>
  );
}
