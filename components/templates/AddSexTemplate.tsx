import { User } from "firebase/auth";
import { ScrollView, View, Text, Switch, TouchableOpacity } from "react-native";
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
import { TagInput } from "../molecules/TagInput";

interface AddSexTemplateProps {
  user: User | null;
  loading?: boolean;
  error?: string | null;
  partners: Array<{ label: string; value: string }>;
  selectedPartners: Array<{ label: string; value: string }>;
  onUpdatePartners: (tags: string[]) => void;
  onSubmit: (data: any) => void;
  locations: Array<{ label: string; value: string }>;
  selectedLocations: Array<{ label: string; value: string }>;
  onUpdateLocations: (tags: string[]) => void;
  date: Date;
  setDate: (date: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  selectedVisibility: "public" | "private" | "friends";
  setSelectedVisibility: (visibility: "public" | "private" | "friends") => void;
  rating: number;
  setRating: (rating: number) => void;
  location: { latitude: number; longitude: number };
  setLocation: (location: { latitude: number; longitude: number }) => void;
  description: string;
  setDescription: (description: string) => void;
  anonym: boolean;
  setAnonym: (anonym: boolean) => void;
  onClose: () => void;
  onPressAuth: () => void;
  partnersInput: string;
  setPartnersInput: (value: string) => void;
  locationsInput: string;
  setLocationsInput: (value: string) => void;
  partnersFiltered: string[];
  locationsFiltered: string[];
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
  loading,
  error,
  partners,
  selectedPartners,
  onUpdatePartners,
  onSubmit,
  locations,
  selectedLocations,
  onUpdateLocations,
  date,
  setDate,
  showDatePicker,
  setShowDatePicker,
  showPicker,
  setShowPicker,
  selectedVisibility,
  setSelectedVisibility,
  rating,
  setRating,
  location,
  setLocation,
  description,
  setDescription,
  anonym,
  setAnonym,
  onClose,
  onPressAuth,
  partnersInput,
  setPartnersInput,
  locationsInput,
  setLocationsInput,
  partnersFiltered,
  locationsFiltered,
}: AddSexTemplateProps) => {
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
        <Header title="Ajouter un SexPin" onClose={onClose} />
        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="mb-6">
              <Text className="text-gray-700 mb-2">
                Sélectionne le lieu précis de tes ébats :
              </Text>
              <LocationPicker onLocationChange={setLocation} />
            </View>

            {user ? (
              <Text className="text-lg mb-6 text-gray-800">
                Ajoute un(e) partenaire et le lieu de tes ébats
              </Text>
            ) : (
              <TouchableOpacity onPress={onPressAuth}>
                <Text className="text-lg mb-6 text-blue-500">
                  Connecte-toi pour ajouter un(e) partenaire et le lieu de tes
                  ébats
                </Text>
              </TouchableOpacity>
            )}

            {user && (
              <>
                <Text className="text-gray-700 mb-2">
                  Sélectionne un.e de tes ami.e.s ou saisi son nom :
                </Text>
                <TagInput
                  tags={selectedPartners.map((p) => p.value)}
                  inputValue={partnersInput}
                  onInputChange={setPartnersInput}
                  onAddTag={(tag) => onUpdatePartners([...selectedPartners.map(p => p.value), tag])}
                  onRemoveTag={(tag) => onUpdatePartners(selectedPartners.map(p => p.value).filter(t => t !== tag))}
                  placeholder="Ajouter un partenaire de crime ..."
                  filteredSuggestions={partnersFiltered}
                />
                <Text className="text-black mb-2">
                  Sélectionne un de tes lieux favoris ou saisi son nom :
                </Text>
                <TagInput
                  tags={selectedLocations.map((p) => p.value)}
                  inputValue={locationsInput}
                  onInputChange={setLocationsInput}
                  onAddTag={(tag) => onUpdateLocations([...selectedLocations.map(p => p.value), tag])}
                  onRemoveTag={(tag) => onUpdateLocations(selectedLocations.map(p => p.value).filter(t => t !== tag))}
                  placeholder="Ajouter un lieu de tes ébats ..."
                  filteredSuggestions={locationsFiltered}
                />
              </>
            )}

            <View>
              <Text className="text-gray-700 mb-2">
                Ajoute la date et l'heure du crime
              </Text>
              <DatePickerButton
                onPress={() => setShowDatePicker(true)}
                value={formatDateTime(date)}
                placeholder="Sélectionner la date et l'heure"
              />
            </View>

            {user && (
              <View>
                <Text className="text-gray-700 mb-2">Visibilité</Text>
                <SelectButton
                  title={
                    selectedVisibility === "public"
                      ? "Publique"
                      : selectedVisibility === "friends"
                      ? "Amis uniquement"
                      : "Privé"
                  }
                  icon="chevron-down"
                  onPress={() => setShowPicker(true)}
                />
              </View>
            )}
            <View>
              <Text className="text-gray-700 mb-2">
                Raconte une anecdote croustillante
              </Text>
              <Input
                multiline
                numberOfLines={4}
                placeholder="Raconter une anecdotre croustillante, comment ça s'est passé, quel était l'état dans lequel vous étiez..."
                className="h-32"
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {user && selectedVisibility === "public" && (
              <View className="flex-row items-center justify-between mt-4 mb-8">
                <View className="flex-1">
                  <Text className="text-gray-700 mb-1">Publier en anonyme</Text>
                  <Text className="text-gray-500 text-sm">
                    Votre nom sera anonymisé mais l'anecdote et le lieu seront
                    public
                  </Text>
                </View>
                <Switch
                  value={anonym}
                  onValueChange={setAnonym}
                  className="ml-4"
                  trackColor={{ false: "#E5E7EB", true: "#FEE2E2" }}
                  thumbColor={anonym ? "#DC2626" : "#9CA3AF"}
                />
              </View>
            )}

            <View className="mb-8">
              <Text className="text-gray-700 mb-2">Note ton expérience</Text>
              <RatingBar rating={rating} onRatingChange={setRating} />
            </View>

            <Button
              title="Envoyer mon SexPin 📍"
              onPress={handleSubmit}
              loading={loading}
              className="mt-4"
            />

            {error && (
              <Text className="text-red-500 text-center mt-2">{error}</Text>
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
          setSelectedVisibility(value as "public" | "private" | "friends");
          setShowPicker(false);
        }}
      />
    </View>
  );
};
