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
import { useState } from "react";

export interface AddSexTemplateProps {
  user: User | null;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: {
    date: Date;
    description?: string;
    location: {
      latitude: number;
      longitude: number;
    };
    locationName?: string;
    rating?: number;
    visibility: 'public' | 'private' | 'friends';
    partners?: string[];
    anonym?: boolean;
  }) => void;
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

export const AddSexTemplate = ({ user, loading, error, onSubmit }: AddSexTemplateProps) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'private' | 'friends'>('public');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 48.866667,
    longitude: 2.333333
  });
  const [description, setDescription] = useState('');
  const [anonym, setAnonym] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      date,
      description,
      location,
      rating,
      visibility: selectedVisibility,
      anonym,
    });
  };

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
              <LocationPicker onLocationChange={setLocation} />
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
              onPress={() => setShowDatePicker(true)}
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
                  onPress={() => setShowPicker(true)}
                />
              </View>
            )}

            <Input
              multiline
              numberOfLines={4}
              placeholder="Raconter une anecdotre croustillante, comment ça s'est passé, quel était l'état dans lequel vous étiez..."
              className="h-32"
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
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
              <RatingBar rating={rating} onRatingChange={setRating} />
            </View>

            <Button
              title="Ajouter"
              onPress={handleSubmit}
              loading={loading}
              className="mt-4"
            />

            {error && (
              <Text className="text-red-500 text-center mt-2">
                {error}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        date={date}
        onConfirm={(newDate) => {
          setDate(newDate);
          setShowDatePicker(false);
        }}
      />

      <VisibilityPickerModal
        isVisible={showPicker}
        onClose={() => setShowPicker(false)}
        selectedValue={selectedVisibility}
        onConfirm={(value) => {
          setSelectedVisibility(value as 'public' | 'private' | 'friends');
          setShowPicker(false);
        }}
      />
    </View>
  );
};
