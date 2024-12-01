import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  Button,
  Switch,
  Platform,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateTimePickerModal = ({
  isVisible,
  onClose,
  date,
  onConfirm,
}: {
  isVisible: boolean;
  onClose: () => void;
  date: Date;
  onConfirm: (date: Date) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState(date);

  if (Platform.OS === "android") {
    if (!isVisible) return null;

    return (
      <DateTimePicker
        value={selectedDate}
        mode="datetime"
        display="default"
        onChange={(event, date) => {
          if (event.type === "set" && date) {
            onConfirm(date);
          }
          onClose();
        }}
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
                onConfirm(selectedDate);
                onClose();
              }}
            >
              <Text className="text-blue-500 font-medium">Confirmer</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            display="spinner"
            onChange={(_, date) => date && setSelectedDate(date)}
            style={{ height: 200 }}
            textColor="black"
            locale="fr-FR"
          />
        </View>
      </View>
    </Modal>
  );
};

const VisibilityPickerModal = ({
  isVisible,
  onClose,
  selectedValue,
  onConfirm,
}: {
  isVisible: boolean;
  onClose: () => void;
  selectedValue: string;
  onConfirm: (value: string) => void;
}) => {
  const [tempValue, setTempValue] = useState(selectedValue);

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-xl">
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
      </View>
    </Modal>
  );
};

export default function AddSexModal() {
  const router = useRouter();
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState("public");

  // Date states
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-emerald-600 p-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl ml-4">Ajouter un SexPin</Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="p-4">
        <Text className="text-lg mb-6 text-gray-800">
          Connecte toi pour ajouter un(e) partenaire et le lieu de tes ébats
        </Text>

        {/* Partner Selection */}
        <Text className="text-gray-700 mb-2">
          Sélectionne un.e de tes ami.e.s ou saisi son nom :
        </Text>
        <TouchableOpacity className="border border-gray-300 rounded-lg p-4 mb-6 flex-row justify-between items-center">
          <Text className="text-gray-500">Ajoute ton/ta/tes partenaire(s)</Text>
          <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        {/* Location Selection */}
        <Text className="text-gray-700 mb-2">
          Sélectionne un de tes lieux favoris ou saisi son nom :
        </Text>
        <TouchableOpacity className="border border-gray-300 rounded-lg p-4 mb-6 flex-row justify-between items-center">
          <Text className="text-gray-500">Ajoute le lieu de tes ébats</Text>
          <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        {/* Date Selection */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="border border-gray-300 rounded-lg p-4 mb-6 flex-row justify-between items-center"
        >
          <Text className="text-gray-500">
            {date ? formatDateTime(date) : "Sélectionner la date et l'heure"}
          </Text>
          <Feather name="calendar" size={20} color="#666" />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          date={date}
          onConfirm={(newDate) => {
            setDate(newDate);
            setShowDatePicker(false);
          }}
        />

        {/* Visibility Dropdown */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Visibilité</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center"
          >
            <Text className="text-gray-500">
              {selectedVisibility === "public" && "Public"}
              {selectedVisibility === "friends" && "Amis uniquement"}
              {selectedVisibility === "private" && "Privé"}
            </Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <VisibilityPickerModal
          isVisible={showPicker}
          onClose={() => setShowPicker(false)}
          selectedValue={selectedVisibility}
          onConfirm={(value) => {
            setSelectedVisibility(value);
            setShowPicker(false);
          }}
        />

        {/* Story Input */}
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Raconter une anecdotre croustillante, comment ça s'est passé, quel était l'état dans lequel vous étiez..."
          className="border border-gray-300 rounded-lg p-4 text-gray-700 h-32"
          textAlignVertical="top"
        />
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-1">
            <Text className="text-gray-700 mb-1">Publier en anonyme</Text>
            <Text className="text-gray-500 text-sm">
              Votre nom sera anonymisé mais l'anecdote et le lieu seront public
            </Text>
          </View>
          <Switch className="ml-4" />
        </View>
        <TouchableOpacity className="flex-row items-center justify-center bg-red-500 rounded-full py-4 px-6 mt-6">
          <Feather name="map-pin" size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg">
            Envoyer mon SexPin
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
