import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export interface VisibilityPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedValue: 'public' | 'private' | 'friends';
  onConfirm: (value: 'public' | 'private' | 'friends') => void;
}

export const VisibilityPickerModal = ({
  isVisible,
  onClose,
  selectedValue,
  onConfirm,
}: VisibilityPickerModalProps) => {
  const [tempValue, setTempValue] = useState(selectedValue);

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <TouchableOpacity 
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="bg-white rounded-t-xl shadow-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={onClose}>
                <Text className="text-red-500 font-medium">Annuler</Text>
              </TouchableOpacity>
              <Text className="font-medium">Visibilité</Text>
              <TouchableOpacity
                onPress={() => {
                  onConfirm(tempValue);
                  onClose();
                }}
              >
                <Text className="text-blue-500 font-medium">Confirmer</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={tempValue}
              onValueChange={setTempValue}
              style={{ height: 200 }}
            >
              <Picker.Item label="Public" value="public" />
              <Picker.Item label="Amis uniquement" value="friends" />
              <Picker.Item label="Privé" value="private" />
            </Picker>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};