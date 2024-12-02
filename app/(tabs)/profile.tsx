import { Text, View, ScrollView, Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "expo-router";
import { auth } from "@/config/firebase";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { Ionicons } from "@expo/vector-icons";
import { useFriends } from "@/hooks/useFriends";
import { useUserStats } from "@/hooks/useUserStats";
import { Share } from "react-native";

// Ajout des types pour les statistiques
type StatItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  onPress?: () => void;
};

const StatItem = ({ icon, value, label, onPress }: StatItemProps) => (
  <Pressable
    onPress={onPress}
    className="items-center p-4 bg-white rounded-lg shadow-sm w-[45%] mb-4"
  >
    <Ionicons name={icon} size={24} color="#4B5563" />
    <Text className="text-2xl font-bold mt-2">{value}</Text>
    <Text className="text-gray-500 text-sm">{label}</Text>
  </Pressable>
);

export default function Profile() {
  const { data: user, isLoading } = useAuth();
  const { signOut, loading } = useAuthActions();
  const { data: friends = [] } = useFriends(user?.uid);
  const { data: stats = { locations: 0, pins: 0, partners: 0 } } = useUserStats(
    user?.uid
  );
  const router = useRouter();

  const handleShare = async () => {
    if (!user) return;
    try {
      const shareLink = `Hey ajoute moi dès maintenant sur SexMap via ce lien : sexmap://sexmap.com/addFriend/${user.displayName}`;
      await Share.share({
        message: shareLink,
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6 pb-24">
          {/* En-tête du profil */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-gray-300 rounded-full mb-4 items-center justify-center">
              <Text className="text-2xl text-white">
                {user.displayName?.[0] || user.email?.[0] || "?"}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              {user.displayName || user.email}
            </Text>
          </View>

          {/* Grille de statistiques */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-4 text-gray-800">
              Mes statistiques
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <StatItem
                icon="people-outline"
                value={friends?.length || 0}
                label="Amis"
                onPress={() => router.push("/modals/friendsList")}
              />
              <StatItem
                icon="location-outline"
                value={stats.locations}
                label="Lieux visités"
              />
              <StatItem
                icon="pin-outline"
                value={stats.pins}
                label="Pins créés"
              />
              <StatItem
                icon="people-circle-outline"
                value={stats.partners}
                label="Rencontres"
              />
            </View>
          </View>

          {/* Actions */}
          <View className="space-y-4">
            <View className="mb-4">
              <Button
                title="Mes lieux favoris"
                onPress={() => {}}
                variant="secondary"
                icon="heart"
              />
            </View>
            <View className="mb-4">
              <Button
                title="Partager mon profil"
                onPress={handleShare}
                variant="secondary"
                icon="share"
              />
            </View>
            <View className="mb-4">
              <Button
                title="Se déconnecter"
                onPress={signOut}
                loading={loading}
                variant="primary"
                icon="log-out"
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
