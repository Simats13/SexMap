import { User } from "firebase/auth";
import { ScrollView, View, Text, Switch, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Header } from "../organisms/Header";
import { SelectButton } from "../molecules/SelectButton";
import { DatePickerButton } from "../molecules/DatePickerButton";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { DateTimePickerModal } from "../organisms/DateTimePickerModal";
import { VisibilityPickerModal } from "../organisms/VisibilityPickerModal";
import { RatingBar } from "../atoms/RatingBar";
import { LocationPicker } from "../molecules/LocationPicker";
import { TagInput } from "../molecules/TagInput";
import { AddPinParams } from "@/hooks/useAddPin";

interface AddSexTemplateProps {
  user: User | null;
  loading?: boolean;
  error?: string | null;
  partners: Array<{ label: string; value: string }>;
  selectedPartners: Array<{ label: string; value: string }>;
  onUpdatePartners: (tags: string[]) => void;
  onSubmit: (data: AddPinParams) => void;
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
  isSolo: boolean;
  setIsSolo: (isSolo: boolean) => void;
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
  selectedPartners,
  onUpdatePartners,
  onSubmit,
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
  isSolo,
  setIsSolo,
}: AddSexTemplateProps) => {
  const handleSubmit = () => {
    onSubmit({
      date,
      description,
      location,
      rating,
      visibility: selectedVisibility,
      anonym,
      partners: selectedPartners.map((p) => p.value),
      locationName: selectedLocations.map((p) => p.value).join(", "),
      solo: isSolo,
    });
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Ajouter un LovePin" onClose={onClose} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View className="p-4">
            <View className="mb-6">
              <Text className="text-gray-700 mb-2">
                Sélectionne le lieu précis de tes ébats :
              </Text>
              <LocationPicker onLocationChange={setLocation} />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2">Type d'expérience :</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={() => setIsSolo(true)}
                  className={`flex-1 p-4 rounded-lg border ${
                    isSolo ? "bg-red-50 border-red-500" : "border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-center ${
                      isSolo ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    Solo ✊
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsSolo(false)}
                  className={`flex-1 p-4 rounded-lg border ${
                    !isSolo ? "bg-red-50 border-red-500" : "border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-center ${
                      !isSolo ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                     plusieurs 🤝🏻
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {!isSolo && user && (
              <>
                <Text className="text-gray-700 mb-2">
                  Sélectionne un.e de tes ami.e.s ou saisi son nom :
                </Text>
                <TagInput
                  tags={selectedPartners.map((p) => p.value)}
                  inputValue={partnersInput}
                  onInputChange={setPartnersInput}
                  onAddTag={(tag) =>
                    onUpdatePartners([
                      ...selectedPartners.map((p) => p.value),
                      tag,
                    ])
                  }
                  onRemoveTag={(tag) =>
                    onUpdatePartners(
                      selectedPartners
                        .map((p) => p.value)
                        .filter((t) => t !== tag)
                    )
                  }
                  placeholder="Ajouter un partenaire de crime ..."
                  filteredSuggestions={partnersFiltered}
                  icon="account"
                />
              </>
            )}

            {user && (
              <>
                <Text className="text-black mb-2">
                  Sélectionne un de tes lieux favoris ou saisi son nom :
                </Text>
                <TagInput
                  tags={selectedLocations.map((p) => p.value)}
                  inputValue={locationsInput}
                  onInputChange={setLocationsInput}
                  icon="map-marker"
                  onAddTag={(tag) =>
                    onUpdateLocations([
                      ...selectedLocations.map((p) => p.value),
                      tag,
                    ])
                  }
                  onRemoveTag={(tag) =>
                    onUpdateLocations(
                      selectedLocations
                        .map((p) => p.value)
                        .filter((t) => t !== tag)
                    )
                  }
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
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                placeholder="Description (optionnelle)"
                style={{ 
                  height: 120,
                  marginBottom: 20,
                  textAlignVertical: 'top',
                  paddingTop: 10,
                  paddingHorizontal: 10,
                  backgroundColor: '#fff'
                }}
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
              title="Envoyer mon LovePin 📍"
              onPress={handleSubmit}
              loading={loading}
              className="mt-4"
            />

            {error && (
              <Text className="text-red-500 text-center mt-2">{error}</Text>
            )}
          </View>
        </ScrollView>

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
      </KeyboardAvoidingView>
    </View>
  );
};
