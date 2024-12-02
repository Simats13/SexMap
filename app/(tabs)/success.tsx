import { View, Text, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AchievementCard = ({ achievement }: { achievement: any }) => (
  <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
    <View className="flex-row items-center mb-2">
      <View
        className={`w-12 h-12 rounded-full items-center justify-center ${
          achievement.unlocked ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        <Ionicons
          name={achievement.icon}
          size={24}
          color={achievement.unlocked ? "#22C55E" : "#9CA3AF"}
        />
      </View>
      <View className="ml-4 flex-1">
        <Text className="font-bold text-lg text-gray-800">
          {achievement.title}
        </Text>
        <Text className="text-gray-600">{achievement.description}</Text>
      </View>
    </View>
    <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
      <View
        className={`h-full ${
          achievement.unlocked ? "bg-green-500" : "bg-blue-500"
        }`}
        style={{ width: `${achievement.progress}%` }}
      />
    </View>
    <Text className="text-right text-sm text-gray-500 mt-1">
      {Math.round(achievement.progress)}%
    </Text>
  </View>
);

export default function Success() {
  const { data: user } = useAuth();
  const { data: achievementsData, isLoading } = useAchievements(user?.uid);
  const router = useRouter();

  if (!user) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="flex-1 bg-gray-50 p-6">
          <View className="bg-white rounded-2xl p-6 shadow-md">
            <View className="items-center mb-6">
              <View className="bg-blue-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="trophy" size={40} color="red" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                Débloquez vos succès
              </Text>
              <Text className="text-gray-600 text-center mb-4">
                Créez un compte pour suivre votre progression et débloquer des
                récompenses exclusives
              </Text>
            </View>

            {/* Aperçu des succès verrouillés */}
            <View className="mb-6">
              <View className="opacity-50">
                <AchievementCard
                  achievement={{
                    title: "Premier pas",
                    description: "Complétez votre premier objectif",
                    icon: "flag",
                    unlocked: false,
                    progress: 0,
                  }}
                />
              </View>
              <View className="opacity-30">
                <AchievementCard
                  achievement={{
                    title: "Explorer",
                    description: "Visitez 5 nouveaux endroits",
                    icon: "compass",
                    unlocked: false,
                    progress: 0,
                  }}
                />
              </View>
            </View>

            <View className="items-center">
              <Text
                className="bg-red-500 text-white font-bold py-3 px-8 rounded-full text-center"
                onPress={() => {
                  router.push("/modals/auth");
                }}
              >
                Se connecter
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Mes Succès
        </Text>
        <Text className="text-gray-600">
          {achievementsData?.unlockedCount || 0} /{" "}
          {achievementsData?.achievements.length} débloqués
        </Text>
      </View>

      {achievementsData?.achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </ScrollView>
  );
}
