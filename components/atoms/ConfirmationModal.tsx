import { Modal, TouchableOpacity, View, Text } from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
}

export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = "Annuler",
  confirmText = "Supprimer",
  confirmColor = "bg-red-500",
}: ConfirmationModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClose}
      className="flex-1 bg-black/50 justify-center items-center p-4"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-sm p-4"
      >
        <Text className="text-lg font-medium text-center mb-4">{title}</Text>
        <Text className="text-gray-600 text-center mb-6">{message}</Text>
        <View className="flex-row justify-end space-x-3">
          <TouchableOpacity onPress={onClose} className="px-4 py-2 rounded-lg">
            <Text className="text-gray-600 font-medium">{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            className={`${confirmColor} px-4 py-2 rounded-lg`}
          >
            <Text className="text-white font-medium">{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
); 