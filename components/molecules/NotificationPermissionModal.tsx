import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface NotificationPermissionModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const NotificationPermissionModal = ({
  visible,
  onAccept,
  onDecline,
}: NotificationPermissionModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDecline}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-[80%] max-w-sm">
          <Text className="text-xl font-bold mb-4">Notifications</Text>
          <Text className="text-gray-600 mb-6">
            Voulez-vous recevoir des notifications quand vos amis ajoutent un pin ?
          </Text>
          <View className="flex-row justify-end space-x-4">
            <TouchableOpacity
              onPress={onDecline}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              <Text className="text-gray-700">Non merci</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAccept}
              className="px-4 py-2 rounded-lg bg-blue-500"
            >
              <Text className="text-white">Oui</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 