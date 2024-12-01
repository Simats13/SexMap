import { ScrollView, View, Text, Switch } from "react-native";
import { Header } from "../organisms/Header";
import { SelectButton } from "../molecules/SelectButton";
import { DatePickerButton } from "../molecules/DatePickerButton";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { DateTimePickerModal } from "../organisms/DateTimePickerModal";
import { VisibilityPickerModal } from "../organisms/VisibilityPickerModal";

export interface AddSexTemplateProps {
  date: Date;
  showDatePicker: boolean;
  showVisibilityPicker: boolean;
  selectedVisibility: string;
  onDateChange: (date: Date) => void;
  onVisibilityChange: (visibility: string) => void;
  onToggleDatePicker: (show: boolean) => void;
  onToggleVisibilityPicker: (show: boolean) => void;
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const AddSexTemplate = ({
  date,
  showDatePicker,
  showVisibilityPicker,
  selectedVisibility,
  onDateChange,
  onVisibilityChange,
  onToggleDatePicker,
  onToggleVisibilityPicker,
}: AddSexTemplateProps) => (
  <ScrollView className="flex-1 bg-white">
    <Header title="Ajouter un SexPin" />
    
    <View className="p-4">
      <Text className="text-lg mb-6 text-gray-800">
        Connecte toi pour ajouter un(e) partenaire et le lieu de tes ébats
      </Text>

      <Text className="text-gray-700 mb-2">
        Sélectionne un.e de tes ami.e.s ou saisi son nom :
      </Text>
      <SelectButton
        title="Ajoute ton/ta/tes partenaire(s)"
        onPress={() => {}}
      />

      <Text className="text-gray-700 mb-2">
        Sélectionne un de tes lieux favoris ou saisi son nom :
      </Text>
      <SelectButton
        title="Ajoute le lieu de tes ébats"
        onPress={() => {}}
      />

      <DatePickerButton
        onPress={() => onToggleDatePicker(true)}
        value={formatDateTime(date)}
        placeholder="Sélectionner la date et l'heure"
      />

      <DateTimePickerModal
        isVisible={showDatePicker}
        onClose={() => onToggleDatePicker(false)}
        date={date}
        onConfirm={(newDate) => {
          onDateChange(newDate);
          onToggleDatePicker(false);
        }}
      />

      <View className="mb-6">
        <Text className="text-gray-700 mb-2">Visibilité</Text>
        <SelectButton
          title={
            selectedVisibility === "public"
              ? "Public"
              : selectedVisibility === "friends"
              ? "Amis uniquement"
              : "Privé"
          }
          icon="chevron-down"
          onPress={() => onToggleVisibilityPicker(true)}
        />
      </View>

      <VisibilityPickerModal
        isVisible={showVisibilityPicker}
        onClose={() => onToggleVisibilityPicker(false)}
        selectedValue={selectedVisibility}
        onConfirm={(value) => {
          onVisibilityChange(value);
          onToggleVisibilityPicker(false);
        }}
      />

      <Input
        multiline
        numberOfLines={4}
        placeholder="Raconter une anecdotre croustillante, comment ça s'est passé, quel était l'état dans lequel vous étiez..."
        className="h-32"
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

      <Button
        title="Envoyer mon SexPin"
        icon="map-pin"
        onPress={() => {}}
        className="mt-6"
      />
    </View>
  </ScrollView>
); 