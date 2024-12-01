import { View, Text, TouchableOpacity } from "react-native";
import { Header } from "../organisms/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

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

  const filters: {
    type: FilterType;
    label: string;
    icon: IconName;
    disabled?: boolean;
  }[] = [
    { type: "public", label: "SexPins publics", icon: "earth" },
    {
      type: "friends",
      label: "SexPins des amis",
      icon: "account-group",
      disabled: !user || !hasFriends,
    },
    { type: "private", label: "Mes SexPins", icon: "lock" },
  ];

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
              onPress={() => {
                if (!disabled) {
                  onFilterChange(type);
                  onClose();
                }
              }}
              disabled={disabled}
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
              <Text className="flex-1 text-gray-700 font-medium">{label}</Text>
              {disabled && (
                <MaterialCommunityIcons name="lock" size={20} color="#666" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
