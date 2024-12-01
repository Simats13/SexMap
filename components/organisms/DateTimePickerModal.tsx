import { View, Text, TouchableOpacity, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

export interface DateTimePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  date: Date;
  onConfirm: (date: Date) => void;
}

export const DateTimePickerModal = ({
  isVisible,
  onClose,
  date,
  onConfirm,
}: DateTimePickerModalProps) => {
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    const now = new Date();
    if (newDate > now) {
      // If date is in future, don't update
      return;
    }
    setSelectedDate(newDate);
  };

  if (Platform.OS === "android") {
    if (!isVisible) return null;

    return (
      <DateTimePicker
        value={selectedDate}
        mode="datetime"
        display="default"
        onChange={(event, date) => {
          if (event.type === "set" && date) {
            if (date <= new Date()) {
              onConfirm(date);
            }
          }
          onClose();
        }}
        maximumDate={new Date()}
      />
    );
  }

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-xl">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-medium">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (selectedDate <= new Date()) {
                  onConfirm(selectedDate);
                  onClose();
                }
              }}
            >
              <Text className="text-blue-500 font-medium">Confirmer</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            display="spinner"
            onChange={(_, date) => handleDateChange(date)}
            style={{ height: 200 }}
            textColor="black"
            locale="fr-FR"
            maximumDate={new Date()}
          />
        </View>
      </View>
    </Modal>
  );
};