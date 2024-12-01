import { Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function Profile() {
  const { data: user, isLoading } = useAuth();
  const { signOut, loading } = useAuthActions();
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View>
        <Text className="text-red-500 text-2xl font-bold text-center">
          {user.displayName || user.email}
        </Text>
        <Button 
          title="Se déconnecter" 
          onPress={signOut}
          loading={loading}
        />
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
