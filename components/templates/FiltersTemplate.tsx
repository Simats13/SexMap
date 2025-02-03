import { View, Text, TouchableOpacity } from "react-native";
import { Header } from "../organisms/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Snackbar } from "@/components/atoms/Snackbar";
import { useState } from "react";

type FilterType = "public" | "friends" | "private";
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface FiltersTemplateProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClose: () => void;
  hasFriends?: boolean;
}

export const FiltersTemplate = ({
  selectedFilter,
  onFilterChange,
  onClose,
  hasFriends = false,
}: FiltersTemplateProps) => {
  const { data: user } = useAuth();
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const filters: {
    type: FilterType;
    label: string;
    icon: IconName;
    disabled?: boolean;
  }[] = [
    { type: "public", label: "LovePins publics", icon: "earth" },
    {
      type: "friends",
      label: "LovePins des amis",
      icon: "account-group",
      disabled: !user || !hasFriends,
    },
    { type: "private", label: "Mes LovePins", icon: "lock" },
  ];

  const handleFilterPress = (type: FilterType) => {
    if (type === "friends" && (!user || !hasFriends)) {
      setShowSnackbar(true);
      return;
    }

    onFilterChange(type);
    onClose();
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Filtres" onClose={onClose} />
      <View className="p-6">
        <Text className="text-gray-500 mb-4 text-sm">
          Sélectionnez les pins à afficher sur la carte
        </Text>
        <View className="space-y-4">
          {filters.map(({ type, label, icon, disabled }) => (
            <TouchableOpacity
              key={type}
              className={`flex-row items-center p-4 bg-gray-50 rounded-xl ${
                disabled ? "opacity-50" : ""
              }`}
              onPress={() => handleFilterPress(type)}
            >
              <View className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 items-center justify-center">
                {selectedFilter === type && (
                  <View className="w-4 h-4 rounded-full bg-red-500" />
                )}
              </View>
              <MaterialCommunityIcons
                name={icon}
                size={24}
                color="#666"
                className="mr-3"
              />
              <Text className="text-lg font-semibold">{label}</Text>
              {disabled && (
                <MaterialCommunityIcons name="lock" size={20} color="#666" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {showSnackbar && (
        <Snackbar
          message="Vous devez ajouter des amis, pour cela rendez-vous sur la page *Actualités* puis l'onglet *Amis* pour pouvoir en ajouter"
          action={{
            label: "Y ALLER",
            onPress: () => {
              onClose();
              router.push("/modals/friendsList");
            },
          }}
          onDismiss={() => setShowSnackbar(false)}
        />
      )}
    </View>
  );
};
