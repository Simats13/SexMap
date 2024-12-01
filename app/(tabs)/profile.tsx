import { Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "expo-router";

export default function Profile() {
  const { data: user } = useAuth();
  const router = useRouter();

  if (user) {
    return (
      <View>
        <Text className="text-red-500 text-2xl font-bold text-center">
          Profile
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-gray-500 text-center mb-4">
        Connecte-toi pour accéder à ton profil
      </Text>
      <Button 
        title="Se connecter" 
        onPress={() => router.push("/modals/auth")}
      />
    </View>
  );
}
