import { User } from "firebase/auth";
import { ScrollView, View, Text, Switch } from "react-native";
import { Header } from "../organisms/Header";
import { SelectButton } from "../molecules/SelectButton";
import { DatePickerButton } from "../molecules/DatePickerButton";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { DateTimePickerModal } from "../organisms/DateTimePickerModal";
import { VisibilityPickerModal } from "../organisms/VisibilityPickerModal";
import { RatingBar } from "../atoms/RatingBar";
import { LocationPicker } from "../molecules/LocationPicker";

export interface AddSexTemplateProps {
  user: User | null;
  date: Date;
  showDatePicker: boolean;
  showVisibilityPicker: boolean;
  selectedVisibility: string;
  onDateChange: (date: Date) => void;
  onVisibilityChange: (visibility: string) => void;
  onToggleDatePicker: (show: boolean) => void;
  onToggleVisibilityPicker: (show: boolean) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
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
  user,
  date,
  showDatePicker,
  showVisibilityPicker,
  selectedVisibility,
  onDateChange,
  onVisibilityChange,
  onToggleDatePicker,
  onToggleVisibilityPicker,
  rating,
  onRatingChange,
  onLocationChange,
}: AddSexTemplateProps) => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <Header title="Ajouter un SexPin" />
        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="mb-6">
              <Text className="text-gray-700 mb-2">
                Sélectionne le lieu précis de tes ébats :
              </Text>
              <LocationPicker onLocationChange={onLocationChange} />
            </View>

            <Text className="text-lg mb-6 text-gray-800">
              {user
                ? "Ajoute un(e) partenaire et le lieu de tes ébats"
                : "Connecte toi pour ajouter un(e) partenaire et le lieu de tes ébats"}
            </Text>

            {user && (
              <>
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
              </>
            )}

            <DatePickerButton
              onPress={() => onToggleDatePicker(true)}
              value={formatDateTime(date)}
              placeholder="Sélectionner la date et l'heure"
            />

            {user && (
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
            )}

            <Input
              multiline
              numberOfLines={4}
              placeholder="Raconter une anecdotre croustillante, comment ça s'est passé, quel était l'état dans lequel vous étiez..."
              className="h-32"
              textAlignVertical="top"
            />

            {user && (
              <View className="flex-row items-center justify-between mt-4 mb-8">
                <View className="flex-1">
                  <Text className="text-gray-700 mb-1">Publier en anonyme</Text>
                  <Text className="text-gray-500 text-sm">
                    Votre nom sera anonymisé mais l'anecdote et le lieu seront
                    public
                  </Text>
                </View>
                <Switch className="ml-4" />
              </View>
            )}

            <View className="mb-8 mt-5">
              <Text className="text-gray-700 mb-2">Note ton expérience</Text>
              <RatingBar rating={rating} onRatingChange={onRatingChange} />
            </View>

            <Button
              title="Envoyer mon SexPin"
              icon="map-pin"
              onPress={() => {}}
              className="mt-8"
            />
          </View>
        </ScrollView>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        onClose={() => onToggleDatePicker(false)}
        date={date}
        onConfirm={(newDate) => {
          onDateChange(newDate);
          onToggleDatePicker(false);
        }}
      />

      <VisibilityPickerModal
        isVisible={showVisibilityPicker}
        onClose={() => onToggleVisibilityPicker(false)}
        selectedValue={selectedVisibility}
        onConfirm={(value) => {
          onVisibilityChange(value);
          onToggleVisibilityPicker(false);
        }}
      />
    </View>
  );
};
