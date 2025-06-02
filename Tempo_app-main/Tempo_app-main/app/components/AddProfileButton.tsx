import React, { useState } from "react";
import { TouchableOpacity, Modal, View, Text } from "react-native";
import { Plus } from "lucide-react-native";
import ProfileForm from "./ProfileForm";

export default function AddProfileButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        className="mr-3 items-center opacity-50"
        onPress={openModal}
      >
        <View
          className="rounded-full items-center justify-center mb-1 border border-dashed border-gray-400"
          style={{ width: 48, height: 48 }}
        >
          <Plus size={24} color="#999" />
        </View>
        <Text className="text-xs">Add</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1">
          <ProfileForm onSave={closeModal} onCancel={closeModal} />
        </View>
      </Modal>
    </>
  );
}
