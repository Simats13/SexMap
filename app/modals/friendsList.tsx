import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "@/components/organisms/Header";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useFriends } from "@/hooks/useFriends";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "@/config/firebase";

type TabType = "added" | "pending";

interface FriendRequest {
  id: string;
  displayName: string;
}

interface UserData {
  display_name: string;
  created_time: string;
  friendsList: string[];
  friendsPending: string[];
  friendsRequest: string[];
  email: string;
  linkId: string;
  locationsList: string[];
  partners: string[];
  uid: string;
}

export default function FriendsListModal() {
  const [activeTab, setActiveTab] = useState<TabType>("added");
  const { data: user } = useAuth();
  const { data: pendingRequests = [] } = useFriendRequests(user?.uid);
  const { data: friends = [] } = useFriends(user?.uid);
  const router = useRouter();

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      friendsList: arrayRemove(friendId),
    });
  };

  const handleAcceptFriend = async (friendId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      friendsList: arrayUnion(friendId),
      friendsRequest: arrayRemove(friendId),
    });
    await updateDoc(doc(db, "users", friendId), {
      friendsList: arrayUnion(user.uid),
      friendsPending: arrayRemove(user.uid),
    });
  };

  const handleRejectFriend = async (friendId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      friendsRequest: arrayRemove(friendId),
    });
    await updateDoc(doc(db, "users", friendId), {
      friendsPending: arrayRemove(user.uid),
    });
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Amis" onClose={() => router.back()} />

      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 ${
            activeTab === "added" ? "border-b-2 border-red-500" : ""
          }`}
          onPress={() => setActiveTab("added")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "added" ? "text-red-500" : "text-gray-600"
            }`}
          >
            Ajoutés
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${
            activeTab === "pending" ? "border-b-2 border-red-500" : ""
          }`}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "pending" ? "text-red-500" : "text-gray-600"
            }`}
          >
            En attente
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {activeTab === "added" ? (
          <View className="space-y-2">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="account" size={24} color="#666" />
                    <Text className="ml-3 font-medium">{friend.displayName}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveFriend(friend.id)}
                    className="p-2"
                  >
                    <MaterialCommunityIcons name="trash-can" size={20} color="red" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center py-8">
                <MaterialCommunityIcons
                  name="account-group"
                  size={48}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 text-center mt-4">
                  Vous n'avez pas encore d'amis.{"\n"}
                  Ajoutez des amis pour partager vos expériences !
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="space-y-2">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <TouchableOpacity
                  key={request.id}
                  className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="account"
                      size={24}
                      color="#666"
                    />
                    <Text className="ml-3 font-medium">
                      {request.displayName}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => handleAcceptFriend(request.id)}
                      className="p-2"
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color="green"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRejectFriend(request.id)}
                      className="p-2"
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={20}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center py-8">
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={48}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 text-center mt-4">
                  Aucune demande d'ami en attente.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
