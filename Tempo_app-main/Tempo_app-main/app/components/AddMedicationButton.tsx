import React, { useState } from "react";
import { TouchableOpacity, Modal, View } from "react-native";
import { Plus } from "lucide-react-native";
import MedicationForm from "./MedicationForm";

export default function AddMedicationButton() {
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
        className="bg-blue-500 rounded-full p-2"
        onPress={openModal}
      >
        <Plus size={20} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1">
          <MedicationForm onSave={closeModal} onCancel={closeModal} />
        </View>
      </Modal>
    </>
  );
}
