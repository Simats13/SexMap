import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GlyphMap } from "@expo/vector-icons/build/createIconSet";

interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddTag: (value: string) => void;
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
  suggestions?: string[];
  filteredSuggestions: string[];
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const TagInput = ({
  tags,
  inputValue,
  onInputChange,
  onAddTag,
  onRemoveTag,
  placeholder,
  filteredSuggestions = [],
  icon,
}: TagInputProps) => {
  return (
    <View className="mb-6">
      <View className="flex-row flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <View
            key={tag}
            className="bg-red-100 rounded-full px-3 py-1 flex-row items-center"
          >
            <Text className="text-red-800 mr-1">{tag}</Text>
            <TouchableOpacity onPress={() => onRemoveTag(tag)}>
              <MaterialCommunityIcons
                name="close-circle"
                size={16}
                color="#991B1B"
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View>
        <View className="bg-gray-50 flex-row items-center border border-gray-300 rounded-lg p-3 min-h-[50px]">
          <TextInput
            value={inputValue}
            onChangeText={onInputChange}
            onSubmitEditing={() => onAddTag(inputValue)}
            placeholder={placeholder}
            placeholderTextColor={"#4a5568"}
            className="flex-1 text-base "
            returnKeyType="done"
          />
          {inputValue.trim() && (
            <TouchableOpacity
              onPress={() => onAddTag(inputValue)}
              className="ml-2"
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color="#DC2626"
              />
            </TouchableOpacity>
          )}
        </View>
        {filteredSuggestions.length > 0 && (
          <View className="absolute top-[52px] left-0 right-0 border border-gray-200 rounded-lg bg-white z-10 shadow-sm">
            <ScrollView className="max-h-40">
              {filteredSuggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  onPress={() => onAddTag(suggestion)}
                  className="p-3 border-b border-gray-100 flex-row items-center"
                >
                  <MaterialCommunityIcons name={icon} size={20} color="#666" />
                  <Text className="ml-2 text-base">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};
